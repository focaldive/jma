# Entities for Admin Panel - JMA

This document shows how each database entity maps to admin panel features, with updated schemas that include admin-specific fields.

---

## Entity-Admin Page Mapping

| Admin Page | Primary Entity | Related Entities | Operations |
|------------|---------------|------------------|------------|
| **Dashboard** | All (stats) | - | Read only |
| **Donations List** | Donation | Donor | Read, Export |
| **Donation Detail** | Donation | Donor | Read, Add Notes |
| **Donors List** | Donor | Donation | Read, Export |
| **Donor Detail** | Donor | Donation[] | Read |
| **News List** | NewsArticle | Author | CRUD |
| **News Form** | NewsArticle | Author | Create, Update |
| **Projects List** | Project | ProjectCategory, ProjectImage | CRUD |
| **Project Form** | Project | ProjectCategory, ProjectImage | Create, Update |
| **Events List** | Event | - | CRUD |
| **Event Form** | Event | - | Create, Update |
| **Janaza List** | JanazaNotice | - | CRUD |
| **Janaza Form** | JanazaNotice | - | Create, Update |
| **Gallery** | GalleryImage | - | Create, Delete |
| **Videos** | Video | - | Create, Delete |
| **Team List** | TeamMember | - | CRUD |
| **Team Form** | TeamMember | - | Create, Update |
| **Newsletter** | NewsletterSubscriber | - | Read, Delete |
| **Messages List** | ContactSubmission | AdminUser (repliedBy) | Read, Update |
| **Message Detail** | ContactSubmission | AdminUser | Read, Reply |
| **Site Settings** | SiteSettings | - | Read, Update |
| **Admin Users** | AdminUser | - | CRUD |
| **Activity Logs** | ActivityLog | AdminUser | Read only |

---

## Updated Prisma Schema (Admin-Ready)

### 1. AdminUser (Enhanced)

```prisma
model AdminUser {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  avatar        String?                    // NEW: Profile picture
  role          Role      @default(EDITOR) // Changed to enum
  isActive      Boolean   @default(true)   // NEW: Can disable without deleting
  refreshToken  String?                    // NEW: For JWT refresh
  lastLoginAt   DateTime?
  lastLoginIp   String?                    // NEW: Security tracking
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  logs              ActivityLog[]
  createdArticles   NewsArticle[]  @relation("CreatedBy")
  updatedArticles   NewsArticle[]  @relation("UpdatedBy")
  createdProjects   Project[]      @relation("ProjectCreatedBy")
  updatedProjects   Project[]      @relation("ProjectUpdatedBy")
  createdEvents     Event[]        @relation("EventCreatedBy")
  updatedEvents     Event[]        @relation("EventUpdatedBy")
  repliedMessages   ContactSubmission[] @relation("RepliedBy")
}

enum Role {
  ADMIN   // Full access
  EDITOR  // Content management
  VIEWER  // Read only
}
```

**Admin Panel Usage:**
- `/admin/login` - Authentication
- `/admin/settings/users` - User management
- Header - Display name, avatar, logout

---

### 2. Donor

```prisma
model Donor {
  id           String     @id @default(cuid())
  firstName    String?
  lastName     String?
  email        String?    @unique          // Made unique for lookup
  phone        String?
  address      String?
  country      String?
  region       String?
  isAnonymous  Boolean    @default(false)
  wantsUpdates Boolean    @default(false)
  totalDonated Decimal    @default(0) @db.Decimal(12, 2)  // NEW: Cached total
  donationCount Int       @default(0)                      // NEW: Cached count
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  donations    Donation[]
}
```

**Admin Panel Usage:**
- `/admin/donors` - List all donors
- `/admin/donors/[id]` - View donor profile with donation history
- Dashboard - Total donors count

---

### 3. Donation (Enhanced)

