import fs from "fs";
import { PDFParse } from "pdf-parse";

export async function extractText(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();

  if (ext === "txt") {
    return fs.readFileSync(filePath, "utf8");
  }

  if (ext === "pdf") {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdf = new PDFParse({ data: dataBuffer });
      const data = await pdf.getText();
      await pdf.destroy();
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  throw new Error("Unsupported file type");
}
