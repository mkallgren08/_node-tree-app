// const router = require("express").Router();
// const testdataRoutes = require('./testdata.js');

// //  routes
// router.use("/testdata", testdataRoutes);

// module.exports = router;


const Child = require('../../models/child');
const express = require('express');
const router = express.Router();


/* CREATE */
router.post('/new', (req, res) => {
  console.log(Child)
  Child.create({
    nodetype: req.body.type,
    parent: req.body.parent,
    name: req.body.name,
    value: req.body.value
  }, (err, task) => {
    if (err) {
      console.log('CREATE Error: ' + err);
      res.status(500).send('Error');
    } else {
      res.status(200).json(task);
    }
  });
});

router.route('/:id')
  /* DELETE */
  .delete((req, res) => {
    Task.findById(req.params.id, (err, task) => {
      if (err) { 
        console.log('DELETE Error: ' + err);
        res.status(500).send('Error');
      } else if (task) {
        task.remove( () => {
          res.status(200).json(task);
        });
     } else {
        res.status(404).send('Not found');
      }
    });
  });

/* FIND ALL */
router.get("/nodes", (req,res) => {
  console.log(req.query)
    Child.find(req.query,(err,task) => {
      if (err){
        console.log('Error Getting Tasks: ' + err);
        res.status(500).send('Error');
      } else if (task) {
        console.log(task)
        res.status(200).json(task);
      } else {
        res.status(404).send('Not found');
      }
    })
        // .sort({date:-1})
        // .then(dbTask => res.json(dbTask))
        // .catch(err => res.status(422).json(err))
  })

module.exports = router;