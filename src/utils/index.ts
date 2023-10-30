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

//Fix
export function getTimeElapsedOrDate(dateString: string): string {
  const now: Date = new Date();
  const date: Date = new Date(dateString);

  const timeDiff: number = now.getTime() - date.getTime();
  const secondsDiff: number = Math.abs(Math.floor(timeDiff / 1000));
  const minutesDiff: number = Math.abs(Math.floor(timeDiff / (1000 * 60)));
  const hoursDiff: number = Math.abs(Math.floor(timeDiff / (1000 * 60 * 60)));

  if (secondsDiff < 60) {
    return `${secondsDiff}s`;
  } else if (minutesDiff < 60) {
    return `${minutesDiff}m`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff}h`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
}

export function getAccountUserName(
  link: string | null | undefined
): string | null {
  try {
    if (typeof link === "string") {
      const url = new URL(link);
      const pathParts = url.pathname.split("/");
      if (pathParts.length > 1) {
        return pathParts[1];
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function getSubdomainFromURL(url: string | null): string | null {
  try {
    if (url) {
      const parsedURL = new URL(url);
      const hostnameParts = parsedURL.hostname.split(".");
      if (hostnameParts.length >= 3) {
        return hostnameParts.slice(1).join(".");
      }
      return parsedURL.hostname;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function getSkillsArray(inputValue: string | string[] | undefined) {
  let skillsArray: string[] = [];
  if (inputValue) {
    const result = Array.isArray(inputValue)
      ? inputValue.join(",")
      : inputValue;
    for (let value of result.split(",")) {
      const format = value.trim();
      if (!format.length) continue;
      else {
        skillsArray = [...skillsArray, format];
      }
    }
    return skillsArray;
  }
  return [];
}