```prisma
model Donation {
  id            String   @id @default(cuid())
  amount        Decimal  @db.Decimal(10, 2)
  currency      String   @default("GBP")
  donationType  String   // "normal" | "live_appeal"
  category      String?  // healthcare, education, zakat, etc.
  paypalOrderId String?  @unique
  paypalPayerId String?                      // NEW: PayPal payer ID
  status        DonationStatus @default(PENDING)  // Changed to enum
  adminNotes    String?  @db.Text            // NEW: Internal notes
  receiptSent   Boolean  @default(false)     // NEW: Track if receipt emailed
  receiptSentAt DateTime?                    // NEW: When receipt was sent

  donorId       String?
  donor         Donor?   @relation(fields: [donorId], references: [id])
  createdAt     DateTime @default(now())
}

enum DonationStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}
```

**Admin Panel Usage:**
- `/admin/donations` - List with filters (status, category, date)
- `/admin/donations/[id]` - View details, add notes
- Dashboard - Total donations, monthly stats, charts

---

### 4. DonationCategory

```prisma
model DonationCategory {
  id          String  @id @default(cuid())
  label       String  // "Medical & Healthcare"
  value       String  @unique // "healthcare"
  description String? @db.Text
  icon        String? // Icon name for display
  color       String? // Color for charts
  isActive    Boolean @default(true)
  order       Int     @default(0)  // NEW: Display order
}
```

**Admin Panel Usage:**
- Settings or separate page for category management
- Dropdown options in reports/filters

---

### 5. NewsArticle (Enhanced)

```prisma
model NewsArticle {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  excerpt       String?   @db.Text
  content       String    @db.Text
  category      String
  featuredImage String?
  isPublished   Boolean   @default(false)
  isFeatured    Boolean   @default(false)  // NEW: Show on homepage
  viewCount     Int       @default(0)      // NEW: Analytics
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  authorId      String
  author        Author    @relation(fields: [authorId], references: [id])
  createdById   String?                    // NEW: Admin who created
  createdBy     AdminUser? @relation("CreatedBy", fields: [createdById], references: [id])
  updatedById   String?                    // NEW: Admin who last updated
  updatedBy     AdminUser? @relation("UpdatedBy", fields: [updatedById], references: [id])
}
```

**Admin Panel Usage:**
- `/admin/news` - List articles with status badges
- `/admin/news/new` - Create with rich text editor
- `/admin/news/[id]/edit` - Edit existing
- Dashboard - Recent articles count

---

### 6. Author

```prisma
model Author {
  id       String        @id @default(cuid())
  name     String
  email    String?       // NEW: Contact email
  bio      String?       @db.Text  // NEW: Author bio
  avatar   String?       // NEW: Author photo
  role     String?
  isActive Boolean       @default(true)  // NEW: Can disable

  articles NewsArticle[]
}
```

**Admin Panel Usage:**
- Dropdown when creating/editing articles
- Could have separate author management page

---

### 7. Project (Enhanced)

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String?                      // NEW: Optional title
  year        Int
  month       String
  description String   @db.Text
  location    String
  currency    String
  amount      Decimal  @db.Decimal(12, 2)
  status      ProjectStatus @default(COMPLETED)  // NEW
  beneficiaries Int?                       // NEW: People helped
  isPublished Boolean  @default(true)      // NEW: Can hide
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  categoryId  String?
  category    ProjectCategory? @relation(fields: [categoryId], references: [id])
  images      ProjectImage[]
  createdById String?
  createdBy   AdminUser? @relation("ProjectCreatedBy", fields: [createdById], references: [id])
  updatedById String?
  updatedBy   AdminUser? @relation("ProjectUpdatedBy", fields: [updatedById], references: [id])
}

enum ProjectStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

**Admin Panel Usage:**
- `/admin/projects` - List with year/category filters
- `/admin/projects/new` - Create with image upload
- `/admin/projects/[id]/edit` - Edit existing
- Dashboard - Total projects, amount spent

