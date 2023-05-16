const Employee = require('../models/employees.model');

exports.getAll = async (req, res) => {
    try {
    res.json(await Employee.find().populate('department'));
    }
    catch(err) {
    res.status(500).json({ message: err });
    }
   };

exports.getRandom = async (req, res) => {
    try {
    const count = await Employee.countDocuments();
    const random = Math.floor(Math.random() * count);
    const emp = await Employee.findOne().populate('department').skip(random);
    if(!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
    }
    catch(err) {
    res.status(500).json({ message: err });
    }
   };

exports.getById = async (req, res) => {
    try {
      const employee = Employee.findById(req.params.id).populate('department');
      if(!employee) res.status(404).json({ message: 'Not found' }) 
      else res.json(await employee);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

exports.post = async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
  const newEmployee = new Employee({ firstName: firstName }, {lastName: lastName}, {department: department});
  await newEmployee.save();
  res.json({ message: 'OK' });
  } catch(err) {
  res.status(500).json({ message: err });
  }
 };

exports.putById = async (req, res) => {
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
};

exports.deleteById = async (req, res) => {
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
  };