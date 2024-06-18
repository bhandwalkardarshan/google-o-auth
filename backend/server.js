const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const passportSetup = require('./passport-setup');
const authRoutes = require('./routes/auth-routes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Middleware
app.use(session({
    secret: process.env.COOKIE_KEY, // Use a secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use('/auth', authRoutes);

// Serve static files
app.use(express.static('../frontend'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '../frontend', 'profile.html'));
    } else {
        res.redirect('/');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
