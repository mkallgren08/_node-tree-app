const Child = require('../../models/child');
const express = require('express');
const router = express.Router();
const pusher = require('./../../utils/pusher')


/* CREATE */
router.post('/new', (req, res) => {
  // console.log(Child)
  // console.log(req.body)
  Child.create(req.body, (err, child) => {
    if (err) {
      console.log('CREATE Error: ' + err);
      res.status(500).send('Error');
    } else {
      res.status(200).json(child);
    }
  });
});

/* PUSHER 'DONE' EVENT*/
// CHECK IF THIS ONE CAN BE DELETED
router.post('/done', (req, res) => {
  //console.log(Child)
  console.log(req.body)
  pusher.trigger('my-channel', 'my-event', {
    "message": "hello world"
  }, (err)=> {
    if (err) {
      res.status(500).send('Error')
    } else {
      res.status(200).send('Done')
    }
  });
});

/* UPDATE */
router.post('/edit/:id', (req, res) => {
  console.log(req.body)
  Child.findOneAndUpdate(
    { _id: req.params.id }, { $set: { name: req.body.newName } },
    { new: true }, (err, child) => {
      if (err) {
        console.log(`UPDATE Error: ${err}`)
        res.status(500).send('Error')
      } else if (child) {
        res.status(200).json(child)
      } else {
        res.status(404).send('Not found');
      }
    })
});

/* DELETE */
router.route('/delete/:id')
  .delete((req, res) => {
    // console.log(req.params.id)
    Child.findById(req.params.id, (err, child) => {
      if (err) {
        console.log('DELETE Error: ' + err);
        res.status(500).send('Error');
      } else if (child) {
        child.remove(() => {
          res.status(200).json(child);
        });
      } else {
        res.status(404).send('Not found');
      }
    });
  });
/* DELETE MANY*/
router.route('/deleteMany/:id')
  .delete((req, res) => {
    // console.log(req.params.id)
    Child.deleteMany({ parent: req.params.id }, (err, child) => {
      if (err) {
        console.log('DELETE Error: ' + err);
        res.status(500).send('Error');
      } else if (child) {
        res.status(200).json(child)
      } else {
        res.status(404).send('Not found');
      }
    })
  });

/* FIND ALL */
router.get("/nodes", (req, res) => {
  //console.log(req.query)
  Child.find(req.query, (err, task) => {
    if (err) {
      console.log('Error Getting Tasks: ' + err);
      res.status(500).send('Error');
    } else if (task) {
      //console.log(task)
      res.status(200).json(task);
    } else {
      res.status(404).send('Not found');
    }
  })
})

module.exports = router;