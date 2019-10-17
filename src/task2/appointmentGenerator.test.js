const { expect } = require('chai');
const { appointmentGenerator } = require('./appointmentGenerator');

const schedules = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']],
];
const emptySchedules = [[], [], []];
const partialSchedules = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [],
];

describe('Task 2', () => {
  describe('appointmentGenerator', () => {
    it('Expect a valid time to be found for a long meeting', (done) => {
      expect(appointmentGenerator(schedules, 75)).to.eq('12:15');
      done();
    });
    it('Expect a valid time to be found for a short meeting', (done) => {
      expect(appointmentGenerator(schedules, 1)).to.eq('12:15');
      done();
    });
    it('Expect no valid time to be found for a meeting that will not fit', (done) => {
      expect(appointmentGenerator(schedules, 76)).to.deep.eq(null);
      done();
    });
    it('Expect a valid time to be found with an empty schedule', (done) => {
      expect(appointmentGenerator(emptySchedules, 76)).to.eq('09:00');
      done();
    });
    it('Expect a valid time to be found with a partially empty schedule', (done) => {
      expect(appointmentGenerator(partialSchedules, 90)).to.eq('12:00');
      done();
    });
    it('Expect no valid time to be found for a meeting that will not fit into a partially empty schedule', (done) => {
      expect(appointmentGenerator(partialSchedules, 120)).to.deep.eq(null);
      done();
    });
  });
});
