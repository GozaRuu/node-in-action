const querystring = require('querystring');

const sendHtml = (res, html) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
};

const parseRequest = (req, callback) => {
  var body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    const data = querystring.parse(body);
    callback(data);
  });
};

const creatHtmlPage =  (content) => {
  return `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title>Poem Contest</title>
    </head>
    <body>
      ${content}
      <form action="/" method="post">
        Date (YYYY-MM-DD):<br>
        <input type="date" name="date"><br><br>
        Author Name:<br>
        <input type="text" name="author"><br><br>
        Poem :<br>
        <textarea name="Poem" rows="8" cols="80"></textarea><br><br>
        <input type="submit" value="Register">
      </form>
    </body>
  </html>
  `;
};

exports.show = (res) => {
  const html = createHtmlPage('<a href="/show">Show Registered Poems</a><br>');
  sendHtml(res,html);
};

exports.showRegistered = (db, req, res) => {
  const registeredPeoms = '';
  db.query(`SELECT * FROM peom ORDER BY date DESC`,
    (err, rows) => {
      if (err) throw err;
      if (rows != []) {
        registeredPeoms = `<table>`;
        rows.forEach((row) => {
          registeredPeoms += `
            <tr>
              <td>${row.date}</td>
              <td>${row.author}</td>
              <td>${row.peom}</td>
              <td>
                <form method="POST" action="/delte">
                  <input type="hidden" name="id" value="${row.id}">
                  <input type="submit" value="delete">
                </form>
              </td>
            </tr>
        `});
        registeredPeoms += `</table>`;
      }
      const html = createHtmlPage(registeredPeoms);
      console.log(html);
      sendHtml(res,html);
    }
  );
};

exports.register = (db, req, res) => {
  parseRequest(req, (data) => {
    db.query(
      `INSERT INTO poem (date, author, peom)
      VALUES (?, ?, ?)`,
    [data.date, data.author, data.peom],
    (err) => {
      if (err) throw err;
      exports.show(db, res);
    });
  });
};

exports.delete = (db, req, res) => {
  parseRequest(req, (data) => {
    db.query(
      `DELETE from poem WHERE id=?`,
    [data.id],
    (err) => {
      if (err) throw err;
      exports.show(db, res);
    });
  });
};
