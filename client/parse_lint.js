import fs from 'fs';
try {
  const content = fs.readFileSync('./lint.json', 'utf16le');
  // Strip BOM if present
  const cleanContent = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
  const data = JSON.parse(cleanContent);
  data.forEach(file => {
    if (file.errorCount > 0) {
      console.log(`Error in ${file.filePath}:`);
      file.messages.forEach(msg => {
        console.log(`Line ${msg.line}: ${msg.message}`);
      });
    }
  });
} catch (e) {
  console.log("Error parsing:", e.message);
}
