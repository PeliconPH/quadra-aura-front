import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets/images/webp");

fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  {
    src: path.join(root, "assets/images/png/img-intro.png"),
    out: "img-intro-sm.webp",
    width: 828,
    q: 82,
  },
  {
    src: path.join(root, "assets/images/png/img-intro.png"),
    out: "img-intro-lg.webp",
    width: 1920,
    q: 82,
  },
  {
    src: path.join(root, "assets/images/png/img_forms_secund.png"),
    out: "img-forms.webp",
    width: 1400,
    q: 78,
  },
];

for (const job of jobs) {
  if (!fs.existsSync(job.src)) {
    console.warn("webp: ausente", path.relative(root, job.src));
    continue;
  }
  const dest = path.join(outDir, job.out);
  await sharp(job.src)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.q, effort: 6 })
    .toFile(dest);
  const kb = Math.round(fs.statSync(dest).size / 1024);
  console.log("webp:", job.out, kb, "KB");
}
