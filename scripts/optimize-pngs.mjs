import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const files = [
  "assets/images/png/img_forms_secund.png",
  "assets/images/png/img-intro.png",
  "assets/images/png/divider_especialista.png",
  "assets/images/png/armando_couceiro.png",
  "assets/images/png/Benedito_Abbud.png",
  "assets/images/png/gabriela_e_rafaella.png",
  "assets/images/png/léo_maia.png",
  "assets/images/png/Carlos_Ferreirinha.png",
  "assets/images/png/img_conheca.png",
  "assets/images/png/divider.png",
  "assets/images/png/brisa.png",
  "assets/images/png/serena.png",
  "assets/images/png/footer.png",
];

for (const rel of files) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  const before = fs.statSync(abs).size;
  const buf = await sharp(abs)
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  if (buf.length < before) {
    fs.writeFileSync(abs, buf);
    console.log(
      rel,
      `${Math.round(before / 1024)} KB → ${Math.round(buf.length / 1024)} KB`,
    );
  } else {
    console.log(rel, "sem ganho (mantido)");
  }
}
