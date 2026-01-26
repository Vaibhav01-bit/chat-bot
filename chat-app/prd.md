# ChatMate – Comprehensive Product Requirements Document (PRD)

## Document Information

**Version:** 2.0  
**Last Updated:** January 26, 2026  
**Document Owner:** Product Team  
**Status:** Draft for Development

---


## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [Technical Architecture](#5-technical-architecture)
6. [Detailed Feature Specifications](#6-detailed-feature-specifications)
7. [User Flows & Journey Maps](#7-user-flows--journey-maps)
8. [Database Schema](#8-database-schema)
9. [API Specifications](#9-api-specifications)
10. [Security & Privacy](#10-security--privacy)
11. [UI/UX Guidelines](#11-uiux-guidelines)
12. [Performance Requirements](#12-performance-requirements)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment & DevOps](#14-deployment--devops)
15. [Analytics & Monitoring](#15-analytics--monitoring)
16. [Roadmap & Future Enhancements](#16-roadmap--future-enhancements)

---

## 1. Executive Summary

### 1.1 Product Vision

ChatMate is a next-generation real-time messaging platform that combines the reliability of established chat apps like Telegram and WhatsApp with the spontaneity of random chat features inspired by Omegle. Our vision is to create a safe, fast, and engaging communication platform that enables meaningful connections while respecting user privacy.

### 1.2 Market Opportunity

The global messaging app market continues to grow, with users seeking platforms that offer both structured communication with known contacts and serendipitous discovery of new connections. ChatMate fills this gap by providing a unified platform for both use cases.

### 1.3 Key Differentiators

- **Hybrid Communication Model:** Seamless blend of private messaging and random chat
- **Privacy-First Design:** Granular privacy controls with default-secure settings
- **Cross-Platform Consistency:** Identical experience across web and Android
- **Ephemeral Status:** 24-hour status feature for temporary sharing
- **Lightweight Architecture:** Fast performance even on low-end devices

---

## 2. Product Overview

### 2.1 Product Description

ChatMate is a real-time messaging application available on web browsers and Android devices. It enables users to maintain private conversations, discover new people through random chat matching, share temporary status updates, and customize their experience through themes and privacy settings.

### 2.2 Target Platforms

#### Web Application
- **Browsers Supported:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Responsive Breakpoints:**
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- **Progressive Web App (PWA):** Installable with offline capability for chat history

#### Android Application
- **Minimum SDK:** Android 8.0 (API 26)
- **Target SDK:** Android 14 (API 34)
- **Architecture:** Capacitor-based hybrid app
- **Display Mode:** Full-screen immersive (edge-to-edge)
- **Permissions Required:**
  - Camera (for profile pictures)
  - Storage (for image uploads)
  - Internet (required)
  - Notifications (optional)

### 2.3 Technology Stack

#### Frontend Layer
- **Framework:** React 18.x
- **Build Tool:** Vite 5.x
- **Routing:** React Router v6
- **State Management:** Zustand (lightweight, scalable)
- **Styling:** Tailwind CSS 3.x with custom theme configuration
- **Real-time Client:** Supabase Realtime Client
- **Form Handling:** React Hook Form + Zod validation
- **Image Handling:** React Image Crop, Compressor.js
- **Date Handling:** date-fns
- **Icons:** Lucide React

#### Backend Layer
* Mcp already connected with supabase in project : chat-app
- **BaaS Platform:** Supabase
  - **Authentication:** Supabase Auth with email/password
  - **Database:** PostgreSQL 15.x
  - **Real-time:** Supabase Realtime (WebSocket-based)
  - **Storage:** Supabase Storage (S3-compatible)
  - **Functions:** Supabase Edge Functions (Deno runtime)
- **Database Extensions:**
  - pgcrypto (for UUID generation)
  - pg_trgm (for fuzzy search)

#### Mobile Conversion
- **Framework:** Capacitor 5.x
- **Plugins:**
  - @capacitor/camera
  - @capacitor/filesystem
  - @capacitor/splash-screen
  - @capacitor/status-bar
  - @capacitor/keyboard

#### Hosting & Infrastructure
- **Frontend Hosting:** cPanel-compatible hosting (Apache/Nginx)
- **Backend:** Supabase Cloud (managed hosting)
- **CDN:** Cloudflare (for static assets)
- **Domain:** SSL/TLS required

---

## 3. Goals & Success Metrics

### 3.1 Business Goals

#### Primary Goals
1. **User Acquisition:** Achieve 10,000 registered users within 6 months of launch
2. **User Engagement:** Maintain 40% DAU/MAU ratio
3. **Retention:** 30-day retention rate of 25%+
4. **Random Chat Adoption:** 60% of users try random chat at least once

#### Secondary Goals
1. **Platform Distribution:** 50/50 split between web and Android users
2. **Status Feature Usage:** 30% of active users post status weekly
3. **Chat Frequency:** Average 20+ messages per active user per day

### 3.2 Key Performance Indicators (KPIs)

#### Acquisition Metrics
- New user registrations per day/week/month
- Registration completion rate (target: 85%+)
- Username setup completion rate (target: 95%+)
- Traffic sources and conversion rates

#### Engagement Metrics
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Messages sent per user per day
- Average session duration (target: 12+ minutes)
- Random chat sessions initiated per day
- Random chat connection success rate (target: 90%+)
- Status posts per active user per week

#### Technical Performance Metrics
- Message delivery latency (target: <500ms p95)
- Real-time connection uptime (target: 99.5%+)
- Page load time (target: <2s on 3G)
- API response time (target: <200ms p95)
- Error rate (target: <0.5%)

#### Retention Metrics
- D1, D7, D30 retention rates
- Weekly retention cohorts
- Churn rate
- Re-engagement rate

#### Quality Metrics
- User-reported bugs per week
- Admin moderation actions per week
- User satisfaction score (via in-app feedback)

### 3.3 Success Criteria

**Launch Success Criteria (First 30 Days):**
- 1,000+ registered users
- <1% critical bug rate
- Message delivery success rate >99%
- Average user rating 4.0+ (if app store launched)
- Zero critical security incidents

---

## 4. Target Users & Personas

### 4.1 Primary Personas

#### Persona 1: Social Sarah
- **Age:** 22
- **Occupation:** College Student
- **Tech Savviness:** High
- **Goals:**
  - Stay connected with friends and classmates
  - Meet new people with similar interests
  - Share daily moments through status
- **Pain Points:**
  - Too many messaging apps to manage
  - Privacy concerns on mainstream platforms
  - Limited options for meeting new people safely
- **ChatMate Usage:**
  - Uses private chat daily
  - Posts status 3-4 times per week
  - Tries random chat occasionally for fun

#### Persona 2: Professional Peter
- **Age:** 28
- **Occupation:** Software Developer
- **Tech Savviness:** Very High
- **Goals:**
  - Efficient, distraction-free communication
  - Networking with other professionals
  - Privacy-focused messaging
- **Pain Points:**
  - Bloated apps with unnecessary features
  - Data privacy concerns
  - Poor desktop experience on mobile-first apps
- **ChatMate Usage:**
  - Primarily uses web version
  - Values customization options
  - Rarely uses random chat

#### Persona 3: Curious Chris
- **Age:** 19
- **Occupation:** High School Graduate (Gap Year)
- **Tech Savviness:** Medium
- **Goals:**
  - Meet people from different backgrounds
  - Practice conversation skills
  - Anonymous-like interactions without commitment
- **Pain Points:**
  - Existing random chat platforms feel unsafe
  - Hard to find genuine conversations
  - Uncomfortable sharing too much personal info
- **ChatMate Usage:**
  - Heavy random chat user
  - Values privacy settings
  - Minimal profile information

### 4.2 Secondary Personas

#### Persona 4: Admin Alice
- **Role:** Platform Administrator
- **Goals:**
  - Monitor platform health
  - Moderate inappropriate content
  - Manage user issues efficiently
- **Pain Points:**
  - Need quick access to user management
  - Time-consuming manual moderation
- **ChatMate Usage:**
  - Accesses admin panel daily
  - Reviews flagged status posts
  - Monitors analytics dashboard

---

## 5. Technical Architecture

### 5.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                      │
├──────────────────────┬──────────────────────────────┤
│   Web Application    │   Android Application        │
│   (React + Vite)     │   (Capacitor + React)        │
└──────────────┬───────┴──────────┬───────────────────┘
               │                  │
               └────────┬─────────┘
                        │
         ┌──────────────▼──────────────┐
         │      API Gateway            │
         │   (Supabase Client SDK)     │
         └──────────────┬──────────────┘
                        │
         ┌──────────────▼──────────────┐
         │     Supabase Backend        │
         ├─────────────────────────────┤
         │  • Auth Service             │
         │  • PostgreSQL Database      │
         │  • Realtime Engine          │
         │  • Storage Service          │
         │  • Edge Functions           │
         └─────────────────────────────┘
```

### 5.2 Database Architecture

**Database Type:** PostgreSQL 15.x (hosted on Supabase)

**Key Design Principles:**
- Normalized schema with referential integrity
- Row Level Security (RLS) on all tables
- Indexed columns for frequent queries
- Soft deletes for user data
- Timestamp tracking (created_at, updated_at)

### 5.3 Real-time Communication

**Technology:** Supabase Realtime (PostgreSQL Logical Replication)

**Channels:**
- Private chat channels: `chat:{chat_id}`
- Random chat channels: `random_chat:{session_id}`
- Status updates: `status:feed:{user_id}`
- Typing indicators: `typing:{chat_id}`
- Online presence: `presence:global`

**Connection Management:**
- Automatic reconnection with exponential backoff
- Heartbeat mechanism for connection health
- Graceful degradation to polling if WebSocket fails

### 5.4 File Storage Architecture

**Storage Buckets:**
- `profile-pictures`: User profile images (public read)
- `chat-images`: Images shared in chats (private, authenticated)
- `status-media`: Future enhancement for status images

**File Processing:**
- Client-side compression before upload
- Maximum file size: 5MB (profile), 10MB (chat images)
- Supported formats: JPEG, PNG, WebP
- Automatic thumbnail generation (Edge Function)

### 5.5 Caching Strategy

**Client-Side Caching:**
- React Query for API response caching
- IndexedDB for offline chat history
- LocalStorage for user preferences and theme

**Server-Side Caching:**
- Supabase automatic query caching
- CDN caching for static assets (24-hour TTL)

---

## 6. Detailed Feature Specifications

## 6.1 Authentication & Onboarding

### 6.1.1 Account Creation (Step 1)

**Screen:** `/signup`

**Required Fields:**

| Field | Type | Validation | Error Messages |
|-------|------|------------|----------------|
| Full Name | Text | 2-50 chars, letters and spaces only | "Name must be 2-50 characters" |
| Email | Email | Valid email format, unique | "Invalid email" / "Email already exists" |
| Date of Birth | Date Picker | Age 13+, not future date | "You must be 13 or older" |
| Gender | Dropdown | Required selection | "Please select your gender" |
| Password | Password | Min 8 chars, 1 uppercase, 1 number, 1 special | "Password must meet requirements" |
| Confirm Password | Password | Must match password | "Passwords do not match" |

**Gender Options:**
- Male
- Female
- Non-binary
- Prefer not to say

**Password Requirements Display:**
- ✓ At least 8 characters
- ✓ One uppercase letter
- ✓ One number
- ✓ One special character

**Process Flow:**
1. User fills form with real-time validation
2. On submit, client validates all fields
3. Call Supabase Auth `signUp` with email/password
4. Additional user data stored in `profiles` table
5. Verification email sent (Supabase handles this)
6. User redirected to email verification notice
7. After email verification, redirect to Step 2

**Email Verification:**
- Required before username setup
- Email contains magic link
- Link expires in 24 hours
- Resend option available

**Error Handling:**
- Network errors: Show retry button
- Validation errors: Inline field-level errors
- Server errors: Generic error message with support contact

### 6.1.2 Username Setup (Step 2)

**Screen:** `/username-setup`

**Access Control:** Only accessible after email verification

**Username Requirements:**
- 3-20 characters
- Lowercase letters, numbers, underscores only
- Must start with a letter
- Cannot end with underscore
- No consecutive underscores
- Reserved words blocked (admin, support, system, etc.)

**Real-time Availability Check:**
- Debounced API call (500ms delay)
- Shows loading spinner during check
- Green checkmark if available
- Red X if taken with alternative suggestions

**Alternative Suggestions Algorithm:**
- If `john` is taken, suggest: `john123`, `john_94`, `johnsmith`
- Based on original input + random numbers or profile name

**Process Flow:**
1. User enters desired username
2. Real-time validation and availability check
3. On submit, verify again server-side
4. Update `profiles.username` and `profiles.username_last_changed`
5. Set `profiles.onboarding_completed = true`
6. Redirect to `/home`

**Error Handling:**
- Username taken: Show suggestions
- Invalid format: Show format requirements
- Network error: Allow retry

### 6.1.3 Login

**Screen:** `/login`

**Fields:**
- Email (or username - future enhancement)
- Password
- Remember me (checkbox)

**Features:**
- "Forgot Password" link → password reset flow
- Social login (future enhancement)

**Password Reset Flow:**
1. User clicks "Forgot Password"
2. Enters email address
3. Receives reset link via email
4. Clicks link → redirected to reset password page
5. Enters new password (same validation as signup)
6. Success → redirect to login

**Session Management:**
- JWT tokens managed by Supabase Auth
- Access token expiry: 1 hour
- Refresh token expiry: 30 days
- Automatic token refresh

---

## 6.2 Home Screen (Chats)

### 6.2.1 Layout & Components

**Header:**
- App logo/name (left)
- Search icon (right)
- Online status indicator (optional)

**Search Bar:**
- Placeholder: "Search chats or usernames"
- Real-time filtering
- Shows both chat matches and user matches
- Debounced search (300ms)

**Chat List:**
- Sorted by: Last message timestamp (descending)
- Infinite scroll (20 chats per load)
- Pull-to-refresh on mobile

**Empty State:**
- Illustration
- Text: "No chats yet. Start a conversation!"
- Button: "Find People" → Navigate to Search

### 6.2.2 Chat List Item Structure

```
┌─────────────────────────────────────────┐
│ [Avatar] [Name]          [Timestamp]    │
│          [Last Message]  [Unread Badge] │
└─────────────────────────────────────────┘
```

**Components:**
- **Avatar:** Profile picture or initials fallback (40x40px)
- **Name:** Display name (truncate if long)
- **Timestamp:** Smart formatting
  - Today: HH:mm (e.g., "14:30")
  - Yesterday: "Yesterday"
  - This week: Day name (e.g., "Monday")
  - Older: DD/MM/YYYY
- **Last Message:** Preview (truncate to 50 chars)
  - Text message: Show text
  - Image: "📷 Photo"
  - System message: Italicized
- **Unread Badge:** Red circle with count (max display: 99+)

**Interaction States:**
- Default: White background
- Hover: Light gray background
- Active: Blue highlight
- Long press (mobile): Show context menu (future: archive, mute, delete)

### 6.2.3 Search Functionality

**Search Types:**

1. **Chat Search:**
   - Search within existing chats by name or username
   - Results appear in filtered chat list

2. **User Search:**
   - Search any user by username
   - Results show in separate "People" section
   - Shows profile picture, name, username
   - Tap to view profile or start chat

**Search Results UI:**
```
┌─────────────────────────────────────┐
│ Chats (2)                           │
│ ├─ [Chat Item 1]                    │
│ └─ [Chat Item 2]                    │
│                                     │
│ People (5)                          │
│ ├─ [User Item 1] [Chat button]     │
│ ├─ [User Item 2] [Chat button]     │
│ └─ ...                              │
└─────────────────────────────────────┘
```

**Performance:**
- Client-side filtering for existing chats
- Server-side API call for user search
- PostgreSQL full-text search with trigram matching

---

## 6.3 Chat System

### 6.3.1 Private Chat Screen

**Header:**
- Back button
- User avatar + name
- Online status (green dot)
- Menu button (future: call, video, info)

**Message Area:**
- Reverse chronological order (newest at bottom)
- Auto-scroll to latest message
- Scroll to top loads older messages (pagination)
- Date separators between days

**Message Input:**
- Text input field (multiline, max 1000 chars)
- Emoji picker button
- Image attachment button
- Send button (disabled if empty)

### 6.3.2 Message Types & UI

#### Text Message
```
┌────────────────────────────┐
│ Message content goes here  │
│                      12:34 │
└────────────────────────────┘
```

**Outgoing:** Right-aligned, blue background  
**Incoming:** Left-aligned, gray background

#### Image Message
```
┌────────────────────────────┐
│ [Image Thumbnail 200x200]  │
│ Optional caption           │
│                      12:34 │
└────────────────────────────┘
```

- Click to view full-screen
- Pinch to zoom in full view
- Download option

#### System Message
```
        User joined the chat
        
      User disconnected
```

- Centered, gray text, italic
- No timestamp shown

### 6.3.3 Message States

**Sending States (Outgoing Messages):**

1. **Sending:** Clock icon, gray
2. **Sent:** Single checkmark, gray
3. **Delivered:** Double checkmark, gray
4. **Read (Future):** Double checkmark, blue

**Implementation:**
- Optimistic UI updates (show immediately)
- Real-time subscription for delivery confirmation
- Retry mechanism for failed sends (max 3 attempts)

### 6.3.4 Message Data Model

```javascript
{
  id: "uuid",
  chat_id: "uuid",
  sender_id: "uuid",
  content: "string",
  message_type: "text" | "image" | "system",
  image_url: "string" | null,
  created_at: "timestamp",
  delivered_at: "timestamp" | null,
  read_at: "timestamp" | null,
  is_deleted: boolean
}
```

### 6.3.5 Image Handling

**Upload Flow:**
1. User selects image (camera or gallery)
2. Client-side compression (target: <1MB, 1080px max dimension)
3. Show preview with loading indicator
4. Upload to Supabase Storage
5. Save message with image_url
6. Real-time broadcast to recipient

**Compression Settings:**
- Quality: 0.8
- Max width/height: 1080px
- Format: JPEG

**Display:**
- Thumbnail in chat: 200x200px (cover fit)
- Full view: Original aspect ratio, fit to screen

### 6.3.6 Real-time Synchronization

**Subscription Setup:**
```javascript
supabase
  .channel(`chat:${chatId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `chat_id=eq.${chatId}`
  }, handleNewMessage)
  .subscribe()
```

**Typing Indicator (Future):**
- Broadcast when user is typing
- Show "User is typing..." below last message
- Timeout after 3 seconds of inactivity

**Online Presence:**
- Presence channel for each chat
- Show green dot when user is online
- Last seen timestamp when offline

---

## 6.4 Search & Discovery

### 6.4.1 Search Screen Layout

**Header:**
- "Search" title
- Cancel/Back button

**Random Chat Card (Prominent):**
```
┌─────────────────────────────────────┐
│  🎲 Random Chat                     │
│  Connect with someone new           │
│              [Start] button         │
└─────────────────────────────────────┘
```
- Fixed at top
- Gradient background (brand colors)
- Tap anywhere to start random chat

**Search Bar:**
- Auto-focus on screen load
- Placeholder: "Search by username"
- Clear button (X) when text entered

**Recent Searches (Local):**
- Show last 5 searches
- Stored in localStorage
- Clear all option

**Search Results:**
- Grouped sections: "Exact Match" and "Similar"
- User cards with profile info
- "Message" button on each card

### 6.4.2 User Profile View (from Search)

**Access:** Tap on user card from search results

**Profile Information Shown (based on privacy settings):**

**Public Profile:**
- Profile picture (large)
- Full name
- Username (@username)
- Bio (future enhancement)
- Join date (e.g., "Joined Jan 2026")

**Private Profile:**
- Profile picture (large)
- Full name
- Username (@username)
- "This user has a private profile"

**Actions:**
- "Send Message" button (primary)
- "Block" option (future - in menu)

**Privacy Enforcement:**
- Server-side RLS policies
- Client checks privacy settings before displaying data

---

## 6.5 Random Chat

### 6.5.1 Matching Algorithm

**Queue System:**

1. **User Enters Queue:**
   - Insert into `random_chat_queue` table
   - Status: `waiting`
   - Timestamp: Current time

2. **Matching Logic (Supabase Edge Function):**
   - Trigger: Cron job every 2 seconds
   - Find two users with status `waiting`
   - Order by: `joined_at ASC` (FIFO)
   - Match criteria: Different `user_id`
   - Create `random_chat_sessions` record
   - Update queue status to `matched`
   - Remove from queue
   - Notify both users via Realtime

3. **Connection Establishment:**
   - Both users receive `matched` event
   - Client joins channel `random_chat:{session_id}`
   - Show "Connected successfully, now chat" message

**Timeout Handling:**
- If no match in 60 seconds: Show "No one available, try again later"
- Option to stay in queue or cancel

### 6.5.2 Random Chat Screen

**Header:**
- "Random Chat" title
- Online status indicator
- "Disconnect" button (red, prominent)

**Chat Area:**
- Similar to private chat but simplified
- Text and emoji only
- No image sharing
- Both usernames visible in header

**Disconnect Flow:**
1. User taps "Disconnect" button
2. Confirmation dialog: "Are you sure you want to disconnect?"
3. On confirm:
   - Update session status to `ended`
   - Broadcast disconnect event
   - Show system message: "You disconnected"
   - Navigate back to Search screen

**Recipient Experience on Disconnect:**
- Receive disconnect event via Realtime
- Show system message: "User disconnected"
- Chat becomes read-only
- "Start New Chat" button appears
- After 5 seconds, auto-navigate to Search

### 6.5.3 Random Chat Rules & Restrictions

**Content Restrictions:**
- Text messages only (max 500 chars)
- Emojis allowed
- No images, files, or media
- No sharing of external links (validation with regex)

**Behavior Rules:**
- One active session per user
- Cannot reconnect to same person
- Session limit: 100 messages or 30 minutes (whichever first)
- Cooldown: 10 seconds before joining queue again

**Safety Features (Future):**
- Report button
- Profanity filter
- Auto-moderation for suspicious behavior

---

## 6.6 Status Feature

### 6.6.1 Status Creation

**Screen:** `/status/create`

**Input:**
- Text area (max 280 characters)
- Emoji picker
- Character counter

**Visibility Options:**
```
○ Only people I've chatted with
○ Anyone on ChatMate
```

**Preview:**
- Show how status will appear to others
- Includes profile picture and username

**Post Flow:**
1. User writes status and selects visibility
2. Tap "Post" button
3. Validate character limit
4. Insert into `statuses` table with expiry timestamp
5. Broadcast to relevant users (based on visibility)
6. Navigate to Status Feed

**Expiry Logic:**
- `expires_at = created_at + 24 hours`
- Cron job runs hourly to soft-delete expired statuses
- Client-side filtering also applies

### 6.6.2 Status Feed

**Screen:** `/status`

**Layout:**
- Grid of status cards (2 columns on mobile, 4 on desktop)
- Sorted by: `created_at DESC`
- Infinite scroll

**Status Card:**
```
┌─────────────────────────────┐
│ [Avatar] Username           │
│ Status text goes here...    │
│ 😊                          │
│                             │
│ 2h ago                      │
└─────────────────────────────┘
```

**Time Display:**
- Less than 1 hour: "Xm ago"
- 1-24 hours: "Xh ago"
- Expired: Automatically removed from feed

**Interactions:**
- Tap: View full status (future: replies)
- Long press: Report (future)

**Filtering Logic:**

**If visibility = "chat_list":**
```sql
SELECT s.* FROM statuses s
JOIN chats c ON (c.user1_id = s.user_id OR c.user2_id = s.user_id)
WHERE (c.user1_id = current_user_id OR c.user2_id = current_user_id)
  AND s.expires_at > NOW()
  AND s.is_deleted = false
ORDER BY s.created_at DESC
```

**If visibility = "public":**
```sql
SELECT * FROM statuses
WHERE visibility = 'public'
  AND expires_at > NOW()
  AND is_deleted = false
ORDER BY created_at DESC
```

### 6.6.3 My Status Management

**View Own Status:**
- Accessible via Status screen (top card)
- Shows view count (future)
- "Delete" option available

**Delete Status:**
1. Confirmation dialog
2. Soft delete: `is_deleted = true`
3. Remove from all feeds immediately

---

## 6.7 Settings & Profile Management

### 6.7.1 Settings Screen Layout

**Sections:**

1. **Profile**
   - Profile Picture
   - Name
   - Username
   - Email (read-only)
   - Date of Birth (read-only)
   - Gender (read-only)

2. **Privacy**
   - Profile Visibility toggle

3. **Appearance**
   - Theme (Light/Dark/Auto)
   - Accent Color picker

4. **Account**
   - Change Password
   - Logout
   - Delete Account (future)

5. **About**
   - App Version
   - Terms of Service
   - Privacy Policy
   - Contact Support

### 6.7.2 Profile Picture Update

**Flow:**
1. Tap on profile picture
2. Options modal:
   - Take Photo
   - Choose from Gallery
   - Remove Photo (if exists)
3. After selection:
   - Show crop interface (square crop)
   - Adjust zoom and position
4. Tap "Save"
5. Compress image (max 500KB, 500x500px)
6. Upload to `profile-pictures` bucket
7. Update `profiles.profile_picture_url`
8. Show success message

**Fallback:**
- If no profile picture: Show initials (first letter of first and last name)
- Background color: Deterministic based on user ID (consistent colors)

### 6.7.3 Name Update

**Flow:**
1. Tap "Name" field
2. Modal with text input (pre-filled with current name)
3. Validation: 2-50 characters
4. Tap "Save"
5. Update `profiles.name`
6. Close modal and refresh

### 6.7.4 Username Update

**Constraints:**
- Can only change once every 5 days
- Show "Next available change" date if recently changed

**Flow:**
1. Tap "Username" field
2. If cooldown active:
   - Show alert: "You can change your username again on [DATE]"
   - Cannot proceed
3. If cooldown passed:
   - Modal with username input
   - Real-time availability check (same as signup)
   - Validation (same rules as signup)
4. Tap "Save"
5. Update `profiles.username` and `profiles.username_last_changed`
6. Show success message

**Database Check:**
```sql
SELECT username_last_changed FROM profiles WHERE id = current_user_id;
-- If username_last_changed + interval '5 days' > NOW(), reject
```

### 6.7.5 Privacy Settings

**Profile Visibility Toggle:**

```
┌─────────────────────────────────────┐
│ Profile Visibility                  │
│ ┌─────────────────────────────────┐ │
│ │ ○ Public                        │ │
│ │   Anyone can see your full      │ │
│ │   profile                       │ │
│ │                                 │ │
│ │ ○ Private                       │ │
│ │   Only basic info visible       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Update Process:**
1. User taps on selected option
2. Immediate update to `profiles.is_profile_public`
3. No confirmation needed
4. Toast notification: "Privacy settings updated"

**Default:** Private (for new users)

### 6.7.6 Theme & Appearance

**Theme Selection:**
- Light Mode
- Dark Mode
- Auto (follows system preference)

**Accent Color Options:**
```
Sky Blue (default) | Purple | Green | Orange | Pink | Red
```

**Color Preview:**
- Live preview of selected theme
- Shows how buttons, links, and highlights will appear

**Persistence:**
- Stored in `user_settings` table
- Synced across devices

**Implementation:**
- CSS variables for dynamic theming
- Tailwind CSS dark mode classes
- Smooth transition animations (200ms)

### 6.7.7 Change Password

**Flow:**
1. Tap "Change Password"
2. Modal with fields:
   - Current Password
   - New Password
   - Confirm New Password
3. Validation (same as signup)
4. Submit to Supabase Auth `updateUser`
5. Success: Show message, close modal
6. Error: Show error message

**Security:**
- Requires current password verification
- Password strength meter
- Cannot reuse last 3 passwords (future)

### 6.7.8 Logout

**Flow:**
1. Tap "Logout"
2. Confirmation dialog: "Are you sure you want to logout?"
3. On confirm:
   - Call Supabase `signOut()`
   - Clear local storage
   - Clear IndexedDB cache
   - Redirect to `/login`

**Session Handling:**
- All active real-time subscriptions closed
- Tokens invalidated server-side

---

## 6.8 Admin Panel

### 6.8.1 Access & Authentication

**URL Structure:**
- Production: `https://chatmate.com/1234/admin`
- The `/1234/` path is configurable (environment variable)

**First-Time Setup:**
1. Admin visits URL for first time
2. System checks if admin account exists
3. If not, shows setup form:
   - Admin Username
   - Admin Email
   - Admin Password
4. Creates admin record in `admins` table
5. Credentials stored (password hashed)

**Subsequent Access:**
- Login form with username/email and password
- Session-based authentication (separate from user auth)
- Session timeout: 2 hours of inactivity

**Security Measures:**
- Rate limiting: 5 login attempts per IP per 15 minutes
- No password reset (must be done via database directly)
- IP whitelisting option (optional)

### 6.8.2 Dashboard Overview

**Layout:**
```
┌──────────────────────────────────────────────────┐
│ ChatMate Admin Panel          [Logout] [Refresh] │
├──────────────────────────────────────────────────┤
│ [Users] [Status] [Analytics] [Settings]          │
├──────────────────────────────────────────────────┤
│                                                   │
│  Quick Stats                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│  │ Total   │ │ Active  │ │Messages │ │Random  ││
│  │ Users   │ │ Today   │ │ Today   │ │Chats   ││
│  │ 10,245  │ │  1,847  │ │ 45,892  │ │  234   ││
│  └─────────┘ └─────────┘ └─────────┘ └────────┘│
│                                                   │
│  Recent Activity                                  │
│  • New user: @johndoe (2m ago)                   │
│  • Status posted by @sarah (5m ago)              │
│  • Random chat session ended (8m ago)            │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Refresh Rate:**
- Auto-refresh stats every 30 seconds
- Manual refresh button available

### 6.8.3 User Management

**User List View:**

| Avatar | Name | Username | Email | Status | Joined | Actions |
|--------|------|----------|-------|--------|--------|---------|
| [img] | John Doe | @johndoe | john@example.com | Active | Jan 15 | [Edit] [Delete] |

**Features:**
- Search by name, username, or email
- Filter by:
  - Status (Active, Suspended, Deleted)
  - Join date range
  - Gender
- Sort by: Join date, name, last active
- Pagination: 50 users per page

**User Actions:**

**1. View User Details:**
- Profile information
- Account creation date
- Last active timestamp
- Total messages sent
- Random chat sessions count
- Current status posts
- Chat history (preview only)

**2. Edit User:**
- Change name
- Change username (bypass cooldown)
- Change email
- Reset password (sends reset email to user)
- Update profile visibility

**3. Suspend User:**
- Temporary suspension with reason
- Duration options: 1 day, 7 days, 30 days, permanent
- User cannot login during suspension
- Notification sent to user email

**4. Delete User:**
- Confirmation required
- Soft delete: `is_deleted = true`
- User data retained for 30 days (compliance)
- After 30 days: Hard delete via cron job

### 6.8.4 Status Management

**Status List View:**

```
┌────────────────────────────────────────────────┐
│ Active Statuses (245)       [Filter] [Search]  │
├────────────────────────────────────────────────┤
│ [@johndoe] 2h ago                              │
│ "Having a great day! 🌞"                       │
│ Visibility: Public | Views: 45                 │
│ [View Profile] [Delete Status]                 │
├────────────────────────────────────────────────┤
│ [@sarah_k] 5h ago                              │
│ "Looking for study partners"                   │
│ Visibility: Chat List | Views: 12              │
│ [View Profile] [Delete Status]                 │
└────────────────────────────────────────────────┘
```

**Features:**
- View all active statuses
- Search by username or content
- Filter by visibility type
- Sort by: Recent, most viewed

**Delete Status:**
1. Click "Delete Status"
2. Confirmation: "Delete this status? This cannot be undone."
3. On confirm:
   - Soft delete status
   - Remove from all feeds
   - Log action in admin activity log

**Moderation Notes:**
- Admin can add internal notes to flagged content
- Notes not visible to users
- Helps track repeat offenders

### 6.8.5 Analytics Dashboard

**Time Range Selector:**
- Today
- Last 7 days
- Last 30 days
- Custom range

**User Metrics:**

```
Total Users Over Time
────────────────────────
   12K│                    ╱
      │                 ╱
   10K│              ╱
      │           ╱
    8K│        ╱
      │     ╱
    6K│  ╱
      └──────────────────────
      Jan  Feb  Mar  Apr  May
```

**Displayed Metrics:**
- Total registered users
- New registrations (daily/weekly/monthly)
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio
- User retention (D1, D7, D30)

**Engagement Metrics:**

**Messages:**
- Total messages sent
- Messages per user (average)
- Peak messaging hours (heatmap)
- Text vs image message ratio

**Random Chat:**
- Total sessions
- Average session duration
- Connection success rate
- Most active hours

**Status:**
- Total status posts
- Public vs private ratio
- Average views per status
- Most active status posters

**Export Options:**
- Download as CSV
- Download as PDF report
- Email report (scheduled daily/weekly)

### 6.8.6 Admin Settings

**Configuration Options:**

**General:**
- App Name
- Support Email
- Maintenance Mode (on/off)

**Security:**
- Enable/Disable new registrations
- Minimum age requirement
- Email verification required (yes/no)

**Random Chat:**
- Enable/Disable feature
- Maximum session duration
- Message limit per session
- Cooldown period

**Content Moderation:**
- Profanity filter (on/off)
- Link sharing in random chat (allow/block)
- Status max character limit

**Admin Accounts:**
- Add new admin
- Remove admin
- View admin activity log

**Activity Log:**
- All admin actions logged with:
  - Admin username
  - Action type
  - Affected user/content
  - Timestamp
  - IP address
- Retention: 90 days

---

## 7. User Flows & Journey Maps

### 7.1 New User Onboarding Flow

```
[Landing Page]
      ↓
[Sign Up - Step 1]
  - Fill registration form
  - Submit
      ↓
[Email Verification Notice]
  - "Check your email"
  - Resend option
      ↓
[User clicks email link]
      ↓
[Username Setup - Step 2]
  - Choose username
  - Check availability
  - Submit
      ↓
[Welcome Screen]
  - Brief tutorial (optional)
  - "Get Started" button
      ↓
[Home Screen]
  - Empty state shown
  - Prompt to find people
```

**Exit Points:**
- User can close browser at any step
- Progress saved: If verified, user can login and continue from username setup

**Success Criteria:**
- User completes both steps
- User lands on home screen
- `onboarding_completed = true`

### 7.2 Starting a Private Chat Flow

```
[Home Screen]
      ↓
[Search Tab]
  - Enter username
      ↓
[Search Results]
  - View user profile
      ↓
[User Profile View]
  - Tap "Send Message"
      ↓
[Check if chat exists]
  - YES → Navigate to existing chat
  - NO → Create new chat
      ↓
[Chat Screen]
  - Empty state: "Say hello!"
  - User types message
  - Send
      ↓
[Message Sent]
  - Appears in sender's chat list
  - Real-time notification to recipient
```

**Alternative Path:**
- User can also start chat from search results directly

### 7.3 Random Chat Flow

```
[Search Tab]
      ↓
[Tap Random Chat Card]
      ↓
[Loading Screen]
  - "Finding someone for you..."
  - Animated loading indicator
      ↓
[Matching Process]
  - Added to queue
  - Wait for match (max 60s)
      ↓
[Match Found]
  - "Connected successfully"
  - Chat screen opens
      ↓
[Random Chat Conversation]
  - Users chat
  - Either user can disconnect
      ↓
[Disconnect]
  - Confirmation dialog
  - On confirm: Session ends
      ↓
[Post-Disconnect Screen]
  - "Chat ended"
  - "Start New Chat" button
  - Auto-redirect to Search (5s)
```

**No Match Path:**
```
[Matching Process - Timeout]
      ↓
[No Match Found]
  - "No one available right now"
  - Options:
    - Try Again
    - Back to Search
```

### 7.4 Posting Status Flow

```
[Status Tab]
      ↓
[Tap "+" or "Create Status" button]
      ↓
[Status Creation Screen]
  - Text input with emoji picker
  - Character counter
  - Visibility options
      ↓
[Preview Status]
  - Shows how it will appear
      ↓
[Tap "Post"]
  - Validation
  - Insert into database
      ↓
[Success]
  - Navigate to Status Feed
  - Own status visible at top
      ↓
[Auto-Expiry]
  - After 24 hours: Soft deleted
  - Removed from all feeds
```

### 7.5 Profile Update Flow

```
[Settings Tab]
      ↓
[Tap Profile Section]
      ↓
[Select Field to Update]
  ├─ Profile Picture
  │    ↓
  │  [Choose Source]
  │    - Camera
  │    - Gallery
  │    ↓
  │  [Crop & Adjust]
  │    ↓
  │  [Save → Upload]
  │
  ├─ Name
  │    ↓
  │  [Edit Modal]
  │    ↓
  │  [Save → Update]
  │
  └─ Username
       ↓
     [Check Cooldown]
       - If active: Show error
       - If passed: Continue
       ↓
     [Edit Modal]
       ↓
     [Check Availability]
       ↓
     [Save → Update]
```

---

## 8. Database Schema

### 8.1 Schema Overview

**Tables:**
1. `auth.users` - Managed by Supabase Auth
2. `profiles` - User profile data
3. `chats` - Chat metadata
4. `messages` - All messages
5. `random_chat_queue` - Queue for random matching
6. `random_chat_sessions` - Active/ended random sessions
7. `statuses` - User status posts
8. `user_settings` - User preferences
9. `admins` - Admin accounts
10. `admin_activity_logs` - Admin action logs

### 8.2 Detailed Table Schemas

#### Table: `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  username VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  profile_picture_url TEXT,
  is_profile_public BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  username_last_changed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT username_format CHECK (username ~ '^[a-z][a-z0-9_]{2,19}),
  CONSTRAINT username_no_consecutive_underscores CHECK (username !~ '__'),
  CONSTRAINT username_no_trailing_underscore CHECK (username !~ '_),
  CONSTRAINT name_format CHECK (name ~ '^[A-Za-z ]{2,50}),
  CONSTRAINT age_check CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '13 years')
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_is_deleted ON profiles(is_deleted);
```

**Triggers:**
```sql
-- Auto-update updated_at timestamp
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Table: `chats`

```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT different_users CHECK (user1_id != user2_id),
  CONSTRAINT unique_chat UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_chats_user1 ON chats(user1_id);
CREATE INDEX idx_chats_user2 ON chats(user2_id);
CREATE INDEX idx_chats_last_message ON chats(last_message_at DESC);

-- Ensure user1_id is always less than user2_id for consistency
CREATE OR REPLACE FUNCTION ensure_chat_user_order()
RETURNS TRIGGER AS $
BEGIN
  IF NEW.user1_id > NEW.user2_id THEN
    -- Swap the user IDs
    DECLARE
      temp_id UUID;
    BEGIN
      temp_id := NEW.user1_id;
      NEW.user1_id := NEW.user2_id;
      NEW.user2_id := temp_id;
    END;
  END IF;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER chat_user_order_trigger
  BEFORE INSERT ON chats
  FOR EACH ROW
  EXECUTE FUNCTION ensure_chat_user_order();
```

#### Table: `messages`

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  message_type VARCHAR(20) NOT NULL DEFAULT 'text',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT false,
  
  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'image', 'system')),
  CONSTRAINT content_length CHECK (
    (message_type = 'text' AND char_length(content) <= 1000) OR
    (message_type = 'image' AND char_length(content) <= 200) OR
    (message_type = 'system')
  )
);

CREATE INDEX idx_messages_chat_id ON messages(chat_id, created_at DESC);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Trigger to update chat's last_message_at
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $
BEGIN
  UPDATE chats
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER message_update_chat_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_last_message();
```

#### Table: `random_chat_queue`

```sql
CREATE TABLE random_chat_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_queue_status CHECK (status IN ('waiting', 'matched', 'timeout')),
  CONSTRAINT one_user_per_queue UNIQUE(user_id)
);

CREATE INDEX idx_queue_status_time ON random_chat_queue(status, joined_at);
```

#### Table: `random_chat_sessions`

```sql
CREATE TABLE random_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  ended_by UUID REFERENCES profiles(id),
  
  CONSTRAINT valid_session_status CHECK (status IN ('active', 'ended')),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

CREATE INDEX idx_random_sessions_user1 ON random_chat_sessions(user1_id);
CREATE INDEX idx_random_sessions_user2 ON random_chat_sessions(user2_id);
CREATE INDEX idx_random_sessions_status ON random_chat_sessions(status);
```

#### Table: `random_chat_messages`

```sql
CREATE TABLE random_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES random_chat_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(20) NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_random_message_type CHECK (message_type IN ('text', 'system')),
  CONSTRAINT content_length CHECK (char_length(content) <= 500)
);

CREATE INDEX idx_random_messages_session ON random_chat_messages(session_id, created_at);

-- Trigger to update message count
CREATE OR REPLACE FUNCTION update_random_session_count()
RETURNS TRIGGER AS $
BEGIN
  UPDATE random_chat_sessions
  SET message_count = message_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER random_message_count_trigger
  AFTER INSERT ON random_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_random_session_count();
```

#### Table: `statuses`

```sql
CREATE TABLE statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  visibility VARCHAR(20) NOT NULL DEFAULT 'chat_list',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  view_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  
  CONSTRAINT valid_visibility CHECK (visibility IN ('chat_list', 'public')),
  CONSTRAINT content_length CHECK (char_length(content) <= 280)
);

CREATE INDEX idx_statuses_user_id ON statuses(user_id);
CREATE INDEX idx_statuses_expires_at ON statuses(expires_at);
CREATE INDEX idx_statuses_visibility ON statuses(visibility);
CREATE INDEX idx_statuses_active ON statuses(expires_at, is_deleted) WHERE is_deleted = false;

-- Trigger to set expiry automatically
CREATE OR REPLACE FUNCTION set_status_expiry()
RETURNS TRIGGER AS $
BEGIN
  NEW.expires_at := NEW.created_at + INTERVAL '24 hours';
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER status_expiry_trigger
  BEFORE INSERT ON statuses
  FOR EACH ROW
  EXECUTE FUNCTION set_status_expiry();
```

#### Table: `user_settings`

```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'auto',
  accent_color VARCHAR(20) DEFAULT 'sky_blue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'auto')),
  CONSTRAINT valid_accent CHECK (accent_color IN (
    'sky_blue', 'purple', 'green', 'orange', 'pink', 'red'
  ))
);
```

#### Table: `admins`

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

#### Table: `admin_activity_logs`

```sql
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id),
  action_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  description TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_created ON admin_activity_logs(created_at DESC);
```

### 8.3 Row Level Security (RLS) Policies

#### Profiles Table RLS

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view public profiles
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (is_profile_public = true AND is_deleted = false);

-- Users can view profiles of people they chat with
CREATE POLICY "Users can view chat partners' profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE (user1_id = auth.uid() AND user2_id = profiles.id)
         OR (user2_id = auth.uid() AND user1_id = profiles.id)
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Messages Table RLS

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their chats
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
        AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

-- Users can insert messages to their chats
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_id
        AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );
```

#### Statuses Table RLS

```sql
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;

-- Users can view their own statuses
CREATE POLICY "Users can view own statuses"
  ON statuses FOR SELECT
  USING (user_id = auth.uid());

-- Users can view public statuses
CREATE POLICY "Users can view public statuses"
  ON statuses FOR SELECT
  USING (
    visibility = 'public'
    AND expires_at > NOW()
    AND is_deleted = false
  );

-- Users can view chat_list statuses from people they chat with
CREATE POLICY "Users can view chat partners' statuses"
  ON statuses FOR SELECT
  USING (
    visibility = 'chat_list'
    AND expires_at > NOW()
    AND is_deleted = false
    AND EXISTS (
      SELECT 1 FROM chats
      WHERE (chats.user1_id = auth.uid() AND chats.user2_id = statuses.user_id)
         OR (chats.user2_id = auth.uid() AND chats.user1_id = statuses.user_id)
    )
  );

-- Users can create their own statuses
CREATE POLICY "Users can create own statuses"
  ON statuses FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own statuses
CREATE POLICY "Users can delete own statuses"
  ON statuses FOR UPDATE
  USING (user_id = auth.uid());
```

---

## 9. API Specifications

### 9.1 API Architecture

**API Type:** RESTful + Real-time Subscriptions  
**Base URL:** Supabase Project URL  
**Authentication:** JWT Bearer Tokens (Supabase Auth)

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
apikey: <SUPABASE_ANON_KEY>
```

### 9.2 Authentication Endpoints

#### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "confirmed_at": null
  }
}
```

#### Login
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Logout
```http
POST /auth/v1/logout
Authorization: Bearer <token>
```

### 9.3 Profile Endpoints

#### Get Current User Profile
```http
GET /rest/v1/profiles?id=eq.{user_id}
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "profile_picture_url": "https://...",
  "is_profile_public": true,
  "created_at": "2026-01-15T10:30:00Z"
}
```

#### Update Profile
```http
PATCH /rest/v1/profiles?id=eq.{user_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith"
}
```

#### Check Username Availability
```http
GET /rest/v1/profiles?username=eq.{username}&select=id
Authorization: Bearer <token>
```

**Response (200) - Available:**
```json
[]
```

**Response (200) - Taken:**
```json
[{"id": "uuid"}]
```

### 9.4 Chat Endpoints

#### Get User Chats
```http
GET /rest/v1/chats?or=(user1_id.eq.{user_id},user2_id.eq.{user_id})&order=last_message_at.desc
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user1_id": "uuid",
    "user2_id": "uuid",
    "last_message_at": "2026-01-26T14:30:00Z",
    "created_at": "2026-01-20T10:00:00Z"
  }
]
```

#### Create or Get Chat
```http
POST /rest/v1/rpc/get_or_create_chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "other_user_id": "uuid"
}
```

**Response (200):**
```json
{
  "chat_id": "uuid",
  "created": false
}
```

### 9.5 Message Endpoints

#### Get Chat Messages
```http
GET /rest/v1/messages?chat_id=eq.{chat_id}&order=created_at.desc&limit=50
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "chat_id": "uuid",
    "sender_id": "uuid",
    "content": "Hello!",
    "message_type": "text",
    "image_url": null,
    "created_at": "2026-01-26T14:30:00Z",
    "delivered_at": "2026-01-26T14:30:01Z",
    "read_at": null
  }
]
```

#### Send Message
```http
POST /rest/v1/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "chat_id": "uuid",
  "sender_id": "uuid",
  "content": "Hello!",
  "message_type": "text"
}
```

### 9.6 Random Chat Endpoints

#### Join Random Chat Queue
```http
POST /rest/v1/random_chat_queue
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "uuid"
}
```

#### Leave Queue
```http
DELETE /rest/v1/random_chat_queue?user_id=eq.{user_id}
Authorization: Bearer <token>
```

#### Get Active Random Session
```http
GET /rest/v1/random_chat_sessions?or=(user1_id.eq.{user_id},user2_id.eq.{user_id})&status=eq.active
Authorization: Bearer <token>
```

#### End Random Session
```http
PATCH /rest/v1/random_chat_sessions?id=eq.{session_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ended",
  "ended_at": "2026-01-26T14:30:00Z",
  "ended_by": "uuid"
}
```

### 9.7 Status Endpoints

#### Get Status Feed
```http
GET /rest/v1/rpc/get_status_feed
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "username": "johndoe",
    "name": "John Doe",
    "profile_picture_url": "https://...",
    "content": "Having a great day!",
    "visibility": "public",
    "created_at": "2026-01-26T12:00:00Z",
    "expires_at": "2026-01-27T12:00:00Z"
  }
]
```

#### Create Status
```http
POST /rest/v1/statuses
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "uuid",
  "content": "Having a great day!",
  "visibility": "public"
}
```

#### Delete Status
```http
PATCH /rest/v1/statuses?id=eq.{status_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "is_deleted": true
}
```

### 9.8 Storage Endpoints

#### Upload Profile Picture
```http
POST /storage/v1/object/profile-pictures/{user_id}/{filename}
Authorization: Bearer <token>
Content-Type: image/jpeg

[Binary Image Data]
```

**Response (200):**
```json
{
  "Key": "profile-pictures/{user_id}/{filename}",
  "path": "{user_id}/{filename}"
}
```

#### Upload Chat Image
```http
POST /storage/v1/object/chat-images/{chat_id}/{filename}
Authorization: Bearer <token>
Content-Type: image/jpeg

[Binary Image Data]
```

### 9.9 Search Endpoints

#### Search Users
```http
GET /rest/v1/rpc/search_users
Authorization: Bearer <token>
Content-Type: application/json

{
  "search_query": "john"
}
```

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "profile_picture_url": "https://...",
    "is_profile_public": true
  }
]
```

### 9.10 Real-time Subscriptions

#### Subscribe to Chat Messages
```javascript
const channel = supabase
  .channel(`chat:${chatId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `chat_id=eq.${chatId}`
  }, (payload) => {
    console.log('New message:', payload.new);
  })
  .subscribe();
```

#### Subscribe to Random Chat Match
```javascript
const channel = supabase
  .channel(`random_match:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'random_chat_sessions',
    filter: `user1_id=eq.${userId}`
  }, (payload) => {
    console.log('Matched:', payload.new);
  })
  .subscribe();
```

#### Subscribe to Status Feed
```javascript
const channel = supabase
  .channel('status_feed')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'statuses'
  }, (payload) => {
    console.log('New status:', payload.new);
  })
  .subscribe();
