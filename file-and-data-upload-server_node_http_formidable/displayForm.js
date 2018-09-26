//POST request counter
const count = 1;

//very DIY template here, use better tech like Jade/Pug in production
const body = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>upload your poem</title>
  </head>
  <body>
    <h1>Hello you are contestant number: ${count}</h1>
    <form action="/" method="post">
      Author Name:<br>
      <input type="text" name="authorName"><br><br>
      Quick Description:<br>
      <textarea type="text" name="description"></textarea><br><br>
      upload your Poem(max size: 20mb):<br>
      <input type="file" name="poem"> <br><br>
      <input type="submit" value="upload"><br>
    </form>
  </body>
</html>
`;

const incrementCount = () => count++;

const display = (res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
};

exports.display = display;
exports.incrementCount = incrementCount;
