var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var expbs = require('express-handlebars')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var db= require('./config/connection')
var nocache = require('nocache')

var app = express();

// view engine setup
// app.engine('hbs', hbs.engine(
  //     { extname: 'hbs', defaultLayout: 'layout', 
  //       layoutsDir: __dirname + '/views/layout/',
  //       partialsDir: __dirname + '/views/partials/' ,
  
  //     }))
  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const hbs=expbs.create({
  extname: 'hbs',defaultLayout: 'layout',
  layoutsDir:__dirname + '/views/layout/', 
  partialsDir:__dirname + '/views/partials/',
  
  helpers:{
    
    ifEquals:(value1,value2,value3,options)=>{
      
      if(value1==value2){
        if(value3){
          return options.fn(value3)
        }
        return options.fn()
      }else{
        if(value3)
        {   
          return options.inverse(value3);      
          }
          return options.inverse();   
        }
      }
    }
  })
  
app.engine('hbs', hbs.engine)

app.use(session({secret:'key',cookie:{maxAge:1000000},resave:false,saveUninitialized:false}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache())


app.use('/', userRouter);
app.use('/admin', adminRouter);

app.get('//*',(req, res)=>{
  res.render('user/error-404',{userheader:true,title:false});
});
app.get('/admin/*',(req, res)=>{ 
  res.render('admin/admin-error-404',{adminlink:true,adminheader:true});
});



db.connect((err)=>{
  if(err) console.log('connection err');
  else console.log('database connected');
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
