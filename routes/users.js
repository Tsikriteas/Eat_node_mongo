const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Route register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, customerAddress, customerPhone } = req.body;
    const user = new User({ username, password, role, customerAddress, customerPhone });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route login
router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log((req.user));
  if (req.user.username === 'admin') {
    res.redirect('/merchantDashboard.html'); // Σελίδα για merchants
  } else {
    res.redirect('/index.html'); // Σελίδα για απλούς χρήστες
  }
});

// Route disconnect
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});


// check user connection
router.get('/user', (req, res) => {

  if (req.session && req.session.passport && req.session.passport.user) {
    res.status(200).json({ user : req.user });
  } else {
    // Αν ο χρήστης δεν είναι συνδεδεμένος, επιστρέφουμε κατάλληλο μήνυμα λάθους
    res.status(401).json({ message: 'fanis not authenticated' });
  }
});

module.exports = router;
