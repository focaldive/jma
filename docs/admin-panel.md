# Admin Panel Specification - JMA

Complete specification for the admin panel at `/admin` route.

---

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN PANEL STRUCTURE                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌─────────────────────────────────────────────┐ │
│  │          │  │  Header (user info, notifications, logout)  │ │
│  │          │  └─────────────────────────────────────────────┘ │
│  │          │  ┌─────────────────────────────────────────────┐ │
│  │ Sidebar  │  │                                             │ │
│  │          │  │                                             │ │
│  │ - Dashboard│ │            Main Content Area               │ │
│  │ - Donations│ │                                             │ │
│  │ - News    │  │                                             │ │
│  │ - Projects│  │                                             │ │
│  │ - Events  │  │                                             │ │
│  │ - Janaza  │  │                                             │ │
│  │ - Gallery │  │                                             │ │
│  │ - Team    │  │                                             │ │
│  │ - Messages│  │                                             │ │
│  │ - Newsletter│                                             │ │
│  │ - Settings│  │                                             │ │
│  │          │  │                                             │ │
│  └──────────┘  └─────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page Routes

| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | Login | Admin authentication |
| `/admin` | Dashboard | Overview & statistics |
| `/admin/donations` | Donations List | All donations |
| `/admin/donations/[id]` | Donation Detail | Single donation view |
| `/admin/donors` | Donors List | All donors |
| `/admin/donors/[id]` | Donor Detail | Donor profile & history |
| `/admin/news` | News List | All articles |
| `/admin/news/new` | Create Article | New article form |
| `/admin/news/[id]/edit` | Edit Article | Edit existing article |
| `/admin/projects` | Projects List | All projects |
| `/admin/projects/new` | Create Project | New project form |
| `/admin/projects/[id]/edit` | Edit Project | Edit existing project |
| `/admin/events` | Events List | All events |
| `/admin/events/new` | Create Event | New event form |
| `/admin/events/[id]/edit` | Edit Event | Edit existing event |
| `/admin/janaza` | Janaza List | All notices |
| `/admin/janaza/new` | Create Notice | New janaza notice |
| `/admin/janaza/[id]/edit` | Edit Notice | Edit existing notice |
| `/admin/gallery` | Gallery | Images management |
| `/admin/videos` | Videos | YouTube videos |
| `/admin/team` | Team Members | Staff management |
| `/admin/team/new` | Add Member | New team member |
| `/admin/team/[id]/edit` | Edit Member | Edit team member |
| `/admin/newsletter` | Subscribers | Newsletter list |
| `/admin/messages` | Contact Messages | Form submissions |
| `/admin/messages/[id]` | Message Detail | View & reply |
| `/admin/settings` | Site Settings | General config |
| `/admin/settings/users` | Admin Users | User management |
| `/admin/settings/logs` | Activity Logs | Audit trail |

---

## Folder Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout (sidebar + auth check)
│   ├── page.tsx                # Dashboard
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── donations/
│   │   ├── page.tsx            # Donations list
│   │   └── [id]/
│   │       └── page.tsx        # Donation detail
│   ├── donors/
│   │   ├── page.tsx            # Donors list
│   │   └── [id]/
│   │       └── page.tsx        # Donor detail
│   ├── news/
│   │   ├── page.tsx            # News list
│   │   ├── new/
│   │   │   └── page.tsx        # Create article
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit article
│   ├── projects/
│   │   ├── page.tsx            # Projects list
│   │   ├── new/
│   │   │   └── page.tsx        # Create project
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit project
│   ├── events/
│   │   ├── page.tsx            # Events list
│   │   ├── new/
│   │   │   └── page.tsx        # Create event
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit event
│   ├── janaza/
│   │   ├── page.tsx            # Janaza list
│   │   ├── new/
│   │   │   └── page.tsx        # Create notice
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit notice
│   ├── gallery/
│   │   └── page.tsx            # Gallery management
│   ├── videos/
│   │   └── page.tsx            # Videos management
│   ├── team/
│   │   ├── page.tsx            # Team list
│   │   ├── new/
│   │   │   └── page.tsx        # Add member
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit member
│   ├── newsletter/
│   │   └── page.tsx            # Subscribers list
│   ├── messages/
│   │   ├── page.tsx            # Messages list
│   │   └── [id]/
│   │       └── page.tsx        # Message detail
│   └── settings/
│       ├── page.tsx            # Site settings
│       ├── users/
│       │   └── page.tsx        # Admin users
│       └── logs/
│           └── page.tsx        # Activity logs

