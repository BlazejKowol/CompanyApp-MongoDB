const Department = require('../models/departments.model');

exports.getAll = async (req, res) => {
    try {
    res.json(await Department.find());
    }
    catch(err) {
    res.status(500).json({ message: err });
    }
   };

exports.getRandom = async (req, res) => {
    try {
    const count = await Department.countDocuments(); // zlicza ilość wszystkich dokumentów w kolekcji
    const random = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(random); // skip pomija dowolną ilość dokumentów przy wyszukiwaniu
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
    }
    catch(err) {
    res.status(500).json({ message: err });
    }
   };

exports.getById = async (req, res) => {
    try {
      const department = Department.findById(req.params.id);
      if(!department) res.status(404).json({ message: 'Not found' }) 
      else res.json(await department);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };

exports.post = async (req, res) => {
    try {
    const { name } = req.body;
    const newDepartment = new Department({ name: name });
    await newDepartment.save();
    res.json({ message: 'OK' });
    } catch(err) {
    res.status(500).json({ message: err });
    }
   };

exports.putById = async (req, res) => {
    const { name } = req.body;
  
    try {
    const dep = await Department.findById(req.params.id);
    if(dep) {
    const updatedDep = await Department.updateOne({_id: req.params.id}, {$set: {name: name}}, { new: true })
    res.json(updatedDep);
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
      const department = await Department.findById(req.params.id); // czy tu musi być await też? w get by id nie ma?
      if(!department) res.status(404).json({ message: 'Not found' }) 
      else {
        await Department.deleteOne({_id: req.params.id})
        res.json(department);
      };
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  };