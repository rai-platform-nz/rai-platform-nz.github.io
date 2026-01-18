import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputBaseDir = path.join(__dirname, '../public/images');

// Configuration
const teamSizes = [50, 100, 165, 300];
const generalSizes = [400, 800, 1200];

if (!fs.existsSync(inputBaseDir)) {
    console.error(`Input directory does not exist: ${inputBaseDir}`);
    process.exit(1);
}

// Recursive function to get all files
const getFilesRecursively = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFilesRecursively(file));
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                results.push(file);
            }
        }
    });
    return results;
};

const processFiles = async () => {
    const files = getFilesRecursively(inputBaseDir);

    for (const file of files) {
        // Determine type based on path
        const isTeam = file.includes('/team/');
        const sizes = isTeam ? teamSizes : generalSizes;
        const resizeOptions = isTeam
            ? { fit: 'cover', position: 'top' }
            : { fit: 'inside', withoutEnlargement: true }; // Preserve aspect ratio for general

        for (const width of sizes) {
            const dir = path.dirname(file);
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            const outputFilename = `${basename}-${width}.webp`;
            const outputPath = path.join(dir, outputFilename);

            try {
                // Check if source image is smaller than target width (for general images primarily)
                // sharp will handle upscaling/downscaling, but for 'inside' we might want to skip unrelated sizes if strict?
                // For simplicity, we generate all requested sizes to ensure srcset works predictably, 
                // but 'withoutEnlargement' in general config handles not blowing up small images.

                await sharp(file)
                    .resize(width, isTeam ? width : null, resizeOptions) // square for team, width-only for general
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                console.log(`Generated: ${outputFilename}`);
            } catch (err) {
                console.error(`Error processing ${path.basename(file)} at ${width}px:`, err.message);
            }
        }
    }
};

processFiles();
