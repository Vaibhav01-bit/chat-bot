# ChatMate – Product Requirements Document v2.1

## Purpose of PRD v2.1

This document builds on **PRD v2.0** and focuses on **future improvements, risk mitigation, and long-term scalability**. It formalizes feedback from the PRD evaluation and translates it into **actionable product, UX, technical, and security enhancements**.

PRD v2.1 does **not replace** PRD v2.0. It **extends and strengthens it**, addressing gaps before scale.

---

## 1. Overall PRD Evaluation Summary

### Strengths Confirmed

#### Product Clarity

* Clear positioning: **Telegram × Omegle**
* Strong separation of **Private Chat** and **Random Chat**
* Realistic MVP and phased roadmap

#### Engineering Maturity

* Supabase architecture well-chosen
* RLS policies detailed and mostly correct
* Real-time system design is solid
* Database schema normalized and scalable

#### UX Depth

* Highly detailed user flows
* Mobile-first design thinking
* Accessibility and performance explicitly defined

#### Admin & Operations

* Admin panel is production-grade
* Moderation, analytics, and logging planned early

### Verdict

**PRD v2.0 is 90–95% production-ready.**

Remaining work focuses on:

* Safety
* Risk reduction
* Scalability
* Long-term differentiation

---

## 2. Product & UX Improvements (Phase 2 Priority)

### 2.1 Friend System (Core Social Layer)

#### Current State

* Chats are implicit
* Any user can message another user

#### Future Enhancement

Introduce an explicit **Friend System**:

**Features**

* Send Friend Request
* Request Pending state
* Accept / Decline
* Friends-only chat option
* Friends-only status visibility

**Benefits**

* Reduces spam
* Increases trust
* Enables social graph features
* Improves safety in private messaging

**Priority**: Phase 2 (High)

---

### 2.2 Random Chat Safety Enhancements

#### Current State

* Minimal moderation controls

#### Enhancements

* One-tap **Report**
* One-tap **Block**
* Auto-disconnect after repeated reports
* Reputation score per user
* AI keyword moderation (Phase 3)

**Why This Matters**
Random chat platforms fail due to **safety issues**, not technical limitations.

**Priority**: Phase 2 (Critical)

---

### 2.3 Onboarding Experience Improvements

#### Current State

* Functional but lengthy onboarding

#### Improvements

* Optional skip for profile completion
* Interest selection (used for future matching)
* First-time guided tour overlay
* Demo chat or system bot introduction

**Impact**

* Faster time-to-first-message
* Higher signup completion rate

---

### 2.4 Theme & UI Customization Expansion

#### Current State

* Light / Dark / Auto theme
* Accent colors

#### Enhancements

* Per-chat wallpapers
* Chat bubble styles
* Font size control
* Reduced motion toggle (accessibility)

---

## 3. Technical & Architecture Improvements

### 3.1 Theme System Design Decision (Critical)

#### Problem Observed

* System theme logic conflicts with manual selection
* Inconsistent theme application

#### Design Decision (Must Be Documented)

**Theme Priority Order**

```
User Selection > System Preference > Default
```

**Rules**

* Single source of truth for theme
* System listeners active only in Auto mode
* Manual Light/Dark overrides system
* Server-side hydration to prevent white/black flash

---

### 3.2 Real-Time Scaling Strategy

#### Risk

Supabase Realtime may degrade at scale if unmanaged.

#### Mitigations

* Throttle typing indicators
* Batch presence updates
* Limit active realtime subscriptions per user
* Fallback polling strategy for degraded conditions

---

### 3.3 Random Chat Matching Optimization

#### Current Risk

* Cron-based matching every 2 seconds

#### Improvements

* Event-driven matching
* Priority queues
* Match cooldown memory (avoid repeated pairs)

---

### 3.4 Search Scalability

#### Current State

* PostgreSQL trigram search

#### Future Enhancements

* Dedicated search engine (Meilisearch / Typesense)
* Cache popular queries
* Rate-limit user search

---

## 4. Data, Analytics & Growth Enhancements

### 4.1 Advanced Retention Metrics

#### New Metrics to Track

* Time-to-first-message
* Time-to-first-reply
* Conversation depth
* Random chat drop-off rate

**Why**
These metrics predict churn earlier than DAU/MAU.

---

### 4.2 User Segmentation

#### Segments

* Random-chat heavy users
* Social-only users
* Creators (status posters)
* Silent users (lurkers)

**Use Cases**

* Personalized UX
* Smarter notifications
* Feature prioritization

---

## 5. Security & Compliance Enhancements

### 5.1 End-to-End Encryption Strategy

#### Long-Term Goal

* E2EE for private communication

#### Recommended Approach

* Start with **optional secret chats**
* Avoid full-platform E2EE initially
* Separate encryption domain in architecture

---

### 5.2 Account Recovery & Session Safety

#### Missing Features

* Account recovery keys
* Device/session management
* Login activity history

**Impact**
These become critical beyond 50k users.

---

## 6. Gaps & Risks to Fix Early

### 6.1 Blocking & Muting (Non-Negotiable)

**Issue**
Blocking is marked as future, but is required for random chat.

**Recommendation**

* Add basic block system in Phase 1.5
* Simple `blocked_users` table is sufficient

---

### 6.2 Chat Uniqueness Race Condition

**Risk**

* Simultaneous chat creation can bypass uniqueness

**Fix**

* Enforce unique index using:
  `LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id)`
* Or allow chat creation only via RPC

---

### 6.3 Admin Account Recovery Risk

**Issue**

* No password recovery

**Mitigation**

* One-time recovery token
* Emergency admin email reset

---

### 6.4 Status Feed Abuse Risk

**Risk**

* Public status spam

**Safeguards**

* Rate limiting
* Visibility downgrade after reports
* Shadow banning (admin-only)

---

## 7. Additions Recommended for PRD v2.1

New sections to formally include:

* Friend System & Social Graph
* Blocking & Reporting
* Theme System Design Decisions
* Random Chat Safety Policy
* Scalability Assumptions & Limits
* Known Risks & Mitigations

---

## 8. Final Assessment

ChatMate is **ready for development and early scale**.

Next priorities are:

* Safety
* Consistency
* Scalability
* Bug-proof UX systems (theme, realtime, state)

This PRD v2.1 ensures ChatMate can confidently scale to **100k+ users** without foundational rework.

---

**End of PRD v2.1**
