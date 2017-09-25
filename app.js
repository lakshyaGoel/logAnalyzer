var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var app = express();
var multer = require('multer')
var upload = multer({
    storage: multer.memoryStorage()
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.post('/upload-file-ajax', upload.single('ajaxfile'), function (req, res) {
    if (!req.file) {
        res.status(500).send('error: no file');
    }
    // actually do something with file...
    if (req.file.mimetype == 'text/plain') {
        var text = req.file.buffer.toString('utf8');
        console.log('contents of file:', text);
    }
    else {
        console.log('got a non-text file. here are some bytes:');
        console.log(req.file.buffer);
    }
    res.json({
        'filename': req.file.originalname
        , 'mimetype': req.file.mimetype
        , 'size (bytes)': req.file.size
        , 'fileContent': text
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;