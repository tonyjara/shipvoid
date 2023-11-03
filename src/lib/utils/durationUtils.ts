export const parseDurationToSeconds = (x: unknown) => {
  if (typeof x === "string") {
    if (x.includes(":")) {
      if (x.split(":").length === 3) {
        const [hours, minutes, seconds] = x.split(":");
        return (
          parseInt(hours ?? "0") * 60 * 60 +
          parseInt(minutes ?? "0") * 60 +
          parseInt(seconds ?? "0")
        );
      }
      if (x.split(":").length === 2) {
        const [minutes, seconds] = x.split(":");
        return parseInt(minutes ?? "0") * 60 + parseInt(seconds ?? "0");
      }
    }
    return parseInt(x);
  }
  if (typeof x === "number") {
    return x;
  }
  return 0;
};

export const formatSecondsToDuration = (s: number) => {
  if (!s || isNaN(s)) return "00:00";
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s - hours * 3600) / 60);
  const seconds = Math.floor(s - hours * 3600 - minutes * 60);
  const formatedHours = hours < 10 ? `0${hours}` : hours;
  const formatedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  if (hours <= 0) return `${formatedMinutes}:${formatedSeconds}`;
  return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
};
