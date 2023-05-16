const express = require('express');
const router = express.Router();
const Employee = require('../models/employees.model');

router.get('/employees', async (req, res) => {
  try {
  res.json(await Employee.find());
  }
  catch(err) {
  res.status(500).json({ message: err });
  }
 });

 router.get('/employees/random', async (req, res) => {
  try {
  const count = await Employee.countDocuments();
  const random = Math.floor(Math.random() * count);
  const emp = await Employee.findOne().skip(random);
  if(!emp) res.status(404).json({ message: 'Not found' });
  else res.json(emp);
  }
  catch(err) {
  res.status(500).json({ message: err });
  }
 });

 router.get('/employees/:id', async (req, res) => {
  try {
    const employee = Employee.findById(req.params.id);
    if(!employee) res.status(404).json({ message: 'Not found' }) 
    else res.json(await employee);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/employees', async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
  const newEmployee = new Employee({ firstName: firstName }, {lastName: lastName}, {department: department});
  await newEmployee.save();
  res.json({ message: 'OK' });
  } catch(err) {
  res.status(500).json({ message: err });
  }
 });

router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;

  try {
  const emp = await Employee.findById(req.params.id);
  if(emp) {
  const updatedEmp = await Employee.updateOne(
    {_id: req.params.id}, {$set: { firstName: firstName, lastName: lastName, department: department}}, { new: true });
  res.json(updatedEmp);
    } else {
      res.status(404).json({ message: 'Not found...' })
    }
  } 
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/employees/:id', (req, res) => {
  req.db.collection('employees').deleteOne({ _id: ObjectId(req.params.id) }, (err, data) => {
    if (err) res.status(500).json({ message: err });
    else if (!data) res.status(404).json({ message: 'Not found' });
    else res.json(data);
  });
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if(!employee) res.status(404).json({ message: 'Not found' }) 
    else {
      await Employee.deleteOne({_id: req.params.id})
      res.json(employee);
    };
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
