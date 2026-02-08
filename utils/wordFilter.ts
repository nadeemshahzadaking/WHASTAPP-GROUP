
/**
 * Word filtering has been disabled by user request.
 * This function now always returns false.
 */
export const containsBannedWords = (_text: string): boolean => {
  return false;
};
