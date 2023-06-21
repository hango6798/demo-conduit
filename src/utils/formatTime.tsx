import moment from "moment";

const formatTime = (time: string) => {
  const dayFromNow = moment(time).fromNow();
  const year = +moment(time).format("YYYY");
  const month = +moment(time).format("MM");
  const day = +moment(time).format("DD");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  if (
    currentYear === year &&
    currentMonth + 1 === month &&
    currentDay - day <= 3
  ) {
    return dayFromNow;
  }
  return moment(time).format("MMMM DD, YYYY");
};
export default formatTime;