components/
├── admin/
│   ├── layout/
│   │   ├── admin-sidebar.tsx   # Navigation sidebar
│   │   ├── admin-header.tsx    # Top header bar
│   │   ├── admin-breadcrumb.tsx
│   │   └── mobile-nav.tsx      # Mobile navigation
│   ├── dashboard/
│   │   ├── stat-card.tsx       # Metric display card
│   │   ├── recent-activity.tsx # Activity feed
│   │   ├── donation-chart.tsx  # Donations over time
│   │   └── quick-actions.tsx   # Action buttons
│   ├── shared/
│   │   ├── data-table.tsx      # Reusable data table
│   │   ├── page-header.tsx     # Page title + actions
│   │   ├── search-input.tsx    # Search box
│   │   ├── filter-dropdown.tsx # Filter options
│   │   ├── pagination.tsx      # Page navigation
│   │   ├── confirm-dialog.tsx  # Delete confirmation
│   │   ├── status-badge.tsx    # Status indicator
│   │   └── empty-state.tsx     # No data message
│   ├── forms/
│   │   ├── article-form.tsx    # News article form
│   │   ├── project-form.tsx    # Project form
│   │   ├── event-form.tsx      # Event form
│   │   ├── janaza-form.tsx     # Janaza notice form
│   │   ├── team-form.tsx       # Team member form
│   │   ├── settings-form.tsx   # Site settings form
│   │   ├── image-uploader.tsx  # Image upload component
│   │   └── rich-text-editor.tsx# WYSIWYG editor
│   └── cards/
│       ├── donation-card.tsx   # Donation summary
│       ├── donor-card.tsx      # Donor info
│       ├── message-card.tsx    # Contact message
│       └── subscriber-card.tsx # Newsletter subscriber

lib/
├── admin/
│   ├── auth.ts                 # Auth utilities
│   ├── middleware.ts           # Route protection
│   └── permissions.ts          # Role-based access
```

---

## Page Specifications

### 1. Login Page (`/admin/login`)

```
┌─────────────────────────────────────┐
│                                     │
│         JMA Admin Panel             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Email                       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Password                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  [        Sign In Button       ]   │
│                                     │
│  Forgot password?                   │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Email/password login
- "Remember me" checkbox
- Forgot password link
- Error messages display
- Redirect to dashboard on success

---

### 2. Dashboard (`/admin`)

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                     [Refresh]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐│
│  │ Total       │ │ This Month  │ │ Subscribers │ │ Unread  ││
│  │ Donations   │ │ Donations   │ │             │ │ Messages││
│  │ £125,450    │ │ £8,230      │ │ 1,245       │ │ 12      ││
│  │ +12% ↑      │ │ +5% ↑       │ │ +23 new     │ │ 3 urgent││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘│
│                                                             │
│  ┌─────────────────────────────┐ ┌─────────────────────────┐│
│  │  Donations This Year        │ │  Quick Actions          ││
│  │  [Line/Bar Chart]           │ │                         ││
│  │                             │ │  [+ New Article]        ││
│  │                             │ │  [+ New Project]        ││
│  │                             │ │  [+ New Event]          ││
│  │                             │ │  [View Messages]        ││
│  └─────────────────────────────┘ └─────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Recent Activity                                        ││
│  │  ─────────────────────────────────────────────────────  ││
│  │  • New donation: £50 from John D. - 2 mins ago         ││
│  │  • Article published: "Annual Report 2024" - 1 hr ago  ││
│  │  • New subscriber: sarah@email.com - 3 hrs ago         ││
│  │  • Contact message from Ahmed - 5 hrs ago              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Stat Cards:**
| Metric | Data Source |
|--------|-------------|
| Total Donations | Sum of all completed donations |
| This Month | Current month donations |
| Subscribers | Newsletter subscriber count |
| Unread Messages | Contact submissions with status="new" |

