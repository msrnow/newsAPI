export const sanitizeSlug = (title: string) => {
  // Remove domain names from the title
  const noDomainTitle = title.replace(/\b\w+\.(com|net|org|co|uk)\b/gi, '');
  // Replace illegal characters with hyphens
  const sanitizedTitle = noDomainTitle.replace(/[\\?%*:|"<>،]/g, '-');
  // Replace spaces, trailing periods, and starting/trailing hyphens with a single hyphen
  const cleanedTitle = sanitizedTitle.replace(/[\s.]+/g, '-').replace(/^-+|-+$/g, '');
  // Remove any "?" char, "..", "«", "»", and "!"
  const finalTitle = cleanedTitle.replace(/[\?«»!]+/g, '');
  // Replace consecutive hyphens with a single hyphen
  const noConsecutiveHyphens = finalTitle.replace(/-+/g, '-');
  
  return noConsecutiveHyphens;
};
