const FileController = require('./controllers/fileController');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

module.exports = function(app){

  //view index.html
  app.get('/', function(req, res){
    res.render('index');
  });

  //File Routes
  app.post('/api/upload', multipartMiddleware, FileController.upload);

};
