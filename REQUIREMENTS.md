# Mina Hasan — Website Requirements

**Brand:** Mina Hasan (same brand)  
**Reference:** [minahasan.com](https://minahasan.com/)  
**Stack:** Next.js (App Router) + **Supabase only** (Postgres + Storage) + Tailwind CSS  
**Pricing model:** No public prices — **Get Quote** on every product  
**Document status:** Locked for build (Supabase-only)  
**Updated:** 6 August 2026

---

## 1. Locked decisions

| Decision | Choice |
|----------|--------|
| Brand name | Mina Hasan |
| Tech stack | Next.js + Supabase (no Prisma) |
| Database | Supabase Postgres via `@supabase/supabase-js` |
| Images | Supabase Storage (`products` bucket) |
| Pricing | Never show prices |
| Product CTA | **Get Quote** on every product |
| Quote flow | User fills form → saved in DB → **also opens WhatsApp** with prefilled message |
| Categories | Hierarchical (see §3) |
| Admin | Full panel for products, categories, quotes, track orders |
| Static/info pages | All listed in §5 |

---

## 2. Product conversion — Get Quote

On every product card and product detail page:

1. User clicks **Get Quote**
2. Modal/page form opens (product pre-attached)
3. On submit:
   - Save quote to database (admin can view)
   - Open WhatsApp chat to brand number with a prefilled message including name, contact, product, and notes
4. Show success confirmation on site

**No cart, checkout, or public prices.**

---

## 3. Category taxonomy

```
Events
├── Mehndi
├── Barat
├── Walima
└── Mayio
Formal
Western
Unstitched
```

- Categories are **manageable in admin** (add / edit / delete / reorder / nest).
- Seed the above as default structure; admin can change later.
- Products belong to one or more categories.

---

## 4. Admin panel (`/admin`)

| Module | Capabilities |
|--------|--------------|
| Products | Create, edit, delete; images; description; fabrics; delivery timeline; category assignment; featured / new flags; publish status |
| Categories | Create, edit, delete; parent/child; slug; sort order; visibility |
| Get Quote | List submissions; view detail; mark status (new / contacted / closed); filter/search |
| Track Order | Create/update/delete tracking records (order #, customer, status, timeline notes); public lookup by order # |
| Newsletter | View subscribers (signups from footer/page) |
| Auth | Protected admin login |

---

## 5. Public pages

| Page | Route (suggested) |
|------|-------------------|
| Home | `/` |
| Collection / category | `/collections/[slug]` |
| Product detail | `/products/[slug]` |
| About Us | `/about` |
| Contact Us | `/contact` |
| Privacy Policy | `/privacy-policy` |
| Terms & Conditions | `/terms-and-conditions` |
| Return/Exchange Policy | `/return-exchange-policy` |
| Shipping & Handling | `/shipping-and-handling` |
| FAQs | `/faqs` |
| Track Order | `/track-order` |
| Newsletter (footer + optional page) | Footer form (+ `/newsletter` if needed) |

---

## 6. Get Quote form fields

| Field | Required |
|-------|----------|
| Full name | Yes |
| Email | Yes |
| Phone / WhatsApp | Yes |
| Country / City | Preferred |
| Event date | Preferred |
| Occasion / category interest | No |
| Product (auto from PDP) | Auto |
| Size / custom note | No |
| Message | No |

---

## 7. Track Order

**Public:** Customer enters order number → sees status & updates.  
**Admin:** Manage orders/tracking entries (number, customer info, status enum, notes, last updated).

Statuses (suggested): `Received` · `In Production` · `Quality Check` · `Shipped` · `Delivered` · `On Hold`

---

## 8. Out of scope (MVP)

- Payment gateway / shopping cart  
- Multi-currency pricing UI  
- Customer accounts (beyond track-by-order-number)

---

## 9. Reference analysis

See prior draft sections for Mina Hasan UX patterns (hero, gallery PDP, size guide, WhatsApp float, newsletter, luxury visual language). Design should feel comparable: photography-led, minimal chrome, serif brand lockup.

---

## 10. Acceptance criteria

- [ ] Next.js app with public storefront + `/admin`
- [ ] No prices anywhere on public site
- [ ] Get Quote saves to DB and opens WhatsApp with message
- [ ] Categories seed + admin CRUD (Events children + Formal / Western / Unstitched)
- [ ] Products admin CRUD
- [ ] Quotes list in admin
- [ ] Track Order public + admin management
- [ ] All info/policy pages live
- [ ] Newsletter signup stores emails
