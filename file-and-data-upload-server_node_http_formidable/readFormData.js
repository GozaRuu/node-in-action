const formidable = require('formidable');
const path = require('path');

const contestants = []; //this is the app data no persistence needed here, there will MongoDB projects in the repo in the future
const acceptedFields = ['authorName', 'description', 'poem']

const readFormData = (req, res) => {

  //check if we recieved correct form data
  const contentType = req.headers['content-type'] || '';
  if (contentType.indexOf('multipart/form-data') != 0) { //the multipart/form-data have to be in the beginning of content-type
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  //create and configure form
  const form = formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = './poems';
  form.maxFieldsSize = 20 * 1024 * 1024;
  form.multiples = false;
  form.parse(req); //parse request

  //recieve events from the form, add data to contestant and then push it to the array.
  const contestant = {};

  form.on('field', (field, value) => {
    if (acceptedFields.indexOf(field) != -1) contestant[field] = value;
  });

  form.on('file', (fileName, file) => {
    contestant.poem = path.resolve('./poems/' + fileName);
    // console.log(file);
  });

  form.on('error', (err) => {
    res.statusCode = 500;
    res.end('<h1>ERROR 500: Internal Server Error</h1>');
  });

  form.on('end', () => {
    contestants.push(contestant);
    res.end('<h1>We Recieved your poem, thank you very much for participating!</h1>');
  });

};

exports.readFormData = readFormData;
