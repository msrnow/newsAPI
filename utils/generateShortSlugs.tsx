export default function generateShortSlugs(num: number): string[] {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const combinations: Set<string> = new Set();
  // console.log('combinations: ', combinations);
  
  while (combinations.size < num) {
    const combination =
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)] +
      chars[Math.floor(Math.random() * chars.length)];

    combinations.add(combination);
  }

  return Array.from<string>(combinations);
}
