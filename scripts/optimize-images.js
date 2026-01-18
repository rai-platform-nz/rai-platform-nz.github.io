import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/images/team');
const outputDir = inputDir;

const targetWidth = 300;
const targetHeight = 300;

if (!fs.existsSync(inputDir)) {
    console.error(`Input directory does not exist: ${inputDir}`);
    process.exit(1);
}

fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            const inputPath = path.join(inputDir, file);
            // Construct output filename (replace implementation to be safe)
            const outputFilename = path.basename(file, ext) + '.webp';
            const outputPath = path.join(outputDir, outputFilename);

            sharp(inputPath)
                .resize(targetWidth, targetHeight, {
                    fit: 'cover',
                    position: 'top',
                })
                .webp({ quality: 80 })
                .toFile(outputPath)
                .then(info => {
                    console.log(`Optimized: ${file} -> ${outputFilename} (${info.size} bytes)`);
                })
                .catch(err => {
                    console.error(`Error processing ${file}:`, err);
                });
        }
    });
});