---

### 8. ProjectCategory

```prisma
model ProjectCategory {
  id       String    @id @default(cuid())
  name     String    @unique
  color    String    // Hex color for charts
  icon     String?   // Icon name
  order    Int       @default(0)

  projects Project[]
}
```

**Admin Panel Usage:**
- Dropdown in project form
- Chart colors in dashboard/reports

---

### 9. ProjectImage

```prisma
model ProjectImage {
  id        String  @id @default(cuid())
  url       String
  alt       String?
  caption   String?  // NEW: Image caption
  order     Int      @default(0)  // NEW: Display order

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

**Admin Panel Usage:**
- Image gallery in project form
- Drag to reorder

---

### 10. Event (Enhanced)

```prisma
model Event {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique         // NEW: URL-friendly
  description String?     @db.Text
  date        DateTime
  endDate     DateTime?                   // NEW: For multi-day events
  time        String?                     // NEW: Display time
  location    String?
  address     String?     @db.Text        // NEW: Full address
  image       String?
  isPublished Boolean     @default(false)
  isFeatured  Boolean     @default(false) // NEW: Show on homepage
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  createdById String?
  createdBy   AdminUser?  @relation("EventCreatedBy", fields: [createdById], references: [id])
  updatedById String?
  updatedBy   AdminUser?  @relation("EventUpdatedBy", fields: [updatedById], references: [id])
}
```

**Admin Panel Usage:**
- `/admin/events` - List upcoming/past events
- `/admin/events/new` - Create event
- `/admin/events/[id]/edit` - Edit event

---

### 11. JanazaNotice (Enhanced)

```prisma
model JanazaNotice {
  id             String       @id @default(cuid())
  deceasedName   String
  age            Int?                        // NEW
  prayerDate     DateTime
  prayerTime     String?
  prayerLocation String
  burialLocation String?                     // NEW
  contactName    String?
  contactPhone   String?
  contactEmail   String?                     // NEW
  notes          String?      @db.Text
  status         JanazaStatus @default(UPCOMING)  // Changed to enum
  isPublished    Boolean      @default(true)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum JanazaStatus {
  UPCOMING
  COMPLETED
  CANCELLED
}
```

**Admin Panel Usage:**
- `/admin/janaza` - List notices
- `/admin/janaza/new` - Create notice
- `/admin/janaza/[id]/edit` - Update status

---

### 12. GalleryImage (Enhanced)

```prisma
model GalleryImage {
  id          String   @id @default(cuid())
  url         String
  thumbnailUrl String?                    // NEW: Smaller version
  title       String?
  description String?
  album       String?
  tags        String[]                    // NEW: For filtering
  width       Int?                        // NEW: Image dimensions
  height      Int?
  fileSize    Int?                        // NEW: In bytes
  order       Int      @default(0)
  isPublished Boolean  @default(true)     // NEW
  createdAt   DateTime @default(now())
}
```

**Admin Panel Usage:**
- `/admin/gallery` - Grid view
- Upload with drag & drop
- Edit metadata, reorder

---

### 13. Video (Enhanced)

```prisma
model Video {
  id          String   @id @default(cuid())
  youtubeId   String   @unique
  title       String
  description String?  @db.Text           // NEW
  artist      String?
  thumbnail   String?                     // NEW: Custom thumbnail
  duration    String?                     // NEW: "5:30"
  category    String?                     // NEW
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)    // NEW
  createdAt   DateTime @default(now())
}
```

**Admin Panel Usage:**
- `/admin/videos` - List/grid view
- Add by YouTube URL (auto-fetch metadata)

---

### 14. TeamMember (Enhanced)

```prisma
model TeamMember {
  id          String  @id @default(cuid())
  name        String
  role        String
  department  String?                     // NEW: Group by department
  bio         String? @db.Text            // NEW
  phone       String?
  email       String?
  image       String?
  linkedin    String?                     // NEW
  twitter     String?                     // NEW
  order       Int     @default(0)
  isActive    Boolean @default(true)
  showOnSite  Boolean @default(true)      // NEW: Can hide from public
}
```

**Admin Panel Usage:**
- `/admin/team` - List with drag to reorder
- `/admin/team/new` - Add member with photo upload
- `/admin/team/[id]/edit` - Edit details

---

### 15. NewsletterSubscriber (Enhanced)

```prisma
model NewsletterSubscriber {
  id               String    @id @default(cuid())
  email            String    @unique
  firstName        String?
  lastName         String?
  source           String?                  // NEW: "donation_page", "footer", etc.
  ipAddress        String?                  // NEW: For spam prevention
  isVerified       Boolean   @default(false)
  verifyToken      String?   @unique
  unsubscribeToken String    @unique @default(cuid())
  subscribedAt     DateTime  @default(now())
  verifiedAt       DateTime?               // NEW
  unsubscribedAt   DateTime?
  unsubscribeReason String?                // NEW: Why they left
}
```

**Admin Panel Usage:**
- `/admin/newsletter` - List with status filter
- Export to CSV for email campaigns
- Resend verification email

---

### 16. ContactSubmission (Enhanced)

```prisma
model ContactSubmission {
  id           String    @id @default(cuid())
  name         String
  phone        String?
  email        String
  subject      String?                    // NEW
  message      String    @db.Text
  status       MessageStatus @default(NEW)  // Changed to enum
  priority     Priority  @default(NORMAL)   // NEW
  replyContent String?   @db.Text          // NEW: Admin's reply
  repliedAt    DateTime?
  repliedById  String?                     // NEW: Who replied
  repliedBy    AdminUser? @relation("RepliedBy", fields: [repliedById], references: [id])
  ipAddress    String?                     // NEW
  userAgent    String?                     // NEW
  createdAt    DateTime  @default(now())
}

