---
name: LoanTracker Design System
colors:
  surface: '#f5f6fa'
  surface-dim: '#ddd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f4'
  surface-container: '#f1edef'
  surface-container-high: '#ebe7e9'
  surface-container-highest: '#e5e1e3'
  on-surface: '#1c1b1d'
  on-surface-variant: '#47464c'
  inverse-surface: '#313032'
  inverse-on-surface: '#f4f0f2'
  outline: '#78767d'
  outline-variant: '#c8c5cd'
  surface-tint: '#5d5c74'
  primary: '#00000b'
  on-primary: '#ffffff'
  primary-container: '#1a1a2e'
  on-primary-container: '#83829b'
  inverse-primary: '#c6c4df'
  secondary: '#006b58'
  on-secondary: '#ffffff'
  secondary-container: '#82f7d8'
  on-secondary-container: '#00725e'
  tertiary: '#695d3c'
  on-tertiary: '#ffffff'
  tertiary-container: '#b9aa83'
  on-tertiary-container: '#493f20'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e0fc'
  primary-fixed-dim: '#c6c4df'
  on-primary-fixed: '#1a1a2e'
  on-primary-fixed-variant: '#45455b'
  secondary-fixed: '#82f7d8'
  secondary-fixed-dim: '#65dabc'
  on-secondary-fixed: '#002019'
  on-secondary-fixed-variant: '#005142'
  tertiary-fixed: '#f2e1b7'
  tertiary-fixed-dim: '#d5c59d'
  on-tertiary-fixed: '#231b02'
  on-tertiary-fixed-variant: '#514627'
  background: '#fcf8fa'
  on-background: '#1c1b1d'
  surface-variant: '#e5e1e3'
  navy: '#1a1a2e'
  teal: '#16a085'
  paid: '#27ae60'
  overdue: '#e74c3c'
  credit: '#c0392b'
  debit: '#27ae60'
  muted: '#7f8c8d'
  white: '#ffffff'
  text: '#2c3e50'
  border: '#e5e7eb'
  red-50: '#fef2f2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.3'
  section-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  micro:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.025em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  container-max: 1200px
  sidebar-width: 240px
  topbar-height: 64px
---

# LoanTracker — Web Dashboard Design Brief (for Google Stitch)

> Paste this entire file into Google Stitch. It is a complete UI brief to generate a **responsive web dashboard** that mirrors the existing **LoanTracker mobile app** (React Native + Expo + Supabase). Generate a polished, modern, finance-grade dashboard. Desktop-first (≥1024px), but every screen must gracefully collapse to tablet (768px) and mobile (≤480px).

---

## 1. Product Snapshot

LoanTracker is a personal money-lending ledger for someone who **takes loans (Credit)** and **gives loans (Debit)** at high volume. It tracks principal, monthly interest rate, tenure, due dates, repayment progress, and overdue alerts. The web dashboard is a 1:1 functional clone of the mobile app, redesigned for the desktop web context.

**Audience:** A small business owner / private money lender in India. They live on this dashboard daily — speed and clarity beat decoration.

**Core jobs to be done:**
1. See how much money is owed to me / by me at a glance.
2. Add a new loan in under 30 seconds.
3. Find a specific borrower fast.
4. Mark a payment as received the day it lands.
5. See what's overdue and what's coming up.

---

## 2. Brand System

### Palette (exact hex — use these, don't swap)

| Token       | Hex       | Usage                                                       |
|-------------|-----------|-------------------------------------------------------------|
| `navy`      | `#1a1a2e` | Primary headers, dark hero blocks, primary text on light bg |
| `teal`      | `#16a085` | Primary action buttons, links, focus rings, active nav      |
| `paid`      | `#27ae60` | Paid / success / completed                                  |
| `overdue`   | `#e74c3c` | Overdue, destructive (delete), error                        |
| `credit`    | `#c0392b` | Credit accent (warm red — money going OUT)                  |
| `debit`     | `#27ae60` | Debit accent (cool green — money coming IN)                 |
| `muted`     | `#7f8c8d` | Secondary text, placeholders, icons in resting state        |
| `surface`   | `#f5f6fa` | App background canvas                                       |
| `white`     | `#ffffff` | Cards, modals, inputs                                       |
| `text`      | `#2c3e50` | Body text                                                   |
| `border`    | `#e5e7eb` | Hairline borders on cards & inputs                          |
| `red-50`    | `#fef2f2` | Overdue alert background                                    |

### Typography

