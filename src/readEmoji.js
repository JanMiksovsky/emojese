const fileName = "./src/emoji.txt";

export default async function readEmoji() {
  const response = await fetch(fileName);
  const text = await response.text();
  const lines = text.split("\n");
  const entries = lines.map((line) => {
    const [emoji, description] = line.split("\t");
    return { emoji, description };
  });
  const nonEmptyEntries = entries.filter((entry) => entry.emoji);
  return nonEmptyEntries;
}
