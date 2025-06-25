function isValidComment(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length === 0) return false;

  // Accept letters, digits, emojis, and most Unicode symbols
  return /[\p{L}\p{N}\p{S}]/u.test(trimmed);
}
export {isValidComment}