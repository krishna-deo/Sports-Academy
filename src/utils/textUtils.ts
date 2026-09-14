/**
 * Utility functions for text formatting across the application.
 */

/**
 * Formats bio/description text so each sentence starts on a new line.
 * Preserves explicit newlines if user added them, otherwise formats sentence ends.
 */
export const formatBioText = (bio?: string): string => {
  if (!bio) return '';
  const trimmed = bio.trim();
  if (!trimmed) return '';
  
  // If already contains newlines, return as is
  if (trimmed.includes('\n')) return trimmed;
  
  // Replace period + space + capital letter (ignoring common honorifics) with period + \n
  return trimmed.replace(/(?<!\b(?:Mr|Dr|Mrs|Ms|Prof|Sr|Jr|vs|etc|e\.g|i\.e))\.\s+(?=[A-Z])/g, '.\n');
};

/**
 * Splits formatted bio text into non-empty sentence lines/paragraphs.
 */
export const getBioParagraphs = (bio?: string): string[] => {
  const formatted = formatBioText(bio);
  if (!formatted) return [];
  return formatted.split('\n').map(line => line.trim()).filter(Boolean);
};
