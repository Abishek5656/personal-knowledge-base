export function chunkText(text) {
  const chunkSize = 800;
  const overlap = 100;

  const words = text.split(" ");
  const chunks = [];

  let index = 0;

  while (index < words.length) {
    const chunk = words.slice(index, index + chunkSize).join(" ");
    chunks.push(chunk);
    index += chunkSize - overlap;
  }

  return chunks;
}