```

---

## 10. Security & Privacy

### 10.1 Authentication Security

**Password Security:**
- Minimum 8 characters
- Required: uppercase, lowercase, number, special character
- Bcrypt hashing (handled by Supabase Auth)
- Salted hashes
- No password storage in client

**Session Management:**
- JWT-based authentication
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (30 days)
- Secure token storage (httpOnly cookies on web)
- Automatic token refresh

**Account Protection:**
- Email verification required
- Rate limiting on login attempts
- Account lockout after 5 failed attempts (15-minute cooldown)
- Password reset via email only

### 10.2 Data Privacy

**User Data Protection:**
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Profile visibility controls enforced server-side
- Soft deletes for data retention compliance

**Privacy Settings:**
- Default to private profile
- Granular control over profile visibility
- Status visibility options (chat list vs public)
- No data sharing with third parties

**Data Retention:**
- Active user data: Retained indefinitely
- Deleted accounts: 30-day soft delete period
- Hard delete after 30 days
- Chat history: Retained while account active
- Random chat messages: Deleted after session ends

### 10.3 Content Security

**Input Validation:**
- Client-side validation for immediate feedback
- Server-side validation for security
- SQL injection prevention (Supabase RLS)
- XSS prevention (React escaping)
- CSRF protection (Supabase headers)

**File Upload Security:**
- File type validation (JPEG, PNG, WebP only)
- File size limits enforced
- Virus scanning (future enhancement)
- Secure file storage with signed URLs
- No executable files allowed

**Content Moderation:**
- Admin review capabilities
- User reporting system (future)
- Profanity filter (future)
- Automated content scanning (future)

### 10.4 Communication Security

**Transport Security:**
- HTTPS/TLS 1.3 required
- Secure WebSocket connections (WSS)
- Certificate pinning on mobile (future)

**Real-time Security:**
- Authenticated WebSocket connections
- Channel-level access control
- Encrypted data transmission
- No sensitive data in channel names

### 10.5 Admin Security

**Admin Access:**
- Separate authentication system
- Strong password requirements
- Session timeout (2 hours)
- No password recovery (manual database reset)
- Activity logging for all actions

**IP Security:**
- Optional IP whitelisting
- Rate limiting on admin endpoints
- Failed login tracking
- Automatic account lockout

### 10.6 Compliance

**GDPR Compliance:**
- Right to access data
- Right to deletion (soft delete)
- Data portability (future)
- Consent management
- Privacy policy clearly stated

**COPPA Compliance:**
- Age verification (13+)
- Parental consent for minors (future)
- Limited data collection for minors

**Data Storage:**
- EU data residency options (Supabase region selection)
- Encrypted at rest
- Regular backups
- Disaster recovery plan

---

## 11. UI/UX Guidelines

### 11.1 Design Principles

**Core Principles:**
1. **Simplicity:** Clean, uncluttered interface
2. **Consistency:** Uniform design patterns across platform
3. **Feedback:** Clear visual feedback for all actions
4. **Accessibility:** WCAG 2.1 AA compliance
5. **Performance:** Fast, responsive interactions

### 11.2 Color Palette

**Primary Colors (Sky Blue Theme - Default):**
```
Primary:    #0EA5E9 (Sky Blue)
Secondary:  #64748B (Slate Gray)
Accent:     #3B82F6 (Blue)
Success:    #10B981 (Green)
Warning:    #F59E0B (Amber)
Error:      #EF4444 (Red)
```

**Light Mode:**
```
Background: #FFFFFF
Surface:    #F8FAFC
Text:       #0F172A
Muted:      #64748B
Border:     #E2E8F0
```

**Dark Mode:**
```
Background: #0F172A
Surface:    #1E293B
Text:       #F8FAFC
Muted:      #94A3B8
Border:     #334155
```

### 11.3 Typography

**Font Family:**
- Primary: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI"
- Monospace: "Fira Code", monospace (for technical elements)

**Font Sizes:**
```
Heading 1:  32px / 2rem   (Bold)
Heading 2:  24px / 1.5rem (Bold)
Heading 3:  20px / 1.25rem (Semibold)
Body:       16px / 1rem   (Regular)
Small:      14px / 0.875rem (Regular)
Tiny:       12px / 0.75rem (Regular)
```

**Line Heights:**
- Headings: 1.2
- Body: 1.5
- UI Elements: 1.4

### 11.4 Spacing System

**Base Unit:** 4px

```
xs:  4px  (0.25rem)
sm:  8px  (0.5rem)
md:  16px (1rem)
lg:  24px (1.5rem)
xl:  32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

