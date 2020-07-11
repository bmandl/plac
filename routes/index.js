const express = require('express');
const UserAuth = require('../middlewares/authenticate');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// router.use('/', UserAuth.authenticate, require('./Users'));  // users route with authenticate middleware
router.use('/api/events', UserAuth.authenticate, require('./events')); // events route with authenticate middleware

module.exports = router;
