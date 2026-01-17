# RAISE Website

This repository hosts the website for the **Responsible Artificial Intelligence for a Smart Economy (RAISE)** initiative. The site serves as a central hub for proposing an RAI platform in New Zealand, showcasing research themes, economic benefits, and the consortium team.

## Tech Stack
- **Framework**: Vite (Vanilla JS/TS template)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid)
- **Deployment**: GitHub Pages (via GitHub Actions)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:rai-platform-nz/rai-website.git
   cd rai-website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Local Development
Start the development server:
```bash
npm run dev
```
The site will be available at `http://localhost:5173`.

### Building for Production
Build the static site:
```bash
npm run build
```
The output will be in the `dist` directory.

## Deployment
This project is configured to automatically deploy to **GitHub Pages** whenever changes are pushed to the `main` branch.
- Workflow file: `.github/workflows/deploy.yml`

## Project Structure
- `index.html`: Landing page
- `items/*.html`: Theme and content pages
- `style.css`: Global styles
- `public/`: Static assets (images)