### 11.5 Component Patterns

#### Buttons

**Primary Button:**
- Background: Primary color
- Text: White
- Padding: 12px 24px
- Border radius: 8px
- Hover: Darken 10%
- Active: Darken 15%

**Secondary Button:**
- Background: Transparent
- Border: 1px solid primary
- Text: Primary color
- Same padding and radius

**Disabled State:**
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

#### Input Fields

**Standard Input:**
- Border: 1px solid border color
- Border radius: 8px
- Padding: 12px 16px
- Focus: Border color changes to primary
- Error: Border color changes to error

**Validation States:**
- Valid: Green checkmark icon
- Invalid: Red error text below
- Loading: Spinner icon

#### Cards

**Standard Card:**
- Background: Surface color
- Border radius: 12px
- Padding: 16px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Subtle lift (shadow increase)

#### Modals

**Modal Overlay:**
- Background: rgba(0,0,0,0.5)
- Backdrop blur: 4px
- Click outside to close

**Modal Content:**
- Background: Surface
- Border radius: 16px
- Max width: 500px
- Padding: 24px
- Center aligned

### 11.6 Animations

**Timing:**
- Fast: 150ms (micro-interactions)
- Normal: 200ms (most transitions)
- Slow: 300ms (complex animations)

**Easing:**
- Default: cubic-bezier(0.4, 0.0, 0.2, 1)
- Enter: cubic-bezier(0.0, 0.0, 0.2, 1)
- Exit: cubic-bezier(0.4, 0.0, 1, 1)

