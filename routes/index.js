const express = require('express');
const path = require('path');

const UserAuth = require('../middlewares/authenticate');

const router = express.Router();

router.post('/login', UserAuth.authenticate);

// router.use('/', UserAuth.authenticate, require('./Users'));  // users route with authenticate middleware
router.use('/api/events', UserAuth.isLoggedIn, require('./events'));
// events route with authenticate middleware

router.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'build', 'index.html'));
});

module.exports = router;