**Charts:**
- Donations over time (line chart - last 12 months)
- Donations by category (pie chart)

---

### 3. Donations List (`/admin/donations`)

```
┌─────────────────────────────────────────────────────────────┐
│  Donations                                   [Export CSV]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Search...        ] [Status ▼] [Category ▼] [Date Range]  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ □  ID      Donor        Amount   Category   Status  Date││
│  │ ───────────────────────────────────────────────────────││
│  │ □  #1234   John Doe     £50.00   Zakat     ✓ Done  Dec 20││
│  │ □  #1233   Anonymous    £100.00  Education ✓ Done  Dec 19││
│  │ □  #1232   Sarah M.     £25.00   Healthcare✓ Done  Dec 18││
│  │ □  #1231   Ahmed K.     £75.00   Relief    ○ Pending Dec 18││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  [Delete Selected]              < 1 2 3 4 5 ... 20 >       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Search by donor name/email
- Filter by status (pending, completed, failed, refunded)
- Filter by category
- Filter by date range
- Sort by any column
- Bulk delete
- Export to CSV
- Click row to view details

**Table Columns:**
| Column | Description |
|--------|-------------|
| Checkbox | For bulk selection |
| ID | Donation reference |
| Donor | Name or "Anonymous" |
| Amount | With currency |
| Category | Donation type |
| Status | Badge (colored) |
| Date | Created date |
| Actions | View button |

---

### 4. News List (`/admin/news`)

```
┌─────────────────────────────────────────────────────────────┐
│  News Articles                               [+ New Article]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Search...        ] [Category ▼] [Status ▼]               │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ □  Image  Title              Category  Status    Actions││
│  │ ───────────────────────────────────────────────────────││
│  │ □  [img]  Annual Charity...  Events    Published  [Edit]││
│  │ □  [img]  Water Project...   Appeals   Draft      [Edit]││
│  │ □  [img]  Community Eid...   Community Published  [Edit]││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  [Delete Selected]              < 1 2 3 >                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Search by title
- Filter by category (Events, Appeals, Community)
- Filter by status (Draft, Published)
- Thumbnail preview
- Quick edit/delete actions
- Bulk delete

---

### 5. Article Form (`/admin/news/new` & `/admin/news/[id]/edit`)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back    Create New Article              [Save Draft] [Publish]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Title *                                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Enter article title...                                  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Slug                                                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ enter-article-title (auto-generated)                    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Category *                        Author *                 │
│  ┌──────────────────┐             ┌──────────────────┐     │
│  │ Events        ▼  │             │ Select author ▼  │     │
│  └──────────────────┘             └──────────────────┘     │
│                                                             │
│  Featured Image                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  [Drop image here or click to upload]                   ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Excerpt                                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Brief summary of the article...                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Content *                                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [B] [I] [U] [Link] [Image] [Quote] [List]              ││
│  │ ─────────────────────────────────────────────────────  ││
│  │                                                         ││
│  │  Write your article content here...                     ││
│  │                                                         ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Form Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | Text | Yes | Auto-generates slug |
| Slug | Text | Yes | URL-friendly, editable |
| Category | Select | Yes | Events/Appeals/Community |
| Author | Select | Yes | From authors list |
| Featured Image | Image Upload | No | Drag & drop |
| Excerpt | Textarea | No | Short summary |
| Content | Rich Text | Yes | WYSIWYG editor |

---

### 6. Projects List (`/admin/projects`)