**Common Animations:**
- Fade in/out
- Slide up/down
- Scale (for modals)
- Shimmer (for loading states)

### 11.7 Iconography

**Icon Library:** Lucide React

**Sizes:**
- Small: 16px
- Medium: 20px
- Large: 24px
- Extra Large: 32px

**Usage:**
- Use outlined icons by default
- Filled icons for active states
- Consistent stroke width (2px)
- Align with text baseline

### 11.8 Responsive Design

**Breakpoints:**
```css
sm:  640px  (Mobile landscape)
md:  768px  (Tablet)
lg:  1024px (Desktop)
xl:  1280px (Large desktop)
```

**Mobile-First Approach:**
- Design for mobile, enhance for desktop
- Touch targets minimum 44x44px
- Readable font sizes (minimum 16px)
- Adequate spacing between interactive elements

**Layout Adjustments:**
- Mobile: Single column, bottom navigation
- Tablet: Two columns where appropriate
- Desktop: Sidebar navigation, multi-column layouts

### 11.9 Accessibility

**Keyboard Navigation:**
- Tab order follows visual flow
- Focus indicators clearly visible
- Skip navigation links
- All interactive elements keyboard accessible

**Screen Readers:**
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images
- Descriptive link text

**Color Contrast:**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Minimum 3:1 for UI components

