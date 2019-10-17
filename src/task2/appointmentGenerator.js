const FastPriorityQueue = require('fastpriorityqueue');

const START_OF_DAY = '09:00';
/**
 * Takes a 2d array of n sorted schedules of [ HH:MM, HH:MM ] and flattens them into a
 * single sorted array in logarithmic time.
 */

const flattenSchedules = (schedules) => {
  const flatSchedule = [];
  const scheduleQueue = new FastPriorityQueue((a, b) => a.meeting[0] < b.meeting[0]);
  const indTracker = new Array(schedules.length).fill(0);

  schedules.forEach((value, index) => {
    if (value.length > 0) scheduleQueue.add({ meeting: value[0], ind: index });
  });

  while (!scheduleQueue.isEmpty()) {
    const nextMeeting = scheduleQueue.poll();
    flatSchedule.push(nextMeeting);
    indTracker[nextMeeting.ind] += 1;
    if (indTracker[nextMeeting.ind] < schedules[nextMeeting.ind].length) {
      scheduleQueue.add({
        meeting: schedules[nextMeeting.ind][indTracker[nextMeeting.ind]],
        ind: nextMeeting.ind,
      });
    }
  }
  return flatSchedule;
};

/**
 * Takes a flat sorted array of schedules of [ HH:MM, HH:MM ] and a meeting length in minutes
 * and returns the first time that meeting will fit.
 * If the meeting cannot fit, a null is returned.
 */
const findStartTime = (flatSchedule, meetingLength) => {
  if (flatSchedule.length === 0) return START_OF_DAY; // Everyone is free!
  let timeSelected = null;
  let busyEndMarker = START_OF_DAY;
  const busyEndTime = new Date();
  const startTime = new Date();
  busyEndTime.setHours(9, 0);

  flatSchedule.forEach(({ meeting }) => {
    const [meetingStart, meetingEnd] = meeting;
    if (meetingStart >= busyEndMarker) {
      // Free period found, check its size
      const [startHour, startMin] = meetingStart.split(':');
      startTime.setHours(startHour, startMin);
      const timeAvailable = (startTime.getTime() - busyEndTime.getTime()) / (1000 * 60);
      if (timeAvailable >= meetingLength) {
        // Space for meeting found. Exit forEach early.
        timeSelected = busyEndMarker;
        return false;
      }
    }
    if (meetingEnd > busyEndMarker) {
      // The end of this meeting is past the end of the overlapping meeting, so use
      // it as the new endpoint of the busy period.
      const [endHour, endMin] = meetingEnd.split(':');
      busyEndMarker = meetingEnd;
      busyEndTime.setHours(endHour, endMin);
    }
    return true; // Space for meeting not found yet. Continue loop.
  });

  return timeSelected;
};

/**
 * Takes a 2d array of n sorted schedules of [ HH:MM, HH:MM ] and a meeting length in minutes
 * and returns the first time that meeting will fit.
 *
 * Assumes schedules and meetingLength has already been validated.
 */
const appointmentGenerator = (schedules, meetingLength) => {
  const flatSchedule = flattenSchedules(schedules);
  const startTime = findStartTime(flatSchedule, meetingLength);
  return startTime;
};

module.exports.appointmentGenerator = appointmentGenerator;