```
┌─────────────────────────────────────────────────────────────┐
│  Projects                                    [+ New Project]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Search...        ] [Year ▼] [Category ▼]                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ □  Year  Month   Description        Location  Amount    ││
│  │ ───────────────────────────────────────────────────────││
│  │ □  2024  Dec     Water well cons... Jaffna   £5,000    ││
│  │ □  2024  Nov     School supplies... Colombo  £2,500    ││
│  │ □  2024  Oct     Medical camp...    Batticaloa £3,200  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Total: £125,450                    < 1 2 3 >               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 7. Gallery Management (`/admin/gallery`)

```
┌─────────────────────────────────────────────────────────────┐
│  Gallery                                     [+ Upload Images]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Search...        ] [Album ▼]                             │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  [img]  │ │  [img]  │ │  [img]  │ │  [img]  │          │
│  │         │ │         │ │         │ │         │          │
│  │ □ Select│ │ □ Select│ │ □ Select│ │ □ Select│          │
│  │ [Edit]  │ │ [Edit]  │ │ [Edit]  │ │ [Edit]  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  [img]  │ │  [img]  │ │  [img]  │ │  [img]  │          │
│  │         │ │         │ │         │ │         │          │
│  │ □ Select│ │ □ Select│ │ □ Select│ │ □ Select│          │
│  │ [Edit]  │ │ [Edit]  │ │ [Edit]  │ │ [Edit]  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  [Delete Selected]                  < 1 2 3 >               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Grid view of images
- Multi-file upload
- Edit title/description/album
- Filter by album
- Bulk delete
- Drag to reorder

---

### 8. Contact Messages (`/admin/messages`)

```
┌─────────────────────────────────────────────────────────────┐
│  Contact Messages                            [Export]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Search...        ] [Status ▼]                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  ● John Doe                                    Dec 20   ││
│  │    Question about donation...                           ││
│  │    [New]                                                ││
│  │ ─────────────────────────────────────────────────────  ││
│  │  ○ Sarah Ahmed                                 Dec 19   ││
│  │    Partnership inquiry...                               ││
│  │    [Read]                                               ││
│  │ ─────────────────────────────────────────────────────  ││
│  │  ✓ Mohammed K.                                Dec 18   ││
│  │    Volunteer application...                             ││
│  │    [Replied]                                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Message Detail View:**
- Full message content
- Reply via email button
- Mark as read/replied
- Archive option
- Delete option

---

### 9. Newsletter Subscribers (`/admin/newsletter`)

```
┌─────────────────────────────────────────────────────────────┐
│  Newsletter Subscribers (1,245)              [Export] [+ Add]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Search email...  ] [Status ▼]                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ □  Email              Name           Status     Date    ││
│  │ ───────────────────────────────────────────────────────││
│  │ □  john@email.com     John Doe       ✓ Verified Dec 20 ││
│  │ □  sarah@email.com    Sarah M.       ○ Pending  Dec 19 ││
│  │ □  ahmed@email.com    Ahmed K.       ✗ Unsub    Dec 15 ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  [Delete Selected] [Resend Verification]    < 1 2 3 >      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Search by email
- Filter by status (verified, pending, unsubscribed)
- Resend verification email
- Manual add subscriber
- Export list to CSV
- Bulk delete

---

### 10. Settings (`/admin/settings`)

```
┌─────────────────────────────────────────────────────────────┐
│  Settings                                    [Save Changes] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [General] [Bank Details] [Social Links]                   │
│                                                             │
│  Site Name                                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Jaffna Muslim Association UK                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Contact Email                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ info@jaffnamuslimuk.org                                 ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Contact Phone                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ +44 123 456 7890                                        ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Address                                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 123 Example Street, London, UK                          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Tabs:**
1. **General** - Site name, contact info, address
2. **Bank Details** - Account details for donations
3. **Social Links** - Facebook, Twitter, YouTube, etc.

---

## Role-Based Access Control

### Roles

| Role | Description |
|------|-------------|
| **Admin** | Full access to everything |
| **Editor** | Can manage content (news, projects, events) |
| **Viewer** | Read-only access to all sections |

### Permissions Matrix

| Feature | Admin | Editor | Viewer |
|---------|-------|--------|--------|
| Dashboard | Full | Full | View |
| Donations | Full | View | View |
| Donors | Full | View | View |
| News Articles | Full | Full | View |
| Projects | Full | Full | View |
| Events | Full | Full | View |
| Janaza Notices | Full | Full | View |
| Gallery | Full | Full | View |
| Videos | Full | Full | View |
| Team Members | Full | Edit | View |
| Messages | Full | View | View |
| Newsletter | Full | View | View |
| Site Settings | Full | - | - |
| Admin Users | Full | - | - |
| Activity Logs | Full | View | - |

---

## Reusable Components

### 1. DataTable Component

```tsx
<DataTable
  columns={columns}
  data={data}
  searchable={true}
  searchPlaceholder="Search..."
  filters={[
    { key: "status", label: "Status", options: [...] },
    { key: "category", label: "Category", options: [...] }
  ]}
  sortable={true}
  selectable={true}
  onSelectionChange={(selected) => {...}}
  pagination={{
    page: 1,
    perPage: 10,
    total: 100
  }}
  onPageChange={(page) => {...}}
