var express = require('express')
 , favicon = require('serve-favicon')
 , stylus = require('stylus')
 , nib = require('nib');

var app = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views',__dirname + '/views');
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/img/favicon.ico'));

require('./routes')(app);

app.use('/public', stylus.middleware(
  { src: __dirname + '/public' , compile: compile }
))
app.use('/public', express.static(__dirname + '/public'))

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('manchesterbins listening at http://%s:%s', host, port)
})
