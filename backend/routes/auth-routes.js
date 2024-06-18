const router = require('express').Router();
const passport = require('passport');

// Auth login
router.get('/login', (req, res) => {
    res.send('Login with Google');
});

// Auth logout
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// Callback route for Google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});

// Current user
router.get('/current_user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.json(null);
    }
});

module.exports = router;