**Focus States:**
- Visible focus ring (2px outline)
- High contrast focus indicators
- Never remove focus styles

### 11.10 Loading States

**Skeleton Screens:**
- Use for initial page loads
- Match layout of actual content
- Subtle pulse animation

**Spinners:**
- Use for button actions
- Center aligned for full-page loads
- Appropriate size for context

**Progress Indicators:**
- Use for file uploads
- Show percentage when possible
- Allow cancellation

### 11.11 Empty States

**Components:**
- Illustration or icon
- Descriptive heading
- Brief explanation
- Call-to-action button

**Examples:**
- No chats: Encourage searching for users
- No statuses: Prompt to post first status
- Search no results: Suggest trying different terms

### 11.12 Error States

**Error Messages:**
- Clear, user-friendly language
- Avoid technical jargon
- Suggest next steps
- Include retry option

**Toast Notifications:**
- Auto-dismiss after 5 seconds
- Manual dismiss option
- Stack multiple toasts
- Position: Top-right on desktop, top on mobile

---

## 12. Performance Requirements

### 12.1 Load Time Targets

**Initial Page Load:**
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.5s
- First Input Delay (FID): <100ms
- Cumulative Layout Shift (CLS): <0.1

**Subsequent Navigation:**
- Route transitions: <200ms
- Component rendering: <100ms

