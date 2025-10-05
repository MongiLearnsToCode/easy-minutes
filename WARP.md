# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Easy Minutes is a modern, minimalist React-based web application for recording, summarizing, and managing meeting minutes using Google's Gemini AI. The app supports audio recording, document upload (PDF, DOCX, TXT), and AI-powered content summarization.

### Key Features
- Real-time audio recording with pause/resume capabilities
- Document upload and text extraction (PDF, DOCX, TXT files)
- AI-powered meeting summarization using Google Gemini 2.5 Flash
- Rich text editing with markdown support
- Local storage-based meeting persistence
- Responsive design with Tailwind CSS

## Development Commands

### Core Commands
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear Vite cache (useful for debugging)
rm -rf node_modules/.vite
```

### Environment Setup
```bash
# Create environment file for Gemini API
cp .env.local.example .env.local  # If example exists
# Or create .env.local and add:
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
```

### Development Server Details
- **Port**: 3000 (configurable in `vite.config.ts`)
- **Host**: 0.0.0.0 (accessible from network)
- **Hot reload**: Enabled via Vite
- **TypeScript**: Strict mode enabled

## Architecture Overview

### Technology Stack
- **Frontend**: React 19.2.0 with TypeScript
- **Bundler**: Vite 6.2.0
- **Styling**: Tailwind CSS 3.x (local build, not CDN)
- **AI Service**: Google Gemini AI (@google/genai)
- **Audio**: Web Audio API with MediaRecorder
- **Document Processing**: PDF.js, Mammoth.js for DOCX
- **Routing**: React Router DOM 7.9.3 with HashRouter
- **Icons**: Lucide React

### Project Structure
```
├── components/           # Reusable UI components
├── contexts/            # React context providers (MeetingContext)
├── hooks/               # Custom hooks (useAudioRecorder)
├── pages/               # Page components (routing)
├── services/            # External service integrations (geminiService)
├── types.ts             # TypeScript type definitions
├── styles.css           # Global Tailwind CSS imports
├── vite.config.ts       # Vite build configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

### Core Architecture Patterns

#### Context-Driven State Management
The application uses React Context (`MeetingContext`) for centralized state management:
- **Session persistence**: Auto-saves to localStorage every 1.5s
- **Meeting lifecycle**: Handles create, load, edit, delete operations
- **Media handling**: Manages audio recording and file uploads
- **AI integration**: Coordinates with Gemini service

#### Component Architecture
- **Page-level components**: Handle routing and layout (`MainPage`, `DashboardPage`)
- **Feature components**: Encapsulate specific functionality (`AudioPlayer`, `FileUploadStatus`)
- **Utility components**: Reusable UI elements (`ActionButton`, `MarkdownRenderer`)

#### Service Layer
- **geminiService.ts**: Handles AI summarization with both text and audio inputs
- **Supports multi-modal input**: Text notes + audio files for comprehensive summarization
- **Error handling**: Graceful degradation for API failures

## Key Development Considerations

### Environment Variables
The app requires `GEMINI_API_KEY` for AI functionality:
- **Development**: Set in `.env.local` file
- **Production**: Configure in deployment environment
- **Access**: Available as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

### Audio Recording Requirements
- **Permissions**: App requests microphone access
- **Format**: Records in WebM format
- **Browser compatibility**: Requires modern browsers with MediaRecorder API support

### File Upload Constraints
- **Supported types**: `audio/*`, `application/pdf`, `text/plain`, `.docx`
- **Processing**: Client-side text extraction for documents
- **Dependencies**: PDF.js and Mammoth.js loaded via CDN

### State Persistence Strategy
- **Session data**: Automatically saved to localStorage
- **Meeting storage**: JSON-based local persistence
- **Recovery**: App restores session on page reload

### Styling Architecture
- **Build system**: Local Tailwind CSS (migrated from CDN)
- **Content scanning**: Configured to scan all component files
- **Custom styles**: Minimal custom CSS in `styles.css`
- **Theme**: Uses slate color palette as primary

## Testing and Debugging

### Common Development Issues
1. **API Key Missing**: Check `.env.local` file exists with valid `GEMINI_API_KEY`
2. **Audio Not Recording**: Verify microphone permissions granted
3. **File Upload Failing**: Check file type against supported formats
4. **Styling Issues**: Clear Vite cache and hard refresh browser

### Browser DevTools
- **Network tab**: Monitor AI API calls and file uploads
- **Application tab**: Inspect localStorage for session data
- **Console**: Check for microphone permission errors

### Performance Considerations
- **CSS bundle size**: ~45KB (optimized with PurgeCSS)
- **AI API usage**: Limited to 3 free summaries per user
- **File processing**: Client-side to avoid server costs

## AI Integration Details

### Gemini Service Configuration
- **Model**: `gemini-2.5-flash` for optimal speed/quality balance
- **Input types**: Text content and/or audio files (base64 encoded)
- **Prompt engineering**: Structured to generate consistent meeting minutes format

### Expected Output Format
The AI generates markdown-formatted summaries with:
- Brief overview sentence
- Key Points (bulleted)
- Decisions Made (bulleted)  
- Action Items (bulleted with @person assignments)

### Error Handling
- **API failures**: Graceful error messages to user
- **File format issues**: Client-side validation and user feedback
- **Network issues**: Retry logic and offline state handling

## Recent Migration Notes

The project recently migrated from Tailwind CDN to local build setup:
- **Performance improvement**: 98% reduction in CSS bundle size
- **Configuration files**: `tailwind.config.js` and `postcss.config.js` added
- **Content scanning**: Configured for all TypeScript/JSX files
- **Build integration**: PostCSS processing via Vite

Refer to `tailwindcdn-migration.md` for detailed migration documentation.

## Development Workflow

### Feature Development
1. Create feature branch from main
2. Install dependencies with `npm install`
3. Start dev server with `npm run dev`
4. Implement changes with hot reload
5. Test across different browsers and devices
6. Build production bundle to verify no issues

### Code Organization
- **Components**: Keep components small and focused
- **Context usage**: Use `useMeeting()` hook to access app state  
- **TypeScript**: Maintain strict typing, especially for AI service interfaces
- **CSS classes**: Use Tailwind utilities, avoid custom CSS where possible

### Browser Support
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Required APIs**: MediaRecorder, FileReader, localStorage
- **Mobile support**: Responsive design tested on iOS/Android

## Production Deployment

### Build Process
```bash
npm run build
# Outputs to ./dist/ directory
# Static files ready for hosting on any web server
```

### Environment Configuration
- Set `GEMINI_API_KEY` environment variable
- Configure web server to serve SPA (redirect to index.html)
- Enable HTTPS for microphone access requirements

### Performance Optimization
- Vite automatically optimizes bundles
- Tailwind CSS purges unused styles
- Dependencies pre-bundled for faster loading