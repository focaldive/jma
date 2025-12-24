# Backend Implementation - Jaffna Muslim Association

This document outlines all entities and workflows needed to implement a backend using **Prisma** and **PostgreSQL** for the JMA Next.js application.

---

## PRISMA SCHEMA

### Database Configuration

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## ENTITIES (18 Models)

### 1. Donor
Stores donor information (supports anonymous donations).
```prisma
model Donor {
  id           String     @id @default(cuid())
  firstName    String?
  lastName     String?
  email        String?
  phone        String?
  address      String?
  country      String?
  region       String?
  isAnonymous  Boolean    @default(false)
  wantsUpdates Boolean    @default(false)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  donations    Donation[]
}
```

### 2. Donation
Records all donations with PayPal transaction details.
```prisma
model Donation {
  id            String   @id @default(cuid())
  amount        Decimal  @db.Decimal(10, 2)
  currency      String   @default("USD") // USD, GBP, LKR
  donationType  String   // "normal" or "live_appeal"
  category      String?  // healthcare, education, zakat, qurbani, etc.
  paypalOrderId String?  @unique
  status        String   @default("pending") // pending, completed, failed, refunded
  donorId       String?
  donor         Donor?   @relation(fields: [donorId], references: [id])
  createdAt     DateTime @default(now())
}
```

### 3. DonationCategory
Predefined donation categories.
```prisma
model DonationCategory {
  id          String  @id @default(cuid())
  label       String  // "Medical & Healthcare"
  value       String  @unique // "healthcare"
  description String?
  isActive    Boolean @default(true)
}
```

