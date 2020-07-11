const express = require('express');
const UserAuth = require('../middlewares/Authenticate');

const router = express.Router();

// router.use('/', UserAuth.authenticate, require('./users'));  // users route with authenticate middleware
router.use('/', UserAuth.authenticate, require('./events')); // events route with authenticate middleware

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