### 12.2 Real-time Performance

**Message Delivery:**
- P50 latency: <300ms
- P95 latency: <500ms
- P99 latency: <1s

**WebSocket Connection:**
- Connection establishment: <1s
- Reconnection: Exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Heartbeat interval: 30s

**Random Chat Matching:**
- Queue join: <500ms
- Match notification: <1s after match created
- Connection establishment: <2s

### 12.3 Resource Optimization

**Bundle Sizes:**
- Initial JS bundle: <200KB gzipped
- CSS bundle: <50KB gzipped
- Code splitting for routes
- Lazy loading for non-critical components

**Image Optimization:**
- WebP format with JPEG fallback
- Responsive images (srcset)
- Lazy loading for images below fold
- Compression quality: 80%

**Caching Strategy:**
- Static assets: 1 year cache
- API responses: 5 minutes cache
- User-specific data: No cache
- Service worker for offline capability

### 12.4 Database Performance

**Query Optimization:**
- Indexes on frequently queried columns
- Limit results with pagination
- Avoid N+1 queries
- Use database views for complex queries

**Connection Pooling:**
- Supabase handles connection pooling
- Monitor connection count
- Optimize query complexity

### 12.5 Network Optimization

**API Requests:**
- Batch related requests
- Debounce search queries (300ms)
- Throttle scroll events (100ms)
- Use HTTP/2 multiplexing