enum MessageStatus {
  NEW
  READ
  REPLIED
  ARCHIVED
  SPAM
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

**Admin Panel Usage:**
- `/admin/messages` - Inbox-style list
- `/admin/messages/[id]` - View & reply
- Mark as spam, archive

---

### 17. ActivityLog (Enhanced)

```prisma
model ActivityLog {
  id         String    @id @default(cuid())
  action     String    // "create", "update", "delete", "login", "export"
  resource   String    // "NewsArticle", "Project", "Donation"
  resourceId String?
  details    Json?     // What changed
  ipAddress  String?                      // NEW
  userAgent  String?                      // NEW
  userId     String?
  user       AdminUser? @relation(fields: [userId], references: [id])
  createdAt  DateTime  @default(now())

  @@index([resource, resourceId])         // NEW: For faster lookups
  @@index([userId])
  @@index([createdAt])
}
```

**Admin Panel Usage:**
- `/admin/settings/logs` - Activity feed
- Filter by user, resource, date
- Security audit trail

---

### 18. SiteSettings (Enhanced)

```prisma
model SiteSettings {
  id              String   @id @default("default")
  siteName        String   @default("Jaffna Muslim Association UK")
  tagline         String?                    // NEW
  contactEmail    String?
  contactPhone    String?
  whatsappNumber  String?                    // NEW
  address         String?  @db.Text

  // Bank Details (JSON)
  bankDetails     Json?

  // Social Links (JSON)
  socialLinks     Json?

  // SEO
  metaTitle       String?                    // NEW
  metaDescription String?  @db.Text          // NEW

  // Features
  maintenanceMode Boolean  @default(false)   // NEW
  donationsEnabled Boolean @default(true)    // NEW

  updatedAt       DateTime @updatedAt
}
```

**Admin Panel Usage:**
- `/admin/settings` - Tabbed form
- General, Bank Details, Social, SEO tabs

---

## Visual Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN PANEL ENTITIES                         │
└─────────────────────────────────────────────────────────────────────┘

