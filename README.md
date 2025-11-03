# Garden Plant Tracker

A mobile-optimized Progressive Web App (PWA) for tracking and managing your garden plants with AI-powered care recommendations.

## Features

- 📱 **Mobile-First Design** - Optimized for phones with PWA support
- 🌱 **Plant Management** - Add, edit, and track all your garden plants
- 📸 **Photo Upload** - Take or upload photos with automatic compression
- 🤖 **AI-Powered Care** - Get personalized care tasks via OpenAI ChatGPT
- ✅ **Task Management** - Track seasonal care tasks for each plant
- 💾 **Local Storage** - All data stored locally using IndexedDB
- 🔒 **Privacy First** - Your API key stays on your device

## Tech Stack

- **Framework:** SvelteKit 2 with Svelte 5 (runes syntax)
- **Styling:** Tailwind CSS
- **Database:** IndexedDB with `idb` wrapper
- **PWA:** Vite PWA plugin with service worker
- **Image Processing:** browser-image-compression
- **AI:** OpenAI GPT-4o-mini API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd draix-garden
```

2. Install dependencies:
```bash
npm install
```

3. Generate PWA icons:
```bash
node scripts/generate-icons.js
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Building for Production

Build the static site:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

The built files will be in the `build/` directory, ready to be deployed to any static hosting service.

## Usage

### First-Time Setup

1. Open the app and go to **Settings**
2. Enter your OpenAI API key
3. Return to the home page and add your first plant

### Adding a Plant

1. Tap the **"➕ Add Plant"** button
2. Enter the plant name and Latin name
3. Upload a photo (optional)
4. Answer AI-generated questions about your plant
5. Review and edit the generated care tasks

### Managing Plants

- **View Plants:** Browse your plant collection on the home page
- **Plant Details:** Tap a plant to see details and care tasks
- **Edit Tasks:** Add, edit, or mark tasks as complete
- **Delete Plants:** Use the delete button in plant details

## Deployment

### GitHub Pages (Configured!) 🚀

This project is configured for **automatic deployment** to GitHub Pages!

**Live URL:** https://paul-em.github.io/draix-garden/

To deploy:
1. Go to your repo settings → Pages
2. Set source to "GitHub Actions"
3. Push to `main` branch - done!

See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) for detailed instructions.

### Other Static Hosting Options

This app can also be deployed to:

- **Netlify:** Drag and drop the `build/` folder
- **Vercel:** Connect your git repository
- **Firebase Hosting:** Use `firebase deploy`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

### Mobile Installation

When accessed on a mobile device, users will see a prompt to "Add to Home Screen" for a native app-like experience.

## Project Structure

```
draix-garden/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── db/            # IndexedDB utilities
│   │   ├── services/      # OpenAI and image services
│   │   └── stores/        # Svelte stores (state management)
│   ├── routes/            # SvelteKit routes
│   │   ├── plants/        # Plant-related pages
│   │   │   ├── [id]/      # Plant detail page
│   │   │   └── add/       # Add plant flow
│   │   └── settings/      # Settings page
│   ├── app.css            # Global styles
│   └── service-worker.ts  # PWA service worker
├── static/                # Static assets
├── scripts/               # Build scripts
└── package.json
```

## Environment Variables

No environment variables needed! The app runs entirely client-side. Users configure their own OpenAI API key through the settings UI.

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers with PWA support

## Privacy & Security

- All data is stored locally on your device using IndexedDB
- Your OpenAI API key is stored in localStorage and never sent anywhere except OpenAI
- No analytics or tracking
- No server-side processing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Plant care recommendations powered by OpenAI
- Icons and design inspired by material design principles
- Built with Svelte 5 and SvelteKit 2

## Troubleshooting

### PWA Not Installing
- Make sure you're accessing via HTTPS (or localhost)
- Check browser console for service worker errors
- Clear cache and try again

### OpenAI API Errors
- Verify your API key is correct
- Check you have credits available in your OpenAI account
- Ensure you're connected to the internet

### Images Not Loading
- Check IndexedDB storage limits (usually 50MB+)
- Try smaller images
- Clear browser data if storage is full

## Support

For issues and questions, please open an issue on GitHub.
