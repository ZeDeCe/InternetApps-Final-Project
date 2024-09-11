require("custom-env").env(process.env.NODE_ENV, "./config")

const express = require('express');
const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const userpageRouter = require('./routes/user_page')
const session = require('express-session')
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo");
const items = require('./routes/items')


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
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter);
app.use('/login', loginRouter)
app.use('/user_page', userpageRouter)
app.use('/items', items)
app.use('/search', items) //כל מי שפונה אליך ל/search תפנה אותו למה שיש בפרמטר items
app.use('/about', aboutRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)

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
