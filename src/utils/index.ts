export const logToConsole = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, ...optionalParams);
  }
};

export function isNonWhitespace(input: string) {
  return /\S+/g.test(input);
}

export const formatDate = (date: Date) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Get the appropriate suffix for the day
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) {
    suffix = "st";
  } else if (day === 2 || day === 22) {
    suffix = "nd";
  } else if (day === 3 || day === 23) {
    suffix = "rd";
  }

  const formattedDate = `${weekday} ${month} ${day}${suffix}, ${year}`;
  return formattedDate;
};