**Data Transfer:**
- gzip compression enabled
- Minimize payload sizes
- Use GraphQL for complex queries (future)
- Implement request deduplication

### 12.6 Mobile Performance

**Android App:**
- App size: <50MB
- Memory usage: <150MB
- Battery impact: Minimal (background services optimized)
- Smooth 60fps scrolling

**Low-End Device Support:**
- Tested on devices with 2GB RAM
- Graceful degradation of animations
- Reduced complexity on low-end devices

### 12.7 Monitoring

**Metrics to Track:**
- Page load times
- API response times
- Error rates
- WebSocket connection stability
- User session duration
- Message delivery success rate

**Tools:**
- Google Lighthouse
- Supabase Performance Insights
- Custom analytics dashboard
- Real User Monitoring (RUM)

---

## 13. Testing Strategy

### 13.1 Testing Pyramid

```
        /\
       /  \       E2E Tests (10%)
      /    \      
     /──────\     Integration Tests (30%)
    /        \    
   /──────────\   Unit Tests (60%)
  /____________\  
```

### 13.2 Unit Testing

**Framework:** Vitest + React Testing Library

**Coverage Targets:**
- Overall: 80%+
- Critical paths: 95%+
- Utilities: 90%+

**Test Categories:**
- Component rendering
- User interactions
- State management
- Utility functions
- Form validation

**Example Tests:**
```javascript
// Component test
describe('MessageBubble', () => {
  it('renders text message correctly', () => {
    render(<MessageBubble message={mockTextMessage} />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });
});

// Validation test
describe('validateUsername', () => {
  it('rejects username with uppercase letters', () => {
    expect(validateUsername('JohnDoe')).toBe(false);
  });
});
```

### 13.3 Integration Testing

**Framework:** Vitest + MSW (Mock Service Worker)

**Test Scenarios:**
- Authentication flows
- Chat creation and messaging
- Random chat matching
- Status posting and viewing
- Profile updates

**Example Tests:**
```javascript
describe('Chat Flow', () => {
  it('creates chat and sends message', async () => {
    // Mock API responses
    server.use(
      rest.post('/rest/v1/chats', (req, res, ctx) => {
        return res(ctx.json({ id: 'chat-123' }));
      })
    );
    
    // Test flow
    await userEvent.click(screen.getByText('Send Message'));
    await userEvent.type(screen.getByRole('textbox'), 'Hello!');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    
    expect(await screen.findByText('Hello!')).toBeInTheDocument();
  });
});
```

### 13.4 End-to-End Testing

**Framework:** Playwright

**Critical User Journeys:**
1. Sign up → Username setup → First chat
2. Login → Search user → Start chat → Send message
3. Random chat → Match → Chat → Disconnect
4. Post status → View feed → Delete status
5. Update profile → Change theme → Logout

**Example E2E Test:**
```javascript
test('Complete onboarding flow', async ({ page }) => {
  // Navigate to signup
  await page.goto('/signup');
  
  // Fill registration form
  await page.fill('[name="name"]', 'John Doe');
  await page.fill('[name="email"]', 'john@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  
  // Verify email sent (mock)
  await expect(page.locator('text=Check your email')).toBeVisible();
  
  // Complete username setup
  await page.goto('/username-setup');
  await page.fill('[name="username"]', 'johndoe');
  await page.click('button[type="submit"]');
  
  // Verify redirect to home
  await expect(page).toHaveURL('/home');
});
```

### 13.5 Performance Testing

**Tools:**
- Lighthouse CI
- WebPageTest
- Apache JMeter (load testing)

**Load Testing Scenarios:**
- 100 concurrent users sending messages
- 1000 users in random chat queue
- 500 status posts per minute

**Stress Testing:**
- Database connection limits
- WebSocket connection limits
- API rate limits

### 13.6 Security Testing

**Automated Scans:**
- OWASP ZAP for vulnerability scanning
- Dependency vulnerability checks (npm audit)
- SQL injection testing
- XSS attack prevention

**Manual Testing:**
- Authentication bypass attempts
- Authorization checks
- Data exposure testing
- Session management testing

### 13.7 Accessibility Testing

**Automated Tools:**
- axe DevTools
- Lighthouse accessibility audit
- WAVE browser extension

**Manual Testing:**
- Keyboard navigation
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast verification
- Focus management

### 13.8 Cross-Browser Testing

**Browsers:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile Browsers:**
- Chrome Mobile
- Safari Mobile
- Samsung Internet

### 13.9 Device Testing

**Physical Devices:**
- iPhone 12/13/14 (iOS 15+)
- Samsung Galaxy S21/S22 (Android 11+)
- Google Pixel 5/6 (Android 12+)

**Emulators:**
- Android Studio emulator
- iOS Simulator

**Screen Sizes:**
- 320px (iPhone SE)
- 375px (iPhone 12/13)
- 414px (iPhone 14 Pro Max)
- 768px (iPad)
- 1024px (Desktop)

### 13.10 Regression Testing

**Strategy:**
- Automated regression suite runs on every PR
- Critical path tests run on every commit
- Full test suite runs nightly

**Regression Test Suite:**
- All E2E tests
- Integration tests for core features
- Visual regression testing (Percy/Chromatic)

### 13.11 User Acceptance Testing (UAT)

**Beta Testing:**
- Closed beta with 50-100 users
- Duration: 2-4 weeks
- Feedback collection via in-app surveys
- Bug tracking via admin panel

**Test Scenarios:**
- Real-world usage patterns
- Edge cases and error conditions
- Performance on various networks
- Usability and UX feedback

---

## 14. Deployment & DevOps

### 14.1 Development Environment

**Local Setup:**
```bash
# Clone repository
git clone https://github.com/chatmate/chatmate-app.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

**Environment Variables:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PATH_SECRET=1234
VITE_APP_URL=http://localhost:5173
```

### 14.2 CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - name: Deploy to Staging
        run: |
          # Deploy to staging server via FTP/SSH

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
      - name: Deploy to Production
        run: |
          # Deploy to production server
```

### 14.3 Build Process

**Web Application:**
```bash
# Production build
npm run build

# Build outputs to /dist
# Includes:
# - index.html
# - assets/
#   - js/ (chunked and minified)
#   - css/ (minified)
#   - images/
```

**Android Application:**
```bash
# Sync Capacitor
npm run build
npx cap sync android

# Open Android Studio
npx cap open android

# Build APK
cd android
./gradlew assembleRelease

