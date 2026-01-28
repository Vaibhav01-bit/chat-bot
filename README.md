# Chatcat- 

A modern chat app that actually feels good to use.

**[🚀 Live Demo](https://chatcat-nu.vercel.app)** | [GitHub](https://github.com/Vaibhav01-bit/chat-bot)

---

## What is this?

ChatMate is a real-time messaging platform I built to explore what chat could feel like if it prioritized experience over features. Instead of cramming in every possible bell and whistle, I focused on making the core interactions feel smooth, personal, and calm.

Think iMessage meets modern web tech, with some unique twists like per-chat customization and a game room.

---

## Why I Built This

Most chat apps feel... cluttered. Notifications everywhere, features you never use, and interfaces that feel like they're screaming for attention. I wanted to build something different:

- **Calm by default** - No aggressive notifications or flashy animations
- **Personal** - You can customize each conversation to make it yours
- **Private** - Your saved messages and customizations are completely private
- **Clean** - Inspired by Apple's design language, focusing on depth and subtle details

---

## Features

### The Basics (Done Right)

- Real-time messaging that just works
- Friend requests and management
- Online/offline status
- Typing indicators
- Message reactions
- Random chat for meeting new people

### What Makes It Different

**Per-Chat Customization**
You can personalize each conversation:
- Choose from soft gradient wallpapers or upload your own
- Adjust dim and blur for readability
- Pick a bubble style (soft, flat, or elevated)
- Set a subtle accent color

**Save Important Messages**
Ever want to save a meaningful message without the other person knowing? Now you can. Your saved messages are completely private - think of it as your personal memory box.

**Premium Feel**
I spent way too much time getting the details right:
- Subtle shadows that create depth without being obvious
- Smooth 200ms transitions everywhere
- Light mode that's easy on the eyes (not harsh white)
- Dark mode with true black for OLED screens

### Social Stuff

- Status updates (like Instagram stories, but simpler)
- React and reply to statuses
- Chess game built-in
- Daily streak tracking
- Icebreaker prompts for new conversations

### Safety Features

- Block and report users
- Privacy controls
- Quiet mode when you need a break
- Safe random chat with protections

### Admin Dashboard

Built a full admin panel for managing the platform:
- User management
- Content moderation
- Analytics
- Report handling

---

## Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite for blazing fast builds
- TailwindCSS for styling
- React Router for navigation

**Backend**
- Supabase (PostgreSQL + real-time + auth + storage)
- Row Level Security for data protection

**Hosting**
- Vercel for the frontend
- Supabase Cloud for backend

---

## Security Approach

I take security seriously:

- **Row Level Security** on every database table - users can only access their own data
- **Type-safe** throughout with TypeScript
- **Secure authentication** via Supabase Auth
- **Protected admin routes** with role-based access
- **Input sanitization** to prevent XSS attacks
- **Rate limiting** to prevent abuse

The saved messages feature is completely private - there's no way for other users to see what you've saved, and they don't even know you saved anything.

---

## Design Philosophy

I wanted this to feel like an Apple product. Here's what that meant:

**Depth Over Color**
Instead of rainbow UIs, I use subtle shadows and elevation. The accent color (iOS blue) is used sparingly and intentionally.

**Calm Motion**
Nothing happens instantly. Every transition is 150-250ms, just enough to feel smooth without being slow. Animations explain what's happening, they don't just look cool.

**Subtle Backgrounds**
The light mode uses #FAFAFA instead of pure white. It's easier on the eyes and feels more premium.

**Clean Hierarchy**
Text colors follow Apple's system. Size and weight create hierarchy, not color.

**Accessibility First**
- Full keyboard navigation
- Screen reader support
- Respects reduced-motion preferences
- Works in high contrast mode

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A Supabase account (free tier is fine)

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/yourusername/chatmate.git
   cd chatmate/chat-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   
   Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run the migrations in `supabase/migrations/` on your Supabase project

5. Start the dev server
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` and you're good to go.

---

## Deployment

I deploy this on Vercel:

1. Push to GitHub
2. Import the repo in Vercel
3. Add your environment variables
4. Deploy

That's it. Vercel handles the rest.

---

## What's Next

Some features I'm planning to add:

- Voice messages
- Video calls
- Group chats
- Message search
- File sharing
- End-to-end encryption (the real kind)
- Desktop and mobile apps

---

## Project Structure

```
chat-app/
├── src/
│   ├── components/    # UI components
│   ├── pages/        # Route pages
│   ├── hooks/        # Custom hooks
│   ├── context/      # React context
│   ├── services/     # API layer
│   └── utils/        # Helper functions
├── supabase/
│   └── migrations/   # Database migrations
└── public/           # Static files
```

---

## Contributing

Found a bug? Have an idea? Open an issue or submit a PR. I'm open to contributions.

---

## A Few Notes

This is a personal project I built to learn and experiment with modern web development. It's not meant for production use without proper security audits and compliance reviews.

That said, I've tried to follow best practices throughout - proper authentication, database security, input validation, etc.

---

## Acknowledgments

- Design inspiration from Apple's iOS and macOS
- Icons from [Lucide](https://lucide.dev)
- Backend powered by [Supabase](https://supabase.com)
- Hosted on [Vercel](https://vercel.com)

---

## Contact

Questions? Suggestions? Open an issue on GitHub.

---

Built with React, TypeScript, and way too much attention to detail.
