# ChatMate

**A premium, human-centric real-time chat platform with Apple-inspired design**

ChatMate is a modern web-based messaging application that combines powerful real-time communication with a refined, calm user experience. Built with privacy, personalization, and premium UX at its core.

---

## 🎯 Overview

### What Problem Does It Solve?

Most chat applications prioritize features over experience, resulting in cluttered interfaces and impersonal interactions. ChatMate takes a different approach by focusing on:

- **Meaningful connections** over endless features
- **Calm, intentional design** over aggressive notifications
- **Personal ownership** of conversations through customization
- **Privacy and safety** as foundational principles

### Target Users

- Individuals seeking a premium, distraction-free chat experience
- Users who value privacy and personalization
- Anyone looking for a modern alternative to traditional messaging apps

---

## ✨ Key Features

### 💬 Core Chat Features

- **Real-time 1-to-1 Messaging** - Instant message delivery with WebSocket support
- **Random Chat** - Connect with strangers anonymously and safely
- **Friend System** - Send, accept, and manage friend requests
- **Online/Offline Presence** - Real-time status indicators
- **Typing Indicators** - See when someone is composing a message
- **Read Receipts** - Optional message read status
- **Rich Emoji Support** - Full emoji picker with reactions
- **Message Reactions** - React to messages with emojis

### 🎨 Premium UX Features

- **Per-Chat Personalization**
  - Custom wallpapers (gradients, textures, or upload your own)
  - Adjustable dim and blur controls for readability
  - Three bubble styles (soft, flat, elevated)
  - Subtle accent colors per conversation
  
- **Save Important Messages** - Privately save meaningful moments
  - Completely invisible to other users
  - "Memories" list to revisit saved messages
  - Jump back to original conversation context
  
- **Claymorphic + Apple-Inspired UI**
  - Soft, tactile design language
  - Refined shadows (barely visible but create depth)
  - Single accent color philosophy
  - Clean text hierarchy
  
- **Smooth Animations & Transitions**
  - Calm motion (150-250ms timing)
  - Gentle slide-ins and fades
  - Respects reduced-motion preferences
  
- **Theme System**
  - Light mode (subtle backgrounds, not harsh white)
  - Dark mode (true black for OLED)
  - System theme following OS preference

### 🌟 Social & Engagement

- **Status Updates** - Share moments with friends
- **Status Reactions** - React and reply to status posts
- **Game Room** - Play chess with friends (MVP)
- **Daily Streaks** - Track conversation consistency
- **Icebreakers** - Conversation starters for new connections

### 🔒 Safety & Privacy

- **Block & Report** - Protect yourself from unwanted interactions
- **Privacy Controls** - Granular settings for profile visibility
- **Quiet Mode** - Mute notifications temporarily
- **Anonymous Random Chat** - Safe stranger connections
- **Message Privacy** - Saved messages are completely private

### 🛡️ Admin Panel

- **Secure Admin Authentication** - Protected admin routes
- **User Management** - View and manage user accounts
- **Status Moderation** - Review and moderate status posts
- **Analytics Dashboard** - Platform usage insights
- **Reports & Abuse Queue** - Handle user reports efficiently

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with React Compiler
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first styling
- **React Router 7** - Client-side routing
- **Lucide React** - Beautiful icon system

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)
  - Storage for file uploads

### Hosting & Deployment
- **Vercel** - Frontend hosting with edge network
- **Supabase Cloud** - Managed backend infrastructure

---

## 🔐 Security & Architecture

### Database Security
- **Row Level Security (RLS)** - Every table protected with user-specific policies
- **Secure Authentication** - Supabase Auth with JWT tokens
- **Protected Admin Routes** - Role-based access control
- **Input Sanitization** - XSS and injection prevention

### Privacy Architecture
- **Private Saved Messages** - Completely invisible to other users
- **Per-User Customizations** - Settings never shared with chat participants
- **Secure File Uploads** - Validated file types and sizes
- **No Data Leakage** - Strict RLS ensures users only see their own data

### Additional Security Measures
- **Rate Limiting** - Prevent abuse and spam
- **HTTPS Only** - Encrypted connections
- **Environment Variables** - Sensitive data never committed
- **SQL Injection Protection** - Parameterized queries via Supabase

---

## 🎨 UI/UX Philosophy

### Design Principles

**1. Depth Over Color**
- Premium products rely on subtle elevation, not rainbow UIs
- Shadows are barely visible but create meaningful depth
- Single accent color (iOS blue) used intentionally

**2. Calm, Intentional Motion**
- Nothing happens instantly (150-250ms transitions)
- Animations explain, not decorate
- Every interaction feels smooth and natural

**3. Subtle Backgrounds**
- Not harsh pure white (#FAFAFA instead of #FFFFFF)
- Gentle gradients for chat backgrounds
- Easy on the eyes for extended use

**4. Clean Hierarchy**
- Apple's text color system (#1D1D1F)
- Typography creates hierarchy through size and weight
- Single font family (Inter/SF Pro)

**5. Accessibility First**
- Keyboard navigation throughout
- Screen reader support with ARIA labels
- Reduced motion support
- High contrast mode compatible

---

## 📸 Screenshots

> **Note**: Add screenshots here showcasing:
> - Chat interface with customization
> - Profile and settings
> - Status updates
> - Admin dashboard
> - Light and dark modes

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatmate.git
   cd chatmate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   
   Apply the SQL migrations from `supabase/migrations/` to your Supabase project

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:5173`

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-app.vercel.app`

### Environment Variables Setup

Ensure these are set in your Vercel project:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

---

## 🗺️ Roadmap

### Planned Features
- [ ] Voice messages
- [ ] Video calls (1-to-1)
- [ ] Group chats
- [ ] Message search
- [ ] File sharing (documents, images)
- [ ] End-to-end encryption
- [ ] Desktop app (Electron)
- [ ] Mobile apps (React Native)

### Improvements
- [ ] Performance optimizations
- [ ] Advanced analytics
- [ ] More game options
- [ ] AI-powered features (smart replies, translation)

---

## 📝 Project Structure

```
chat-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── services/        # API and service layer
│   ├── constants/       # App constants
│   └── utils/           # Utility functions
├── supabase/
│   ├── migrations/      # Database migrations
│   └── functions/       # Edge functions
└── public/              # Static assets
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is open-source and available for educational and personal use.

### Disclaimer
This is a personal/educational project built to demonstrate modern web development practices, real-time communication, and premium UX design. It is not intended for commercial use without proper security audits and compliance reviews.

---

## 🙏 Acknowledgments

- **Design Inspiration**: Apple's iOS and macOS design language
- **Icons**: [Lucide Icons](https://lucide.dev)
- **Backend**: [Supabase](https://supabase.com)
- **Hosting**: [Vercel](https://vercel.com)

---

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Supabase**
