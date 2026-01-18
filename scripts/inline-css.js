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

    // Find all CSS files in dist/assets
    const assetsDir = path.join(distDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
        console.error('Assets directory not found.');
        return;
    }

    const files = fs.readdirSync(assetsDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));

    if (cssFiles.length === 0) {
        console.log('No CSS files found in assets.');
        return;
    }

    const htmlFiles = getHtmlFiles(distDir);

    htmlFiles.forEach(htmlPath => {
        let html = fs.readFileSync(htmlPath, 'utf8');
        let modified = false;

        cssFiles.forEach(cssFile => {
            const cssPath = path.join(assetsDir, cssFile);
            const cssContent = fs.readFileSync(cssPath, 'utf8');

            // Regex to find the link tag for this specific CSS file
            // Handles href="/assets/file.css" or href="./assets/file.css"
            const styleRegex = new RegExp(`<link[^>]*href=["'][\.\/]*assets\/${cssFile}["'][^>]*>`, 'i');

            if (styleRegex.test(html)) {
                html = html.replace(styleRegex, `<style>${cssContent}</style>`);
                console.log(`Inlined ${cssFile} in ${path.basename(htmlPath)}`);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(htmlPath, html);
        }
    });
};

inlineCss();
