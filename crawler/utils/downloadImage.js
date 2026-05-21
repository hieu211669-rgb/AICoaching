import axios from "axios";
import fs from "fs-extra";
import path from "path";

export async function downloadImage(url, destDir, filename) {
  if (!url) return "";
  await fs.ensureDir(destDir);
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  const filePath = path.join(destDir, `${filename}${ext}`);
  const res = await axios.get(url, { responseType: "stream", timeout: 30000 });
  const writer = fs.createWriteStream(filePath);
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}
