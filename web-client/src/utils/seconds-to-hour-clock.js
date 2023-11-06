const secondsToHours = (seconds) => {
  let hours = String(Math.floor(seconds / 3600));
  if (hours.length === 1) hours = "0" + hours;
  return hours;
};
const secondsToMinutes = (seconds) => {
  let mins = String(Math.floor((seconds / 60) % 60));
  if (mins.length === 1) mins = "0" + mins;
  return mins;
};

function secondsToHourClock(seconds) {
  if (seconds < 0) return "00:00";
  return secondsToHours(seconds) + ":" + secondsToMinutes(seconds);
}

export { secondsToHourClock };
