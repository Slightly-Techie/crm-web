export const logToConsole = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log(message, ...optionalParams);
  }
};

const _GENERATED_IDS_: string[] = []; // storing all generated Ids to avoid duplication;
const generateRandomIds = function () {
  const randomLettersAndNumbers: string[] = [];
  const alphabets = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let randomId = "stn";
  while (randomLettersAndNumbers.length < 14) {
    let number = Math.floor(Math.random() * alphabets.length);
    let letter = alphabets[number];
    randomLettersAndNumbers.push(letter + number);
  }
  randomId += randomLettersAndNumbers.join("");
  if (_GENERATED_IDS_.includes(randomId)) generateRandomIds();
  _GENERATED_IDS_.push(randomId);
  return randomId;
};

export const id: Generator<string> = (function* () {
  let generatedId;
  while (true) {
    generatedId = generateRandomIds();
    yield generatedId;
  }
})();