- **Family:** Inter (or system equivalent: -apple-system, "Segoe UI", Roboto).
- **Numbers:** Use `font-feature-settings: "tnum"` so currency columns align.
- **Scale:** 12 / 13 / 14 / 16 / 18 / 22 / 28 / 36 px. Headlines bold (700), section titles semibold (600), body regular (400), labels medium (500).

### Shape & Depth

- **Corner radius:** Cards 12px, buttons 10px, modals 20px, pill badges full.
- **Shadow:** Cards use a single hairline border (`#e5e7eb`) plus very soft shadow `0 1px 2px rgba(0,0,0,0.04)`. No heavy drop shadows.
- **Spacing scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 px. Outer page padding is 32px on desktop, 16px on mobile.

### Currency

- All money rendered as **Indian Rupees** in the Indian numbering system: `₹1,00,000.00`. (Equivalent of `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.)
- Tabular numerals — never let columns of currency drift.

### Iconography

- Outline icons (Heroicons / Ionicons outline). No emoji. Consistent stroke width.
- Icon size: 16px inline, 20px in stat tiles, 24px in nav, 56–64px in empty states.

### Tone of voice

- Crisp, neutral, no exclamation marks. Labels like "You owe", "Owed to you", "Overdue", "Upcoming (next 30 days)".

---

## 3. App Shell (Desktop Layout)

A two-column layout fills the viewport.

```
┌─────────────────────────────────────────────────────────────────────┐
│  TopBar  (logo • search • +Add Loan • avatar/menu)            64px  │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                      │
│   Sidebar    │                                                      │
│   240px      │            Main Content (max-width 1200px,           │
│              │            centered, surface background)             │
│   (nav)      │                                                      │
│              │                                                      │
│              │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

### TopBar (sticky, white, 64px tall, hairline bottom border)

- **Left:** App logo (a teal wallet glyph) + wordmark "LoanTracker" in navy.
- **Center:** A large search input ("Search by name or phone…") with a search icon prefix. On focus, opens a results dropdown that mirrors the mobile `LoanSearchSheet` results (described in §6).
- **Right:** A primary teal **+ Add Loan** button (split button: clicking the caret reveals "Add Credit" and "Add Debit"). Avatar circle with initials, click for a menu (Settings, Logout).

### Sidebar (240px, white, hairline right border)

Vertical nav with these items, each a row with a 20px icon + label, 12px vertical padding, full-width hover state in `surface`, active state with a teal left border (3px) and `teal/10` background and teal label:

1. **Dashboard** (icon: bar-chart) — default landing.
2. **Credit** (icon: arrow-down-circle) — loans the user TOOK.
3. **Debit** (icon: arrow-up-circle) — loans the user GAVE.
4. **Settings** (icon: cog) — bottom-pinned, separated by a divider.

A "Logout" link sits below Settings, in `muted`.

### Responsive

- **Tablet (768–1023px):** Collapse sidebar to a 64px icon rail with tooltips.
- **Mobile (≤767px):** Hide the sidebar; replace with a bottom tab bar (Dashboard / Credit / Debit / Settings). The TopBar shrinks and the search becomes a search icon that expands.

---

## 4. Screens

For every screen below, generate the desktop view first and a mobile variant.

### 4.1 Welcome / Marketing Landing (`/welcome`)

Shown to logged-out users. Single-column, centered, max-width 720px.

- **Hero:** A large teal circular badge (96px) with a wallet icon, then a 36px navy headline "LoanTracker", then a muted 16px subtitle: "The simple way to manage every rupee you've lent or borrowed."
- **Tagline card:** A navy `#1a1a2e` rounded-2xl card. White headline "Built for money lenders & borrowers." White/80 body text below: "Whether you're juggling a dozen monthly EMIs or keeping tabs on friends and family, LoanTracker keeps your numbers tidy and your reminders on time."
- **Feature grid (2 columns on desktop, 1 on mobile):**
  1. **Credit & Debit, side by side** — icon: swap-horizontal. "Track loans you've taken and loans you've given in one place — no spreadsheets required."
  2. **Never miss a due date** — icon: bell. "Email & in-app reminders nudge you a day before each due date."
  3. **Auto interest & schedule** — icon: calculator. "Enter the principal, rate, and tenure — we generate the full payment plan for you."
  4. **PIN-locked & private** — icon: shield-check. "Your data is encrypted in transit, stored securely, and gated behind an optional 4-digit PIN."

  Each feature card: white, 1px border `#e5e7eb`, 16px padding, a teal/10 rounded-lg square holding the teal icon, then bold navy 14px title, muted 13px description.

- **CTAs:** A full-width teal **Sign In** button, then an outlined teal **Create Account** button below. Below those: muted micro-copy: "By continuing, you agree to keep your loan records accurate and private. No payments are processed through this app."

### 4.2 Sign In (`/login`) and Register (`/register`)

Centered card, 420px wide, white, radius 16, padding 32.

- Title (navy, 22px, semibold): "Welcome back" / "Create your account".
- Subtitle (muted, 14px): "Sign in to continue to LoanTracker." / "It only takes a minute."
- Stacked text inputs:
  - Email (label + input). 
  - Password (label + input + show/hide toggle).
  - Register only: Confirm password.
- Primary teal full-width button: "Sign In" / "Create Account".
- Below: small muted link to switch between login ↔ register.
- An optional "Forgot password?" link aligned right under the password field on login.

Inputs: 44px tall, 1px `#e5e7eb` border, 10px radius, white bg. Focus state: teal border + 2px teal ring.

### 4.3 PIN Lock (`/pin`)

Shown after login if a PIN is set, and again on every fresh tab open.

- Centered. Padlock icon in a teal/10 circle. "Enter your PIN" headline. Muted helper "4-digit PIN to unlock your dashboard."
- 4 individual square boxes, 56×56, gap 12, white with teal border on focus. As digits are entered the box fills with a small navy filled circle (don't show the digit).
- Below: muted "Forgot PIN?" link → triggers a re-login flow.

### 4.4 Dashboard (`/`) — **the most important screen**

This is the daily landing. The structure must follow the mobile dashboard exactly, just expanded for desktop.

**Header row:**
- Page title "Dashboard" (28px, navy, bold) on the left.
- A pill **segmented selector** on the right with two options: **Credit** | **Debit**. Default is unselected — show an empty state until the user picks.
  - Selector style: white pill container with 6px padding, two equal segments. Selected segment fills with the type's accent color (`credit` red for Credit, `debit` green for Debit), white text, semibold; unselected is transparent with navy text.

**Empty state (no segment selected):**
- Centered: a teal/10 circular badge with a bar-chart icon, "Choose a category" semibold navy 18px, muted 14px subtitle "Pick Credit or Debit above to see a summary of your loans."

**When a segment is selected, show:**

1. **Hero card** — full-width, rounded-2xl, padding 24, background = the selected segment's accent color (`#c0392b` for Credit, `#27ae60` for Debit), text white.
   - Tiny eyebrow label (white/80, 13px): "You owe" if Credit, "Owed to you" if Debit.
   - Huge number (white, 36px, bold): the total `remaining_amount`. Example `₹3,42,500.00`.
   - Below (white/80, 12px): `across 7 active loans · 2 completed`.

2. **Stats grid** — 4 columns on desktop, 2 on mobile. Each tile:
   - White card, hairline border, 16px padding.
   - Top: small teal icon (cash, trending-up, check-done, wallet).
   - Mid: muted 12px label.
   - Bottom: bold navy 16px currency value.
   - Tiles in order: **Total Principal**, **Total Interest**, **Paid Off** (Credit) / **Received** (Debit), **Total Repayable**.

3. **Loan Health card** — white, rounded-xl, padding 16. Title "Loan Health" (semibold, navy 14px). A row of three stacked count chips spaced evenly:
   - **Active** count in `teal`.
   - **Completed** count in `paid` green.
   - **Overdue** count in `overdue` red.
   - Each chip: a 24px bold number stacked over a 12px muted label, centered.

4. **Overdue alert banner** (only render if overdue count > 0) — full-width, `red-50` background, 1px `overdue` border, rounded-xl, padding 16, flex row.
   - Left: red alert-circle icon (24px).
   - Body: bold red `{n} overdue payment(s)`. Below it, smaller red `₹X past due`.

5. **Upcoming (next 30 days)** — white card, padding 16. Title row "Upcoming (next 30 days)" (semibold navy 14px) on the left, "View all" link on the right (teal). Then a list of up to 5 rows. Each row:
   - Left: bold navy person name; below it, muted 12px `Due 14 May 2026`.
   - Right: bold currency in the segment's accent color.
   - Hairline divider between rows. Whole row is a clickable link to the loan detail.
   - If list is empty: centered icon + muted text "No payments due in the next 30 days".
   - If more than 5: muted footer `+N more` link.

**Layout note:** On desktop, render the Hero (full width) on top, then a 12-column grid. Stats grid takes 8 columns, Loan Health takes 4 columns to its right, both same row. Overdue banner spans full width. Upcoming list spans full width.

### 4.5 Credit (`/credit`) and Debit (`/debit`)

These two pages are structurally identical; only the accent color and labels differ.

**Header row:**
- Page title "Credit Loans" / "Debit Loans" (28px, navy, bold).
- Right-aligned: a small toggle/sort group (e.g. "All / Active / Overdue / Completed") and a "+ New Credit" / "+ New Debit" primary button using the segment accent color.

**Search & filter bar (sticky, below header):**
- A wide search input (icon prefix, placeholder "Search by name or phone").
- A "Sort: Recent / Amount / Due Date" dropdown.
- A "Status: All / Active / Overdue / Completed" dropdown.

**Body — a grid of LoanCards** (3 columns on desktop ≥1280px, 2 columns ≥768px, 1 column on mobile):

**LoanCard** — white, rounded-xl, hairline border, padding 16, hover lifts shadow slightly.
- **Header row:** person name (navy, 16px, semibold) with a tiny teal phone icon next to it (clicking opens `tel:`). On the right, a status pill: Active = teal, Completed = paid green, Overdue = overdue red. Pill text is white, 11px, semibold, capitalized.
- **Three-column financial detail row** (each a label/value pair):
  - "Principal" → `₹50,000.00`
  - "Rate" → `10% / mo`
  - "Total Due" → `₹65,000.00`
  Labels are muted 11px, values are navy 13px medium.
- **Progress bar:** a 8px tall rounded `surface`-colored track with a `paid` green fill. If the loan is overdue, the fill is `overdue` red. Above the bar, a row with muted "Remaining" label on the left and the remaining amount on the right.
- **Footer:** muted 12px `Next due: 14 May 2026`.
- **Card actions on hover (desktop):** a tiny floating row at top-right with two icon buttons — pencil (edit, teal) and trash (delete, overdue). Mobile shows these inline at the bottom.

**Empty state (no loans):**
- Centered, illustrative folder-open icon in muted, "No credit loans yet" / "No debit loans yet" headline, then a primary "+ Add your first loan" button.

### 4.6 Loan Detail (`/loan/:id`)

A two-column layout on desktop:

**Left column (8 cols) — Loan Info Card** (white, rounded-xl, padding 24):
- Top row: person name (navy, 22px, bold) + a credit/debit type pill (uses accent color).
- Phone (muted, 14px) under the name, click to call.
- 3×2 stat grid (label + value pairs): Principal, Monthly Rate, Total Repayable, Payment Month (e.g. `2 Months`), Start Date, Due Date.
- Progress bar with a "Paid: ₹X" label on left and "Remaining: ₹Y" on right.
- Notes section, separated by a top divider, only if notes exist.
- Two buttons under the card, side by side, equal width: **Edit** (teal, pencil icon) and **Delete** (overdue red, trash icon).

**Right column (4 cols) — Repayment Schedule:**
- Section title "Repayment" (navy, 18px, semibold).
- A vertical list of `PaymentRow`s. Each row is a white card with a left status indicator stripe (4px wide, full height, color = paid/teal/overdue):
  - Left block: installment number and `Due 14 May 2026` (muted 12px).
  - Center: amount (navy, 16px, semibold).
  - Right: a status pill (Paid ✓ / Upcoming / Overdue) and an action button.
- **Action button rules** (critical — match the mobile app exactly):
  - If `is_paid === true` → show a small "Mark Unpaid" outline button (admin / mistake correction).
  - If `is_paid === false` AND `due_date` is **today or in the past** → show a primary teal **"Mark as Paid"** button.
  - If `is_paid === false` AND `due_date` is in the future → show **no action button**, only a muted "Upcoming" pill.

**Mobile:** Stack right column under the left column.

### 4.7 Add Loan (`/loan/add?type=credit|debit`)

Centered card layout, 720px max-width.

- Top: a small pill at the top-left of the card showing `Credit (Taken)` (red bg) or `Debit (Given)` (green bg), white text.
- Form fields, full-width, vertically stacked, 16px gap. Each field: 14px medium navy label above, then the input.
  1. **Person Name** — required.
  2. **Phone Number (optional)** — phone keypad on mobile.
  3. **Principal Amount (₹)** — numeric, placeholder "e.g. 50000".
  4. **Monthly Interest Rate (%)** — numeric, placeholder "e.g. 10".
  5. **Payment Month** — a row of 3 large segmented options: **1 Month**, **2 Months**, **3 Months**. Selected one fills with teal, white text. (No free input — only these three.)
  6. **Notes (optional)** — multiline textarea, 3 rows.
- **Live "Loan Summary" preview card** — appears below the fields once Principal, Rate, and Months are filled. White card, hairline border, padding 16. Shows three rows:
  - "Total Interest" → currency.
  - "Total Repayable" → bold teal currency, 16px.
  - "Due on" → date.
- **Error banner:** red `red-50` bg, overdue border, only when the API errors.
- **Primary submit:** full-width teal "Add Loan" button. Disabled state shows a spinner.

### 4.8 Edit Loan (`/loan/edit/:id`)

Same form as Add Loan, pre-filled. The CTA reads "Save Changes". Add a discreet "Delete this loan" link in red below the form.

### 4.9 Settings (`/settings`)

Single-column, max-width 720px, sectioned.

- **Section: Profile** — show email (read-only), name input, save button.
- **Section: Security**
  - PIN: a row showing "PIN Lock" with a switch on the right. When ON, two buttons: "Change PIN" and "Remove PIN". Clicking either opens a 4-digit PIN entry dialog (same as §4.3 box style).
  - Sign out everywhere link (red).
- **Section: Notifications**
  - Toggle: "Enable reminders" (on/off).
  - Number stepper: "Remind me X days before due date" (default 1, 1–7 range).
- **Section: Danger zone** (red header)
  - "Delete account" outlined-red button. Opens a confirmation modal.

### 4.10 Search (global, top bar)

When the user clicks the top-bar search input, expand a dropdown panel directly below it (560px wide, max-height 480px, scrollable):

- A subtle tab strip at the top: **All / Credit / Debit**.
- Below: a list of loan rows. Each row:
  - Left: bold navy person name; below, muted 12px phone (if present).
  - Right: if loan is completed, show a paid-green check + "Completed" pill, with muted "Paid off" beneath; otherwise, the remaining amount in the type's accent color, with muted "remaining" beneath.
- Empty states: a folder icon + "No matches found" or "No loans yet".
- Clicking a row navigates to `/loan/:id` and closes the dropdown.

This corresponds to the mobile `LoanSearchSheet` modal.

---

## 5. Reusable Components — naming + spec

Generate these as a small component library so all screens stay consistent.

| Component         | Purpose                                                     | Notes                                                                |
|-------------------|-------------------------------------------------------------|----------------------------------------------------------------------|
| `TopBar`          | Sticky top navigation                                       | Logo, global search, + Add Loan button, avatar menu                 |
| `Sidebar`         | Persistent left navigation                                  | 240px, collapses to icon rail on tablet                              |
| `BottomTabs`      | Mobile-only navigation                                      | 4 tabs                                                               |
| `SegmentedToggle` | Two-segment Credit/Debit selector used on dashboard         | Accent color comes from selected segment                             |
| `StatCard`        | Tile with icon + label + value                              | 1/4 width on desktop, 1/2 on mobile                                  |
| `CountChip`       | Stacked big number + small label                            | Color-coded                                                          |
| `LoanCard`        | Card in Credit/Debit grid                                   | Header, 3-col details, progress bar, footer due date                 |
| `StatusPill`      | Active / Completed / Overdue / Paid pill                    | Color from palette; 11px white text, capitalized                     |
| `ProgressBar`     | 8px height rounded bar                                      | `paid` green fill normally; `overdue` red fill when overdue          |
| `PaymentRow`      | Single row in the repayment list                            | Status stripe, amount, status pill, action button                    |
| `PrimaryButton`   | Teal solid button                                           | 44px tall, 10px radius, semibold white                               |
| `DestructiveButton` | Overdue-red solid button                                  | Same shape                                                           |
| `OutlineButton`   | Teal border, teal text                                      | Used for secondary actions                                           |
| `Input`           | Standard text input                                         | 44px, hairline border, teal focus ring                               |
| `Textarea`        | Multiline input                                             | 88px min-height                                                      |
| `EmptyState`      | Icon + title + subtitle + optional CTA                      | Centered                                                             |
| `Modal`           | Centered dialog                                             | 480px width, white, rounded-2xl, backdrop = `rgba(0,0,0,0.6)`        |
| `ConfirmDialog`   | Modal variant for destructive confirms                      | Title, body, Cancel + Confirm-red button                             |
| `Toast`           | Top-right transient notification                            | Used for "Payment marked as paid", "Loan deleted", etc.              |
| `SearchDropdown`  | Top-bar search results panel                                | Tabs + scrollable list                                               |
| `PinInput`        | 4-digit boxed PIN entry                                     | Filled-circle dot when entered; teal focus border                    |

---

## 6. Key Interactions to Show in the Design

These are interaction states that should be illustrated (with hover / active / disabled variants):

1. **Segmented selector** on Dashboard — show both unselected and Credit-selected variants.
2. **LoanCard** — show Active, Completed, and Overdue variants side by side.
3. **PaymentRow** — show Paid, Upcoming-future (no button), and Overdue (with Mark as Paid) variants stacked.
4. **Add Loan form** — show the live "Loan Summary" preview card filled out.
5. **Search dropdown** — show with results and with "No matches found".
6. **Confirm dialog** for "Delete loan?" — red Confirm, gray Cancel.
7. **Toast** — green success "Payment marked as paid" sliding in top-right.

---

## 7. Behavior to Visually Communicate

Even though Stitch generates static designs, these behaviors should be obvious from the visual hierarchy and copy:

- **Credit = money the user owes** (warm red `#c0392b`). All Credit accents and pills use this color.
- **Debit = money owed to the user** (green `#27ae60`). All Debit accents and pills use this color.
- **The loan amount displayed in dashboards is the bullet repayment total** (principal + monthly rate × tenure × principal / 100). Don't compute monthly EMIs — the app uses lump-sum bullet payments at end of tenure (1, 2, or 3 months).
- **Mark as Paid button is only available for due/overdue payments** — never for future ones. Future payments visually look "locked" (no action button, just a muted "Upcoming" pill).
- **No payment processing happens in-app.** This is a ledger only. Don't add any "Pay Now", "Send Money", "Bank link" affordances anywhere.

---

## 8. Sample Data (use this exact data in the mockups so screens feel real)

Use these names/numbers across all screens so the design feels populated and consistent:

**Credit loans (user owes):**
- Ramesh Iyer — ₹2,00,000 principal — 8% / mo — 3 months — Active — next due 12 Jun 2026 — paid ₹0.
- Priya Sharma — ₹50,000 principal — 10% / mo — 1 month — Overdue — due 28 Apr 2026 — paid ₹0.
- Arjun Mehta — ₹1,50,000 principal — 12% / mo — 2 months — Completed — paid ₹1,86,000.

**Debit loans (user is owed):**
- Sunita Verma — ₹75,000 principal — 9% / mo — 2 months — Active — next due 20 May 2026.
- Karan Gupta — ₹30,000 principal — 15% / mo — 1 month — Overdue — due 25 Apr 2026.
- Anjali Rao — ₹1,20,000 principal — 10% / mo — 3 months — Active — next due 05 Jul 2026.
- Mohit Saxena — ₹60,000 principal — 8% / mo — 1 month — Completed — paid ₹64,800.

**Dashboard summary numbers (when "Debit" is selected):**
- Total remaining: ₹3,42,500.00
- Active loans: 3, Completed: 1, Overdue: 1
- Total Principal: ₹2,85,000.00
- Total Interest: ₹61,500.00
- Received: ₹64,800.00
- Total Repayable: ₹3,46,500.00

**Upcoming (next 30 days), Debit:**
- Sunita Verma — Due 20 May 2026 — ₹88,500.00
- Anjali Rao — Due 05 Jul 2026 — (filtered out, beyond 30 days, don't show)
- Karan Gupta — overdue (shown in overdue alert, not in upcoming)

---

## 9. What NOT to Design

- No payment gateway, no "Send Money", no bank linking UI.
- No social login buttons (Google, Apple). Email + password only.
- No chat / messaging / notes-on-borrower.
- No multi-currency picker — INR only.
- No exports, PDF, or print views (out of scope for v1).
- No dark mode (light mode only for v1).

---

## 10. Deliverable Expectations from Stitch

Generate, in this order:
1. Welcome / marketing landing page.
2. Sign In + Register screens.
3. PIN Lock screen.
4. Dashboard — empty state, then with Credit selected, then with Debit selected.
5. Credit list page.
6. Debit list page.
7. Loan Detail page.
8. Add Loan form (with live preview filled).
9. Edit Loan form.
10. Settings page.
11. Global search dropdown (open state).
12. Component sheet showing all reusable components in their variants.

For each screen, also produce a mobile (≤480px) variant.

---

**End of brief.** When in doubt, prefer simpler, more financial-tool-like layouts over decorative ones. The user ships volume — clarity beats cleverness.
