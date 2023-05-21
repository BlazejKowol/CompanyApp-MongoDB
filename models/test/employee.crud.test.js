const Employee = require('../employees.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
    before(async () => {
        try {
          await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
        } catch(err) {
          console.error(err);
        }
    }); 

  describe('Reading data', () => {

    before(async () => {
        const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        await testEmpOne.save();
    
        const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Smith', department: 'Marketing' });
        await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
        const employees = await Employee.find();
        const expectedLength = 2;
        expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with findOne method.', async () => {
        const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        expect(employee.firstName).to.be.equal('John');
        expect(employee.lastName).to.be.equal('Doe');
        expect(employee.department).to.be.equal('HR');
    });

    after(async () => {
        await Employee.deleteMany();
      });
  
  });
  
  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
        const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        await employee.save();
        expect(employee.isNew).to.be.false;
      });

    after(async () => {
        await Employee.deleteMany();
      });
  
  });

  describe('Updating data', () => {

    beforeEach(async () => {
        const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        await testEmpOne.save();
    
        const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Smith', department: 'Marketing' });
        await testEmpTwo.save();
      });

      it('should properly update one document with "updateOne" method', async () => {
        await Employee.updateOne({ firstName: 'John', lastName: 'Doe', department: 'HR' }, { $set: { firstName: '=John=', lastName: '=Doe=', department: '=HR=' }});
        const updatedEmployee = await Employee.findOne({ firstName: '=John=', lastName: '=Doe=', department: '=HR=' });
        expect(updatedEmployee).to.not.be.null;
      });
  
      it('should properly update one document with "save" method', async () => {
        const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        employee.firstName = '=John=';
        employee.lastName = '=Doe=';
        employee.department = '=HR=';
        await employee.save();
      
        const updatedEmployee = await Employee.findOne({ firstName: '=John=', lastName: '=Doe=', department: '=HR=' });
        expect(updatedEmployee).to.not.be.null;
      });
  
      it('should properly update multiple documents with "updateMany" method', async () => {
        await Employee.updateMany({}, { $set: { firstName: '=John=', lastName: '=Doe=', department: '=HR=' }});
        const employees = await Employee.find({ firstName: '=John=', lastName: '=Doe=', department: '=HR=' });
        expect(employees.length).to.be.equal(2);
      });

    afterEach(async () => {
        await Employee.deleteMany();
      });
  
  });

  describe('Removing data', () => {

    beforeEach(async () => {
        const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        await testEmpOne.save();
    
        const testEmpTwo = new Employee({ firstName: 'Amanda', lastName: 'Smith', department: 'Marketing' });
        await testEmpTwo.save();
      });
      

    it('should properly remove one document with "deleteOne" method', async () => {
        await Employee.deleteOne({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        const deletedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        expect(deletedEmployee).to.be.null;
      });
  
      it('should properly remove one document with "remove" method', async () => {
        const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        await employee.remove();
        const removedEmployee = await Employee.findOne({ firstName: 'John', lastName: 'Doe', department: 'HR' });
        expect(removedEmployee).to.be.null;
      });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
        await Employee.deleteMany();
        const deletedEmployees = await Employee.find();
        expect(deletedEmployees.length).to.be.equal(0);
    });

    afterEach(async () => {
        await Employee.deleteMany();
      });
  
  });
  
});