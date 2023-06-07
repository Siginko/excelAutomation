if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const filePath = require('path')
const os = require('os');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverrride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const {tomorrowDate} = require('./utils/dates')
const invoices = require('./routes/invoices')
const suppliers = require('./routes/suppliers')
const admin = require('./routes/admin')
const users = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL;
const MongoStore = require('connect-mongo')
const secret = process.env.SECRET || 'testingsecret'

const app = express();
mongoose.connect(dbUrl);

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverrride('_method'));
app.use(express.static('public'));
app.use(mongoSanitize({
    allowDots: true,
  }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net",
    
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://stackpath.bootstrapcdn.com/",
];
const connectSrcUrls = [
    "https://cdn.jsdelivr.net/",
];

app.use(
helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
        ],
        fontSrc: ["'self'"],
        mediaSrc   : [ ],
        childSrc   : [ "blob:" ]
        },
    })
);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on('error', function(e){
    console.log('session store error', e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: 'false', 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 *60 * 24 * 7 * 4 * 3, 
        maxAge: 1000 * 60 *60 * 24 * 7 * 4 * 3,
    }
}
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.tmrrw = tomorrowDate;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.info = req.flash('info')
    next();
})

app.use("/invoices", invoices)
app.use('/suppliers', suppliers)
app.use('/admin', admin)
app.use('/', users)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if (!err.message) err.message = 'Something went wrong.'
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})