/>
```

### 2. StatCard Component

```tsx
<StatCard
  title="Total Donations"
  value="£125,450"
  change="+12%"
  trend="up" // or "down"
  icon={DollarSign}
/>
```

### 3. PageHeader Component

```tsx
<PageHeader
  title="News Articles"
  description="Manage your blog posts and news"
  actions={[
    { label: "Export", onClick: handleExport },
    { label: "New Article", href: "/admin/news/new", primary: true }
  ]}
/>
```

### 4. ImageUploader Component

```tsx
<ImageUploader
  value={imageUrl}
  onChange={(url) => setImageUrl(url)}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
/>
```

### 5. RichTextEditor Component

```tsx
<RichTextEditor
  value={content}
  onChange={(html) => setContent(html)}
  placeholder="Write your content..."
  toolbar={['bold', 'italic', 'link', 'image', 'list']}
/>
```

---

## API Endpoints Used by Admin

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/donations` | List with filters |
| GET | `/api/admin/donations/:id` | Single donation |
| GET | `/api/admin/donations/stats` | Statistics |
| GET | `/api/admin/donors` | List donors |
| GET | `/api/admin/donors/:id` | Donor with history |

### Content (News, Projects, Events, Janaza)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/{resource}` | List all |
| GET | `/api/admin/{resource}/:id` | Get single |
| POST | `/api/admin/{resource}` | Create new |
| PUT | `/api/admin/{resource}/:id` | Update |
| DELETE | `/api/admin/{resource}/:id` | Delete |

### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/gallery` | List images |
| POST | `/api/admin/gallery/upload` | Upload image |
| DELETE | `/api/admin/gallery/:id` | Delete image |
| GET | `/api/admin/videos` | List videos |
| POST | `/api/admin/videos` | Add video |
| DELETE | `/api/admin/videos/:id` | Delete video |

### People
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/team` | List team |
| POST | `/api/admin/team` | Add member |
| PUT | `/api/admin/team/:id` | Update member |
| DELETE | `/api/admin/team/:id` | Delete member |
| GET | `/api/admin/newsletter` | List subscribers |
| DELETE | `/api/admin/newsletter/:id` | Remove subscriber |
| GET | `/api/admin/messages` | List messages |
| PATCH | `/api/admin/messages/:id` | Update status |
| DELETE | `/api/admin/messages/:id` | Delete message |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/settings` | Get settings |
| PUT | `/api/admin/settings` | Update settings |
| GET | `/api/admin/users` | List admin users |
| POST | `/api/admin/users` | Create admin |
| PUT | `/api/admin/users/:id` | Update admin |
| DELETE | `/api/admin/users/:id` | Delete admin |
| GET | `/api/admin/logs` | Activity logs |

---

## Implementation Order

### Phase 1: Foundation
1. Admin layout (sidebar, header)
2. Login page & authentication
3. Dashboard with basic stats

### Phase 2: Core Features
4. Donations list & detail
5. Contact messages
6. Newsletter subscribers

### Phase 3: Content Management
7. News articles CRUD
8. Projects CRUD
9. Events CRUD
10. Janaza notices CRUD

### Phase 4: Media & People
11. Gallery management
12. Videos management
13. Team members CRUD

### Phase 5: Settings & Security
14. Site settings
15. Admin user management
16. Activity logs
17. Role-based access control
