export const sanitizeTitle = (title: string) => {
  return title.replace(/\b\w+\.(com|net|org|co|uk)\b/gi, '');
};
