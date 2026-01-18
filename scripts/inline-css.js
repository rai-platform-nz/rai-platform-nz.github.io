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

    // Find all CSS and JS files in dist/assets
    const assetsDir = path.join(distDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
        console.error('Assets directory not found.');
        return;
    }

    const files = fs.readdirSync(assetsDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    const jsFiles = files.filter(f => f.startsWith('main-') && f.endsWith('.js'));

    const htmlFiles = getHtmlFiles(distDir);

    htmlFiles.forEach(htmlPath => {
        let html = fs.readFileSync(htmlPath, 'utf8');
        let modified = false;

        // Inline CSS
        cssFiles.forEach(cssFile => {
            const cssPath = path.join(assetsDir, cssFile);
            const cssContent = fs.readFileSync(cssPath, 'utf8');

            const styleRegex = new RegExp(`<link[^>]*href=["'][\.\/]*assets\/${cssFile}["'][^>]*>`, 'i');

            if (styleRegex.test(html)) {
                html = html.replace(styleRegex, `<style>${cssContent}</style>`);
                console.log(`Inlined ${cssFile} in ${path.basename(htmlPath)}`);
                modified = true;
            }
        });

        // Inline JS
        jsFiles.forEach(jsFile => {
            const jsPath = path.join(assetsDir, jsFile);
            const jsContent = fs.readFileSync(jsPath, 'utf8');

            // Regex for module script: <script type="module" crossorigin src="/assets/main-....js"></script>
            const scriptRegex = new RegExp(`<script[^>]*src=["'][\.\/]*assets\/${jsFile}["'][^>]*>[\s\S]*?<\/script>`, 'i');

            if (scriptRegex.test(html)) {
                // Inlining module script as classic script (removing type="module") inside <script> tag
                // But wait, if it uses module features (import/export), it might break if inlined as classic.
                // However, Vite build output for production usually bundles everything.
                // Let's check if the content uses imports. 
                // Usually for a simple main.js it does not have external imports after build.
                // We'll use <script type="module"> to be safe if it was a module.
                html = html.replace(scriptRegex, `<script type="module">${jsContent}</script>`);
                console.log(`Inlined ${jsFile} in ${path.basename(htmlPath)}`);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(htmlPath, html);
        }
    });
};

inlineCss();
