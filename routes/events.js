const express = require('express');

const router = express.Router();
const Event = require('../controllers/eventController');

router.get('/list', Event.list); // list all events

router.post('/insert', Event.insert); // insert event

router.delete('/delete/:eventId', Event.remove); // delete event

module.exports = router;
