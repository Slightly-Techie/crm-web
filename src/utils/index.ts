export const logToConsole = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, ...optionalParams);
  }
};

export function isNonWhitespace(input: string) {
  return /\S+/g.test(input);
}
