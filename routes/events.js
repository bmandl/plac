const express = require('express');

const router = express.Router();
const event = require('../controllers/eventController');

router.use((req, res, next) => {
  event.authClient();
  next();
});

router.get('/list', (req, res, next) => {
  /* event.list().then(
          obj => {
              const events = obj.data.items;
              if (events.length == 0) {
                  res.status(200).send('No events found.');
              }
              let text = 'Event from Google Calendar:\n';
              for (let event of events) {
                  text += ('Event name: %s, Creator name: %s, Create date: %s\n', event.summary, event.creator.displayName, event.start.date);
              }
              console.log(events);
              res.status(200).json(events);//send(text);
          },
          err => res.status(500).send(err)
      ); */
  event.list().then((data) => res.json(data));
});

router.post('/insert', (req, res, next) => {
  console.log(req.body.start);
  event.insert(req.body).then(
    (obj) => {
      // console.log(obj.data);
      console.log(obj.data.id);
      res.status(200).json(obj.data);
    },
    (err) => {
      // console.log(err);
      res.status(500).send(err);
    },
  );
});

router.delete('/delete/:eventId', (req, res, next) => {
  event.deleteEvent(req.params.eventId).then(
    (obj) => {
      res.status(200).json(obj);
    },
    (err) => {
      // console.log(err);
      res.status(500).send(err);
    },
  );
});

module.exports = router;
