# Backend Guide for Beginners

A simple explanation of the JMA backend for interns.

---

## What is a Backend?

Think of a website like a restaurant:
- **Frontend** = The dining area (what customers see - menus, tables, decorations)
- **Backend** = The kitchen (where food is prepared, orders are processed, inventory is stored)

The frontend (Next.js) is already built. Your job is to build the **kitchen** - the backend that:
- Stores data in a database
- Processes requests (like saving a donation)
- Sends responses back to the frontend

---

## What Tools Are We Using?

### PostgreSQL (The Database)
- Think of it as a **giant Excel file** with multiple sheets (tables)
- Each table stores one type of data (donors, donations, news articles, etc.)
- Data is organized in rows and columns

### Prisma (The Translator)
- Prisma helps us talk to the database using JavaScript/TypeScript
- Instead of writing complex SQL queries, we write simple code like:
  ```js
  // Get all donations
  const donations = await prisma.donation.findMany()

  // Create a new donor
  const donor = await prisma.donor.create({
    data: { firstName: "John", email: "john@example.com" }
  })
  ```

---

## Database Tables Explained

We need 18 tables. Here's what each one stores:

### Core Tables (Build These First)

| Table | What It Stores | Real-World Example |
|-------|---------------|-------------------|
| **Donor** | People who donate | Like a customer database |
| **Donation** | Each donation made | Like a receipt/transaction log |
| **ContactSubmission** | Messages from contact form | Like an inbox |
| **NewsletterSubscriber** | People who signed up for emails | Like a mailing list |
| **AdminUser** | Staff who can manage the site | Like employee login credentials |

### Content Tables (Build Second)

| Table | What It Stores | Real-World Example |
|-------|---------------|-------------------|
| **NewsArticle** | Blog posts and news | Like newspaper articles |
| **Author** | Who wrote the articles | Like a list of journalists |
| **Project** | Charity projects | Like a portfolio of completed work |
| **ProjectCategory** | Types of projects | Like folders (Education, Healthcare, etc.) |
| **TeamMember** | Staff shown on website | Like an "About Us" page |

### Additional Tables (Build Last)

| Table | What It Stores |
|-------|---------------|
| **Event** | Upcoming community events |
| **JanazaNotice** | Funeral prayer announcements |
| **GalleryImage** | Photos for the gallery |
| **Video** | YouTube video links |
| **SiteSettings** | Website configuration (phone, address, etc.) |
| **ActivityLog** | Who did what (for security) |

---

## How Tables Connect (Relationships)

Some tables are connected. Here's the simple version:

```
DONOR
  │
  └── has many ──> DONATIONS
                      (One person can donate multiple times)

AUTHOR
  │
  └── has many ──> NEWS ARTICLES
                      (One author can write many articles)

PROJECT CATEGORY (e.g., "Education")
  │
  └── has many ──> PROJECTS
                      │
                      └── has many ──> PROJECT IMAGES
```

---

## How Data Flows

### Example: Someone Makes a Donation

```
USER ACTION                         WHAT HAPPENS IN BACKEND
─────────────────────────────────────────────────────────────

1. User clicks "Donate $50"
         │
         ▼
2. User fills form (name, email)
         │
         ▼
3. User pays via PayPal ────────►  PayPal processes payment
         │                                    │
         ▼                                    ▼
4. Frontend sends data ─────────►  Backend receives request
   to our API                      POST /api/donations
         │                                    │
         ▼                                    ▼
5. Backend saves to database ───►  Creates row in Donor table
                                   Creates row in Donation table
         │                                    │
         ▼                                    ▼
6. Backend sends confirmation ──►  Returns success + receipt ID
         │
         ▼
7. User sees "Thank you!" page
```

---

## API Endpoints Explained

An API endpoint is like a **specific service window** at a bank:
- Window 1: Deposits (POST - add something)
- Window 2: Withdrawals (DELETE - remove something)
- Window 3: Balance Check (GET - retrieve information)
- Window 4: Update Address (PUT/PATCH - change something)

### Our Main Endpoints

#### Donations
| What You Want | Method | URL | Who Can Use |
|--------------|--------|-----|-------------|
| Record a donation | POST | `/api/donations` | Anyone |
| Get donation receipt | GET | `/api/donations/123` | Anyone |
| See all donations | GET | `/api/donations` | Admin only |

