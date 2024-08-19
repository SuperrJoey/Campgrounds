const User = require('../models/user');
const { remove } = require('../models/user');

module.exports.renderRegForm = (req, res) => {
    res.render('users/register');
};

module.exports.createNewUser = async (req, res, next) => {
    try {
    const { email, username, password} = req.body;
    const user = new User ({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next (err);
        req.flash('success', "Welcome to Scene");
        res.redirect('/campgrounds')
    })} 
    catch(e){
        if (e.name === 'UserExistsError'){
            req.flash('error', 'A user with the given username already exists');
            return res.redirect('/register');
        }
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.Login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res) => {
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        req.flash('Success!', 'Logged Out!')
        res.redirect('/campgrounds');
    });

}