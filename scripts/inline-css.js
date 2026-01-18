import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');

// Function to get files recursively
const getHtmlFiles = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFiles(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    });
    return results;
};

const inlineCss = () => {
    if (!fs.existsSync(distDir)) {
        console.error('Dist directory not found. Run build first.');
        process.exit(1);
    }

    // Find the main CSS file in dist/assets
    const assetsDir = path.join(distDir, 'assets');
    const files = fs.readdirSync(assetsDir);
    const cssFile = files.find(f => f.startsWith('style-') && f.endsWith('.css'));
    const lightboxCssFile = 'lightbox.css'; // This is copied to root usually, or assets

    if (!cssFile) {
        console.error('Main CSS file not found in assets.');
        return;
    }

    const cssPath = path.join(assetsDir, cssFile);
    let cssContent = fs.readFileSync(cssPath, 'utf8');

    // Also look for lightbox css if it exists in root of dist (since it was a static copy usually? or imported?)
    // In our case, lightbox.css is likely imported in index.html as a link. 
    // Vite might optimize it into the bundle or leave it. 
    // Let's check how it's handled. If we see a link to it, we inline it.

    const htmlFiles = getHtmlFiles(distDir);

    htmlFiles.forEach(htmlPath => {
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Replace main style link
        // The link will look like <link rel="stylesheet" crossorigin href="/assets/style-....css">
        // We need a regex that matches the file we found.

        const styleRegex = new RegExp(`<link[^>]*href=["']\/assets\/${cssFile}["'][^>]*>`, 'i');

        if (styleRegex.test(html)) {
            html = html.replace(styleRegex, `<style>${cssContent}</style>`);
            console.log(`Inlined CSS in ${path.basename(htmlPath)}`);
        }

        // Also try to find lightbox.css if separate
        // It might be hashed or raw.
        // If it was just <link rel="stylesheet" href="./lightbox.css" /> in source, 
        // Vite mostly bundles it into the main CSS if imported in JS, OR keeps it if just in HTML.
        // Let's assume we want to inline any CSS found in the assets folder that is linked.

        fs.writeFileSync(htmlPath, html);
    });
};

inlineCss();