# Build AAB (for Play Store)
./gradlew bundleRelease
```

### 14.4 Server Configuration

**cPanel Hosting Setup:**

**.htaccess (for React Router):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

**nginx Configuration (Alternative):**
```nginx
server {
    listen 80;
    server_name chatmate.com www.chatmate.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chatmate.com www.chatmate.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/chatmate/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 14.5 Database Migration

**Supabase Migration Files:**
```sql
-- migrations/001_initial_schema.sql
-- Run via Supabase CLI or Dashboard

-- Create tables
CREATE TABLE profiles (...);
CREATE TABLE chats (...);
-- ... all other tables

-- Create indexes
CREATE INDEX idx_profiles_username ON profiles(username);
-- ... all other indexes

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ... enable RLS on all tables

-- Create policies
CREATE POLICY "Users can view own profile" ...;
-- ... all other policies
```

**Running Migrations:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 14.6 Monitoring & Logging

**Application Monitoring:**
- Sentry for error tracking
- Google Analytics for user behavior
- Supabase Dashboard for database metrics
- Custom analytics dashboard in admin panel

**Logging Strategy:**
```javascript
// Client-side logging
const logger = {
  error: (message, error) => {
    console.error(message, error);
    Sentry.captureException(error);
  },
  warn: (message) => console.warn(message),
  info: (message) => console.info(message)
};
```

**Server-side Logging:**
- Supabase logs for database queries
- Edge Function logs for serverless functions
- Admin activity logs in database

### 14.7 Backup & Recovery

**Database Backups:**
- Automated daily backups (Supabase)
- Point-in-time recovery (7 days)
- Weekly manual exports
- Backup retention: 30 days

**Storage Backups:**
- Automated backups of file storage
- Redundant storage across regions
- Manual backup before major updates

**Recovery Procedures:**
1. Identify issue and scope
2. Stop deployment if in progress
3. Restore from latest backup
4. Verify data integrity
5. Resume normal operations
6. Post-mortem analysis

### 14.8 Rollback Strategy

**Deployment Rollback:**
```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push -f origin main
```

**Database Rollback:**
```bash
# Revert migration
supabase db reset --to <migration-version>
```

**Feature Flags:**
- Implement feature toggles for major features
- Gradual rollout capability
- Quick disable without deployment

### 14.9 Release Process

**Version Numbering:**
- Semantic versioning: MAJOR.MINOR.PATCH
- Example: 1.0.0, 1.1.0, 1.1.1

**Release Checklist:**
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Changelog prepared
- [ ] Staging deployment successful
- [ ] UAT completed
- [ ] Database migrations ready
- [ ] Rollback plan prepared
- [ ] Stakeholders notified

**Release Schedule:**
- Major releases: Quarterly
- Minor releases: Monthly
- Patch releases: As needed
- Hotfixes: Immediate (critical bugs)

### 14.10 Environment Management

**Environments:**

**Development:**
- Local development machines
- Feature branches
- Rapid iteration

**Staging:**
- Mirror of production
- Testing ground for releases
- User acceptance testing
- URL: staging.chatmate.com

**Production:**
- Live application
- Main branch only
- Stable and tested code
- URL: chatmate.com

---

## 15. Analytics & Monitoring

### 15.1 User Analytics

**Tracked Events:**

**Authentication:**
- signup_started
- signup_completed
- email_verified
- username_created
- login_success
- login_failed
- logout

**Messaging:**
- chat_created
- message_sent (type: text/image)
- message_delivered
- message_read
- chat_opened
- image_uploaded

**Random Chat:**
- random_chat_queue_joined
- random_chat_matched
- random_chat_message_sent
- random_chat_disconnected
- random_chat_timeout

**Status:**
- status_created (visibility: public/chat_list)
- status_viewed
- status_deleted
- status_feed_opened

**Profile:**
- profile_viewed
- profile_updated
- profile_picture_updated
- username_changed
- theme_changed
- privacy_settings_changed

**Event Properties:**
```javascript
{
  event: 'message_sent',
  properties: {
    user_id: 'uuid',
    message_type: 'text',
    chat_type: 'private',
    timestamp: '2026-01-26T14:30:00Z',
    platform: 'web' // or 'android'
  }
}
```

### 15.2 Technical Metrics

**Performance Monitoring:**
- Page load times (per route)
- API response times (per endpoint)
- Database query performance
- WebSocket connection stability
- Error rates by type
- Resource usage (CPU, memory)

**Real-time Dashboards:**
```
┌─────────────────────────────────────────┐
│ Real-time Metrics                        │
├─────────────────────────────────────────┤
│ Active Users: 1,247                     │
│ Messages/min: 342                       │
│ Random Chat Sessions: 23                │
│ Avg Response Time: 124ms                │
│ Error Rate: 0.02%                       │
└─────────────────────────────────────────┘
```

### 15.3 Business Metrics

**User Metrics:**
- Total registered users
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- New user signups (daily/weekly/monthly)
- User retention (D1, D7, D30)
- Churn rate
- User lifetime value

**Engagement Metrics:**
- Average session duration
- Messages per user per day
- Random chat participation rate
- Status posting rate
- Profile completion rate
- Feature adoption rates

**Conversion Funnel:**
```
Landing Page Visits:     10,000
Sign Up Started:         2,000 (20%)
Email Verified:          1,700 (85%)
Username Created:        1,615 (95%)
First Message Sent:      1,130 (70%)
Day 7 Retention:         339 (30%)
```

### 15.4 Alert Configuration

**Critical Alerts (Immediate):**
- Error rate > 5%
- API response time > 2s (p95)
- Database connection failures
- WebSocket connection drops
- Payment failures (future)

**Warning Alerts (1 hour):**
- Error rate > 1%
- API response time > 1s (p95)
- Unusual traffic patterns
- Storage nearing limits

**Info Alerts (Daily digest):**
- Daily active users milestone
- Feature usage statistics
- Performance summaries

**Alert Channels:**
- Email to dev team
- Slack notifications
- SMS for critical issues
- PagerDuty integration (future)

### 15.5 A/B Testing Framework

**Testing Platform:**
- Custom implementation using feature flags
- Segment users randomly
- Track conversion metrics

**Test Examples:**
1. **Onboarding Flow:**
   - Control: Two-step signup
   - Variant: Single-step signup
   - Metric: Signup completion rate

2. **Random Chat CTA:**
   - Control: Top card on search
   - Variant: Floating action button
   - Metric: Random chat participation rate

3. **Status Visibility:**
   - Control: Default private
   - Variant: Default public
   - Metric: Status posting rate

**Testing Process:**
1. Define hypothesis
2. Create test variants
3. Determine sample size
4. Run test (minimum 2 weeks)
5. Analyze results
6. Implement winner

### 15.6 User Feedback Collection

**In-App Feedback:**
- Feedback button in settings
- Star rating prompts (after positive interactions)
- Bug report form
- Feature request form

**Surveys:**
- Post-onboarding survey (after 7 days)
- Random chat experience survey
- Quarterly satisfaction survey
- Exit survey (account deletion)

**Feedback Categories:**
- Bug reports
- Feature requests
- UX improvements
- Content issues
- Performance problems

---

## 16. Roadmap & Future Enhancements

### 16.1 Phase 1: MVP (Current Scope)

**Timeline:** Months 1-3

✅ **Core Features:**
- User authentication and onboarding
- Private messaging (text + images)
- Random chat
- Status feature
- Profile management
- Basic admin panel
- Web and Android apps

**Success Criteria:**
- 1,000+ registered users
- 40% DAU/MAU ratio
- <0.5% error rate

### 16.2 Phase 2: Enhancement (Months 4-6)

**User Features:**
- Message reactions (emoji reactions to messages)
- Message deletion (for sender, within 24 hours)
- Voice messages (in private chats)
- Read receipts (optional setting)
- Typing indicators
- Last seen timestamp
- User blocking
- Chat archiving

**Status Enhancements:**
- Image/video status (10-second videos)
- Status replies
- View list (who viewed your status)
- Status reactions

**Admin Features:**
- Advanced analytics dashboard
- User behavior insights
- Content moderation queue
- Automated spam detection
- User warnings system

**Technical:**
- Push notifications (web and mobile)
- Offline message queueing
- Progressive Web App (PWA) installability
- Service worker for offline functionality

### 16.3 Phase 3: Social Features (Months 7-9)

**New Features:**
- Group chats (up to 50 members)
  - Group creation and management
  - Admin/member roles
  - Group settings
  - Group profile pictures

- User profiles enhancement:
  - Bio/About section
  - Interest tags
  - Profile verification badge
  - Activity status

- Discovery improvements:
  - Trending topics
  - Suggested users
  - Interest-based matching for random chat
  - Public chat rooms

- Channels (broadcast to followers):
  - Create and manage channels
  - Post updates
  - Subscriber management

**Engagement:**
- Daily streaks
- Achievement badges
- User levels
- Gamification elements

### 16.4 Phase 4: Premium Features (Months 10-12)

**Monetization:**
- ChatMate Premium subscription:
  - Ad-free experience
  - Extended status (48 hours)
  - Priority in random chat queue
  - Custom themes
  - Increased file upload limits (25MB)
  - Video calls
  - Unlimited group creation

- Virtual gifts:
  - Send virtual gifts in chats
  - Premium stickers
  - Animated emojis

**Premium Features:**
- Voice calls (one-to-one)
- Video calls (one-to-one)
- Screen sharing
- Message scheduling
- Custom notification sounds
- Chat backup and restore
- Multi-device sync

### 16.5 Phase 5: Advanced Features (Year 2)

**Communication:**
- Voice and video group calls
- Live streaming
- Stories (similar to Instagram)
- Disappearing messages (auto-delete)
- Secret chats (end-to-end encrypted)

**Content:**
- GIF library integration
- Sticker marketplace
- Custom sticker creation
- Message formatting (bold, italic, code)
- File sharing (documents, PDFs)

**AI Features:**
- Smart replies
- Message translation
- Content recommendations
- Spam and abuse detection
- Chatbot integration

**Platform Expansion:**
- iOS application
- Desktop applications (Windows, macOS, Linux)
- Web extensions
- API for third-party developers

### 16.6 Technical Roadmap

**Infrastructure:**
- Migrate to microservices architecture
- Implement GraphQL API
- Redis caching layer
- CDN for global content delivery
- Multi-region deployment
- Load balancing
- Auto-scaling

**Performance:**
- Message compression
- Image CDN optimization
- Database sharding
- Query optimization
- Caching strategies
- Connection pooling enhancements

**Security:**
- End-to-end encryption
- Two-factor authentication (2FA)
- Biometric authentication (mobile)
- Security audit (third-party)
- Penetration testing
- Bug bounty program

**Compliance:**
- GDPR full compliance
- CCPA compliance
- SOC 2 certification
- ISO 27001 certification
- Regular security audits

### 16.7 Integration Roadmap

**Third-Party Integrations:**
- Google Drive (file sharing)
- Dropbox (file sharing)
- Giphy (GIF integration)
- Spotify (music sharing)
- YouTube (video sharing)
- Calendar integration
- Email integration

**Social Login:**
- Google Sign-In
- Apple Sign-In
- Facebook Login
- Twitter/X Login

**Payment Gateways:**
- Stripe
- PayPal
- Google Pay
- Apple Pay

### 16.8 Research & Innovation

**Experimental Features:**
- AR filters for video calls
- AI-powered chat suggestions
- Sentiment analysis
- Voice-to-text improvements
- Real-time translation
- Virtual backgrounds
- Noise cancellation

**Emerging Technologies:**
- Web3 integration (optional)
- Blockchain for verification
- NFT profile pictures
- Cryptocurrency tips
- Decentralized identity

---

## 17. Appendices

### Appendix A: Glossary

**Terms:**
- **DAU:** Daily Active Users
- **MAU:** Monthly Active Users
- **RLS:** Row Level Security
- **PWA:** Progressive Web App
- **JWT:** JSON Web Token
- **TTL:** Time To Live
- **CDN:** Content Delivery Network
- **API:** Application Programming Interface
- **SDK:** Software Development Kit
- **UX:** User Experience
- **UI:** User Interface

### Appendix B: Design Assets

**Required Assets:**
- App logo (SVG, PNG in multiple sizes)
- App icon (512x512, 192x192)
- Splash screen (Android)
- Favicon (16x16, 32x32, 64x64)
- Illustrations for empty states
- Loading animations
- Error state illustrations

### Appendix C: Legal Documents

**Required Documentation:**
- Terms of Service
- Privacy Policy
- Cookie Policy
- Community Guidelines
- Copyright Policy
- DMCA Policy
- Data Processing Agreement

### Appendix D: Support Resources

**User Documentation:**
- Getting Started Guide
- FAQs
- Feature Tutorials
- Troubleshooting Guide
- Video Tutorials

**Developer Documentation:**
- API Documentation
- Database Schema Documentation
- Deployment Guide
- Contributing Guidelines
- Code Style Guide

### Appendix E: Contact Information

**Development Team:**
- Product Manager: [Email]
- Lead Developer: [Email]
- UI/UX Designer: [Email]
- QA Lead: [Email]

**Support:**
- User Support: support@chatmate.com
- Technical Support: tech@chatmate.com
- Business Inquiries: business@chatmate.com

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-15 | Product Team | Initial PRD draft |
| 2.0 | 2026-01-26 | Product Team | Comprehensive expansion with detailed specifications |

---

## Sign-Off

**Prepared by:** Product Team  
**Reviewed by:** [Name], [Title]  
**Approved by:** [Name], [Title]  
**Date:** January 26, 2026

---

**End of Document**