#### Contact Form
| What You Want | Method | URL | Who Can Use |
|--------------|--------|-----|-------------|
| Submit message | POST | `/api/contact` | Anyone |
| See all messages | GET | `/api/contact` | Admin only |
| Mark as replied | PATCH | `/api/contact/123` | Admin only |

#### Newsletter
| What You Want | Method | URL | Who Can Use |
|--------------|--------|-----|-------------|
| Subscribe | POST | `/api/newsletter/subscribe` | Anyone |
| Verify email | GET | `/api/newsletter/verify/abc123` | Anyone |
| Unsubscribe | GET | `/api/newsletter/unsubscribe/xyz789` | Anyone |

#### News Articles
| What You Want | Method | URL | Who Can Use |
|--------------|--------|-----|-------------|
| List all articles | GET | `/api/news` | Anyone |
| Read one article | GET | `/api/news/my-article-slug` | Anyone |
| Create article | POST | `/api/news` | Admin only |
| Edit article | PUT | `/api/news/123` | Admin only |
| Delete article | DELETE | `/api/news/123` | Admin only |

---

## Understanding the Prisma Schema

Each table is defined as a "model". Here's how to read it:

```prisma
model Donor {
  id visually   String   @id @default(cuid())  // Unique ID (auto-generated)
  firstName     String?                        // ? means optional
  email         String?                        // Can be empty
  isAnonymous   Boolean  @default(false)       // Default is false
  createdAt     DateTime @default(now())       // Auto-set to current time
  donations     Donation[]                     // Link to donations table
}
```

### Common Symbols
| Symbol | Meaning |
|--------|---------|
| `String` | Text (names, emails, etc.) |
| `Int` | Whole numbers (1, 2, 3) |
| `Decimal` | Money amounts (10.50) |
| `Boolean` | True or False |
| `DateTime` | Date and time |
| `?` | Optional (can be empty) |
| `@id` | This is the unique identifier |
| `@unique` | No duplicates allowed |
| `@default(...)` | Automatic default value |

---

## Getting Started

### Step 1: Setup Prisma
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma (creates prisma folder)
npx prisma init
```

### Step 2: Add Database URL
In `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/jma_db"
```

### Step 3: Create Schema
Copy the models from `be.md` into `prisma/schema.prisma`

### Step 4: Push to Database
```bash
# Create tables in database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### Step 5: Use in Code
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Example: Get all donors
const donors = await prisma.donor.findMany()

// Example: Create a donation
const donation = await prisma.donation.create({
  data: {
    amount: 50.00,
    currency: "USD",
    donationType: "normal",
    status: "completed"
  }
})
```

---

## Your First Tasks

Start with these simple tasks:

### Task 1: Contact Form
1. Create the ContactSubmission model
2. Create POST `/api/contact` endpoint
3. Test by submitting the contact form

### Task 2: Newsletter
1. Create the NewsletterSubscriber model
2. Create POST `/api/newsletter/subscribe` endpoint
3. Test by subscribing with an email

### Task 3: Admin Login
1. Create the AdminUser model
2. Create POST `/api/auth/login` endpoint
3. Add password hashing with bcrypt

---

## Common Questions

**Q: What's the difference between POST, GET, PUT, DELETE?**
- **GET** = Read data (like looking at a menu)
- **POST** = Create new data (like placing an order)
- **PUT** = Replace existing data (like rewriting your entire order)
- **PATCH** = Update part of data (like changing just the drink)
- **DELETE** = Remove data (like canceling an order)

**Q: What is a slug?**
A URL-friendly version of a title. Example:
- Title: "Annual Charity Event 2024"
- Slug: "annual-charity-event-2024"

**Q: What is CRUD?**
The 4 basic operations:
- **C**reate (POST)
- **R**ead (GET)
- **U**pdate (PUT/PATCH)
- **D**elete (DELETE)

**Q: Why do some fields have `?` (optional)?**
Because not all data is required. For example:
- Anonymous donors don't provide their name
- Not every article has a featured image

---

## Need More Details?

See `be.md` for the complete technical specification with all models and endpoints.