                            ┌──────────────┐
                            │  AdminUser   │
                            │──────────────│
                            │ • email      │
                            │ • role       │
                            │ • isActive   │
                            └──────┬───────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
    │ActivityLog  │        │NewsArticle  │        │ContactSubmis│
    │─────────────│        │─────────────│        │─────────────│
    │ • action    │        │ • title     │        │ • message   │
    │ • resource  │        │ • content   │        │ • status    │
    │ • details   │        │ • createdBy │        │ • repliedBy │
    └─────────────┘        │ • updatedBy │        └─────────────┘
                           └──────┬──────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │   Author    │
                           │─────────────│
                           │ • name      │
                           │ • role      │
                           └─────────────┘


    ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
    │   Donor     │───────▶│  Donation   │◀───────│ DonationCat │
    │─────────────│   1:N  │─────────────│        │─────────────│
    │ • name      │        │ • amount    │        │ • label     │
    │ • email     │        │ • status    │        │ • value     │
    │ • totalDon  │        │ • category  │        └─────────────┘
    └─────────────┘        └─────────────┘


    ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
    │ProjectCateg │───────▶│   Project   │───────▶│ProjectImage │
    │─────────────│   1:N  │─────────────│   1:N  │─────────────│
    │ • name      │        │ • title     │        │ • url       │
    │ • color     │        │ • amount    │        │ • alt       │
    └─────────────┘        │ • location  │        └─────────────┘
                           └─────────────┘


    ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
    │   Event     │        │JanazaNotice │        │ TeamMember  │
    │─────────────│        │─────────────│        │─────────────│
    │ • title     │        │ • deceased  │        │ • name      │
    │ • date      │        │ • prayerDate│        │ • role      │
    │ • location  │        │ • status    │        │ • order     │
    └─────────────┘        └─────────────┘        └─────────────┘


    ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
    │GalleryImage │        │   Video     │        │ Newsletter  │
    │─────────────│        │─────────────│        │ Subscriber  │
    │ • url       │        │ • youtubeId │        │─────────────│
    │ • album     │        │ • title     │        │ • email     │
    │ • order     │        │ • order     │        │ • isVerified│
    └─────────────┘        └─────────────┘        └─────────────┘


                           ┌─────────────┐
                           │SiteSettings │
                           │─────────────│
                           │ • siteName  │
                           │ • bankDets  │
                           │ • socials   │
                           └─────────────┘
```

---

## Dashboard Stats Queries

```typescript
// Total donations (all time)
const totalDonations = await prisma.donation.aggregate({
  _sum: { amount: true },
  where: { status: 'COMPLETED' }
})

// This month's donations
const thisMonthDonations = await prisma.donation.aggregate({
  _sum: { amount: true },
  where: {
    status: 'COMPLETED',
    createdAt: { gte: startOfMonth(new Date()) }
  }
})

// Total subscribers
const subscriberCount = await prisma.newsletterSubscriber.count({
  where: { isVerified: true, unsubscribedAt: null }
})

// Unread messages
const unreadMessages = await prisma.contactSubmission.count({
  where: { status: 'NEW' }
})

// Recent activity
const recentActivity = await prisma.activityLog.findMany({
  take: 10,
  orderBy: { createdAt: 'desc' },
  include: { user: true }
})
```

---

## Summary: Entity Count

| Category | Entities | Count |
|----------|----------|-------|
| **Auth** | AdminUser, ActivityLog | 2 |
| **Donations** | Donor, Donation, DonationCategory | 3 |
| **Content** | NewsArticle, Author, Project, ProjectCategory, ProjectImage, Event, JanazaNotice | 7 |
| **Media** | GalleryImage, Video | 2 |
| **People** | TeamMember, NewsletterSubscriber, ContactSubmission | 3 |
| **Config** | SiteSettings | 1 |
| **Total** | | **18** |