### 4. NewsArticle
Blog posts/news articles (replaces WordPress).
```prisma
model NewsArticle {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  excerpt       String?
  content       String    @db.Text
  category      String    // "Events", "Appeals", "Community"
  authorId      String
  author        Author    @relation(fields: [authorId], references: [id])
  featuredImage String?
  isPublished   Boolean   @default(false)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### 5. Author
News article authors.
```prisma
model Author {
  id       String        @id @default(cuid())
  name     String
  role     String?
  articles NewsArticle[]
}
```

### 6. Project
Charitable projects with financial tracking.
```prisma
model Project {
  id          String           @id @default(cuid())
  year        Int
  month       String
  description String
  location    String
  currency    String           // LKR, GBP, USD
  amount      Decimal          @db.Decimal(12, 2)
  categoryId  String?
  category    ProjectCategory? @relation(fields: [categoryId], references: [id])
  images      ProjectImage[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}
```

### 7. ProjectCategory
Project categorization for charts/reports.
```prisma
model ProjectCategory {
  id       String    @id @default(cuid())
  name     String    @unique // "Education", "Healthcare", "Water", etc.
  color    String    // Chart color hex code
  projects Project[]
}
```

### 8. ProjectImage
Gallery images for projects.
```prisma
model ProjectImage {
  id        String  @id @default(cuid())
  url       String
  alt       String?
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

### 9. NewsletterSubscriber
Email newsletter subscriptions.
```prisma
model NewsletterSubscriber {
  id               String    @id @default(cuid())
  email            String    @unique
  firstName        String?
  lastName         String?
  isVerified       Boolean   @default(false)
  verifyToken      String?   @unique
  unsubscribeToken String    @unique @default(cuid())
  subscribedAt     DateTime  @default(now())
  unsubscribedAt   DateTime?
}
```

### 10. ContactSubmission
Contact form submissions.
```prisma
model ContactSubmission {
  id        String    @id @default(cuid())
  name      String
  phone     String?
  email     String
  message   String    @db.Text
  status    String    @default("new") // new, read, replied, archived
  repliedAt DateTime?
  createdAt DateTime  @default(now())
}
```

### 11. TeamMember
Staff/leadership directory.
```prisma
model TeamMember {
  id       String  @id @default(cuid())
  name     String
  role     String
  phone    String?
  email    String?
  image    String?
  order    Int     @default(0)
  isActive Boolean @default(true)
}
```

### 12. Event
Community events.
```prisma
model Event {
  id          String   @id @default(cuid())
  title       String
  description String?  @db.Text
  date        DateTime
  location    String?
  image       String?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

### 13. JanazaNotice
Janaza (funeral) service notices.
```prisma
model JanazaNotice {
  id             String   @id @default(cuid())
  deceasedName   String
  prayerDate     DateTime
  prayerTime     String?
  prayerLocation String
  contactName    String?
  contactPhone   String?
  notes          String?  @db.Text
  status         String   @default("upcoming") // upcoming, completed
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### 14. GalleryImage
General gallery images.
```prisma
model GalleryImage {
  id          String   @id @default(cuid())
  url         String
  title       String?
  description String?
  album       String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}
```

### 15. Video
YouTube video references.
```prisma
model Video {
  id        String   @id @default(cuid())
  youtubeId String   @unique
  title     String
  artist    String?
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

### 16. AdminUser
Admin authentication.
```prisma
model AdminUser {
  id           String        @id @default(cuid())
  email        String        @unique
  passwordHash String
  name         String?
  role         String        @default("editor") // admin, editor, viewer
  lastLoginAt  DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  logs         ActivityLog[]
}
```

### 17. ActivityLog
Audit trail for admin actions.
```prisma
model ActivityLog {
  id         String     @id @default(cuid())
  action     String     // "create", "update", "delete"
  resource   String     // "NewsArticle", "Project", etc.
  resourceId String?
  details    Json?
  userId     String?
  user       AdminUser? @relation(fields: [userId], references: [id])
  createdAt  DateTime   @default(now())
}
```

### 18. SiteSettings
Global site configuration.
```prisma
model SiteSettings {
  id           String   @id @default("default")
  siteName     String   @default("Jaffna Muslim Association UK")
  contactEmail String?
  contactPhone String?
  address      String?
  bankDetails  Json?    // Bank account info for donations
  socialLinks  Json?    // Facebook, Twitter, etc.
  updatedAt    DateTime @updatedAt
}
```

---

## WORKFLOWS & API ENDPOINTS

### 1. Donation Workflow
**Current State:** PayPal client-side only, donor data not persisted

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donations` | Create donation record with donor info |
| POST | `/api/donations/paypal-webhook` | PayPal IPN webhook handler |
| GET | `/api/donations/:id` | Get donation receipt |
| GET | `/api/donations/stats` | Donation statistics (admin) |

**Flow:**
1. User selects amount and category
2. User fills donor form (optional if anonymous)
3. PayPal payment initiated
4. On PayPal approval → POST to backend with paypalOrderId
5. Backend verifies with PayPal API and stores record
6. Send confirmation email with receipt

---

### 2. Newsletter Subscription Workflow
**Current State:** UI only, not connected to backend

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe with email verification |
| GET | `/api/newsletter/verify/:token` | Verify email address |
| GET | `/api/newsletter/unsubscribe/:token` | Unsubscribe from newsletter |

**Flow:**
1. User submits email + name
2. Backend creates unverified subscriber
3. Send verification email with token
4. User clicks link → mark as verified

---

### 3. Contact Form Workflow
**Current State:** UI only, not connected to backend

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | List submissions (admin) |
| PATCH | `/api/contact/:id` | Update status (admin) |

**Flow:**
1. User submits form
2. Backend stores submission
3. Send notification email to admin
4. Send auto-reply to user

---

### 4. News/Articles Workflow
**Current State:** Fetches from WordPress REST API

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | List articles (paginated, filterable) |
| GET | `/api/news/:slug` | Get single article by slug |
| POST | `/api/news` | Create article (admin) |
| PUT | `/api/news/:id` | Update article (admin) |
| DELETE | `/api/news/:id` | Delete article (admin) |

**Query Parameters for GET /api/news:**
- `page` - Page number (default: 1)
- `perPage` - Items per page (default: 6)
- `category` - Filter by category

---

### 5. Projects Workflow
**Current State:** Hardcoded data in components

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects (filterable) |
| GET | `/api/projects/year/:year` | Projects for specific year |
| GET | `/api/projects/stats` | Summary statistics |
| GET | `/api/projects/categories` | Category breakdown for charts |
| POST | `/api/projects` | Create project (admin) |
| PUT | `/api/projects/:id` | Update project (admin) |
| DELETE | `/api/projects/:id` | Delete project (admin) |

---

### 6. Janaza Services Workflow
**Current State:** Hardcoded example notices

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/janaza` | List recent notices |
| GET | `/api/janaza/:id` | Get single notice |
| POST | `/api/janaza/request` | Family submits service request |
| POST | `/api/janaza` | Create notice (admin) |
| PUT | `/api/janaza/:id` | Update notice (admin) |
| DELETE | `/api/janaza/:id` | Delete notice (admin) |

---

### 7. Gallery Management Workflow
**Current State:** Static image arrays

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery` | List images (paginated) |
| GET | `/api/gallery/albums` | List albums |
| POST | `/api/gallery/upload` | Upload image (admin) |
| DELETE | `/api/gallery/:id` | Delete image (admin) |
| GET | `/api/videos` | List YouTube videos |
| POST | `/api/videos` | Add video (admin) |
| DELETE | `/api/videos/:id` | Delete video (admin) |

---

### 8. Admin Authentication Workflow
**Current State:** No admin system

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/reset-password` | Password reset |

---

### 9. Team Members Management
**Current State:** Hardcoded in contact component

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/team` | List team members |
| POST | `/api/team` | Add member (admin) |
| PUT | `/api/team/:id` | Update member (admin) |
| DELETE | `/api/team/:id` | Delete member (admin) |

---

### 10. Events Management
**Current State:** Hardcoded in home component

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List upcoming events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |

---

## IMPLEMENTATION PRIORITY

### Phase 1 - Core (High Priority)
| Priority | Entity | Reason |
|----------|--------|--------|
| 1 | Donation + Donor | Payment tracking, donor management |
| 2 | ContactSubmission | User inquiries need response |
| 3 | NewsletterSubscriber | Email list building |
| 4 | AdminUser + ActivityLog | Secure admin access |

### Phase 2 - Content Management
| Priority | Entity | Reason |
|----------|--------|--------|
| 5 | NewsArticle + Author | Replace WordPress dependency |
| 6 | Project + ProjectCategory | Dynamic project management |
| 7 | TeamMember | Staff directory |

### Phase 3 - Additional Features
| Priority | Entity | Reason |
|----------|--------|--------|
| 8 | JanazaNotice | Funeral notice system |
| 9 | Event | Event management |
| 10 | GalleryImage | Media management |
| 11 | Video | YouTube integration |
| 12 | SiteSettings | Global configuration |

---

## EXTERNAL SERVICES NEEDED

### 1. Email Service (SendGrid / AWS SES)
- Donation receipts
- Newsletter verification emails
- Contact form notifications
- Admin alerts

### 2. PayPal API
- Server-side payment verification
- Webhook handling (IPN)
- Refund processing

### 3. Image Storage (Cloudinary / AWS S3)
- Gallery uploads
- Project images
- Team member photos

### 4. Database Hosting (PostgreSQL)
- Supabase (recommended - free tier available)
- Railway
- Neon
- PlanetScale (MySQL alternative)

---

## DATA MIGRATION NOTES

### From WordPress
Current news articles are fetched from:
```
https://jaffnamuslimuk.org/wp-json/wp/v2/posts
```

Migration steps:
1. Fetch all posts from WordPress API
2. Transform to NewsArticle schema
3. Download and re-upload featured images
4. Map WordPress categories to new category values

### From Hardcoded Data
Components with hardcoded data to migrate:
- `/components/projects/project-table.tsx` → Project table
- `/components/home/news-events.tsx` → Events
- `/components/contact/contact-section.tsx` → TeamMember
- `/components/gallery/gallery-section.tsx` → GalleryImage
- `/components/gallery/youtube-section.tsx` → Video
- `/components/donate/donation-info.tsx` → DonationCategory

---

## ENTITY RELATIONSHIP DIAGRAM

```
Donor ──────────< Donation
                      │
                      └── (category references DonationCategory.value)

Author ─────────< NewsArticle

ProjectCategory ──< Project ──< ProjectImage

AdminUser ──────< ActivityLog

(Standalone entities)
├── NewsletterSubscriber
├── ContactSubmission
├── TeamMember
├── Event
├── JanazaNotice
├── GalleryImage
├── Video
└── SiteSettings
```
