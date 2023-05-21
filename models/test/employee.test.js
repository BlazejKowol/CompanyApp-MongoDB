const Employee = require('../employees.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

    it('should throw an error if no "name" arg', () => {
        const emp = new Employee({}); // create new Employee, but don't set any value to attr
      
        emp.validate(err => {
          expect(err.errors.firstName).to.exist;
          expect(err.errors.lastName).to.exist;
          expect(err.errors.department).to.exist;
        });
      });

    it('should throw an error if attrs are not a string', () => {

        const cases = [
            {firstName: {}, lastName: {}, department: {}}, 
            {firstName: [], lastName: [], department: []}
        ];
        for(let item of cases) {
          const emp = new Employee({ item });
      
          emp.validate(err => {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            expect(err.errors.department).to.exist;
          });
        } 
      });

      it('should not throw an error if attrs are ok', () => {

        const cases = [
            {firstName: 'John', lastName: 'Doe', department: 'Marketing'}, 
            {firstName: 'Amanda', lastName: 'Black', department: 'HR'}
        ]; // we test various good cases
        for(let item of cases) {
          const emp = new Employee({ firstName: item.firstName, lastName: item.lastName, department: item.department });
      
          emp.validate(err => {
            expect(err).to.not.exist;
          });
        }
      });
});