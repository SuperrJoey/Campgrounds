const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const flash = require('connect-flash');
const session = require('express-session');
const { campgroundSchema } = require('./schemas');
const catchAsync = require('./Utils/catchAsync');
const methodOverride = require('method-override');
const ExpressError = require('./Utils/ExpressError');
const { stat } = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//used to use method edit

const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/rap-scene');

//useUnifiedTopology: true, this opts to use mongodb driver's new conncetion management engine which iss more reliable and stable
//useNewUrlParser: true, ensures to  use the new parser instead of the old one  

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'campsecret',
    resave: false,
    saveUninitialized: true,
    cookie : {
        //basically this enables the security of cookie incase any cross-site scrapping tries to 
        //access this and in case the user accidentally accesses a link that exploits its flaw
        httpOnly: true,
        //basically the date is in miliseconds, so converting it
        //expiration of the cookie
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//basically this code explains how to store and unstore the user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//the currentUser will be now accessible to all of the templates through this
app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email : 'devdaryaan@gmail.com', username: 'dev'})
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

const validateCamp = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else{
        next();
    }
}

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode  = 500 } = err; 
    if (!err.message) err.message = 'Oh No, Something went wrong! '
    res.status(statusCode).render('error', { err });

})

app.listen(3000, () =>{
    console.log('SERVING on port 3000')
})