require("custom-env").env(process.env.NODE_ENV, "./config")

const express = require('express');
const loginRouter = require('./routes/login')
const userpageRouter = require('./routes/user_page')
const aboutRouter = require('./routes/about')
const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')
const cartRouter = require('./routes/cart')
const itemsRouter = require('./routes/items')
const orderRouter = require('./routes/order')
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

app.use('/items', itemsRouter);
app.use('/search', itemsRouter);
app.use('/', itemsRouter);
app.use('/login', loginRouter)
app.use('/user_page', userpageRouter)
app.use('/about', aboutRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/cart', cartRouter);
app.use('/order', orderRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.render('error.ejs');
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

 
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT)

module.exports = app;