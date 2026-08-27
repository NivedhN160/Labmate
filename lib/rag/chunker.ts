export function chunkText(text: string, chunkSize = 400, overlap = 80): string[] {
  if (!text) return [];
  
  // Clean up whitespace
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  const chunks: string[] = [];
  let i = 0;
  
  while (i < cleanText.length) {
    let end = i + chunkSize;
    
    if (end >= cleanText.length) {
      chunks.push(cleanText.substring(i));
      break;
    }
    
    // Try to find a natural break point (period, newline, etc.)
    let breakPoint = cleanText.lastIndexOf('. ', end);
    if (breakPoint < i) {
      breakPoint = cleanText.lastIndexOf(' ', end);
    }
    
    if (breakPoint > i) {
      end = breakPoint + 1;
    }
    
    chunks.push(cleanText.substring(i, end).trim());
    i = end - overlap;
  }
  
  return chunks;
}
