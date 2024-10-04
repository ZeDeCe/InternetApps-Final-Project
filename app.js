require("custom-env").env(process.env.NODE_ENV, "./config")

const express = require('express');
const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const userpageRouter = require('./routes/user_page')
const aboutRouter = require('./routes/about')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order')
const items = require('./routes/items')

const session = require('express-session')
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo");


mongoose.connect(process.env.DB_URL)
const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore(
    {
        mongoUrl: process.env.DB_URL + 'session-store'
    }
)
}))

app.set("view engine", "ejs")
app.use(express.json());
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.set('views', [__dirname + '/views', __dirname + "/views/policies"])

app.use('/', indexRouter);
app.use('/login', loginRouter)
app.use('/user_page', userpageRouter)
app.use('/items', items)
app.use('/search', items) 
app.use('/about', aboutRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/order', orderRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.render('error.ejs');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT)