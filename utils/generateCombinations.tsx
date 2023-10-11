export default function generateCombinations(num: number) {
  const possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const combinations: string[] = [];
  // const random = Math.floor(Math.random() * possibleChars.length);
  let counter1 = 0;
  let counter2 = 0;

  while (combinations.length < num) {
    counter1++;
    const combination =
      possibleChars[Math.floor(Math.random() * possibleChars.length)] +
      possibleChars[Math.floor(Math.random() * possibleChars.length)] +
      possibleChars[Math.floor(Math.random() * possibleChars.length)];
    if (!combinations.includes(combination)) {
      counter2++;
      combinations.push(combination);
    }
  }

  // return combinations // return an array with many items
  return combinations; // return single item
}
