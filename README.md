# Cyberpunk Portfolio

A Dark Cyberpunk themed static portfolio website for a Cybersecurity Engineer, built with Next.js (App Router), React, TypeScript and Tailwind CSS. The site features smooth animations powered by Framer Motion.

## Tech Stack

- **Framework**: Next.js (Static Export)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: EmailJS
- **Hosting**: GitHub Pages

## Development

```bash
# Install dependencies
npm ci --legacy-peer-deps

# Run the development server
npm run dev
```

## Build and Deploy

The project uses Next.js static export (`output: 'export'`) to generate HTML/CSS/JS in the `out/` directory.

```bash
# Build the production bundle
npm run build
```

Deployment to GitHub Pages is handled automatically via GitHub Actions whenever changes are pushed to the `main` branch.

## Environment Variables

To enable the contact form via EmailJS, you need to configure the following secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`: Your EmailJS Service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`: Your EmailJS Template ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`: Your EmailJS Public Key

These are mapped appropriately to `NEXT_PUBLIC_EMAILJS_*` environment variables during the deployment build process.

## 📝 Features

✨ Fully responsive design
🎨 Custom theme with CSS variables
⚡ Optimized performance (static export)
♿ Accessible components
🔍 SEO optimized with Next.js metadata
📱 Mobile-first approach
🎬 Smooth scroll & animations
🌙 Dark theme optimized

## 📚 Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout with metadata
│   └── page.tsx      # Home page
├── components/       # React components
│   ├── sections/     # Page sections
│   └── providers/    # Context providers
├── data/             # Static data
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
├── animations.css    # Animation keyframes
└── index.css         # Global styles
```

## 🚀 Deployment

This portfolio is deployed to **GitHub Pages** via GitHub Actions.

### GitHub Pages Configuration

1. Go to **Settings** → **Pages**
2. Set source to **GitHub Actions**
3. Deploy workflow automatically builds and deploys on push to `main`

### Secrets Required

Add these in **Settings** → **Secrets and variables** → **Actions**:
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

## 📄 License

This project is open source and available under the MIT License.

## 👤 About

Built by **Sthitaprajna Biswal**
Cybersecurity & Cloud Security Engineer
[Visit Portfolio](https://sthitiprajnya.github.io/portfolio/)
