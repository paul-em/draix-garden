import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, '..', 'static');

// Create a simple SVG
const createIconSVG = (size) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#16a34a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#15803d;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.125}"/>
  <g transform="translate(${size/2}, ${size/2})">
    <ellipse cx="-${size * 0.08}" cy="-${size * 0.15}" rx="${size * 0.15}" ry="${size * 0.20}" fill="#dcfce7" opacity="0.9"/>
    <ellipse cx="${size * 0.08}" cy="-${size * 0.15}" rx="${size * 0.15}" ry="${size * 0.20}" fill="#bbf7d0" opacity="0.9"/>
    <rect x="-${size * 0.03}" y="${size * 0.05}" width="${size * 0.06}" height="${size * 0.25}" fill="#15803d" rx="${size * 0.03}"/>
    <circle cx="0" cy="${size * 0.32}" r="${size * 0.04}" fill="#166534"/>
  </g>
</svg>`;

  return Buffer.from(svg);
};

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    const svgBuffer = createIconSVG(size);
    const outputPath = path.join(staticDir, `icon-${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`Created ${outputPath}`);
  }

  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);

