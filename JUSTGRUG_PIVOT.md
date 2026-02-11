# JustGrug Pivot — Progress Tracker

## Overview
Pivoting from **GiftGrug** (gift-focused) to **JustGrug** (lifestyle helper with AI chat).
Keeping: brand voice, cave theme, design system, Grug character.
Adding: AI chat, newsletter, merch store, broader lifestyle content.
Domain change to justgrug.com handled separately later.

---

## Monetisation
| Channel | Provider | Status |
|---|---|---|
| Own products (sticks, rocks, gimmicks) | Stripe (Pay by Bank) | Awaiting API setup |
| Merch (t-shirts etc) | Print-on-demand (TBD) | Provider not chosen |
| Affiliate products | Amazon Associates UK (giftgrug-21) | Existing ✅ |
| Newsletter | Beehiiv | Awaiting setup |
| Transactional emails | Brevo | Existing ✅ |
| Ads | Google AdSense + Ezoic | Existing ✅ |

---

## Environment Variables Needed
| Variable | Purpose | Status |
|---|---|---|
| `OPENAI_API_KEY` | Talk to Grug AI chat | ❌ Needed |
| `BEEHIIV_PUBLICATION_ID` | Newsletter embed/API | ❌ Needed |
| `STRIPE_SECRET_KEY` | Merch checkout | ❌ Needed |
| `STRIPE_PUBLISHABLE_KEY` | Merch checkout (client) | ❌ Needed |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | ✅ Exists |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | ✅ Exists |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin | ✅ Exists |
| `BREVO_API_KEY` | Transactional email | ✅ Exists |

---

## Implementation Phases

### Phase 1: Branding Pass ✅
Update all references from GiftGrug → JustGrug. Broaden messaging.

| File | Change | Status |
|---|---|---|
| `src/app/layout.tsx` | SEO metadata, title, description, OG, structured data | ✅ |
| `src/components/Header.tsx` | Brand name JUSTGRUG, added Talk to Grug nav link (MessageCircle icon) | ✅ |
| `src/components/Footer.tsx` | Brand name, tagline, copyright | ✅ |
| `src/app/not-found.tsx` | Updated CTA to link to /talk | ✅ |
| `src/app/about/page.tsx` | Rewritten for JustGrug — broader lifestyle messaging, Talk to Grug CTA | ✅ |
| `src/app/hunt/layout.tsx` | Updated metadata | ✅ |
| `src/app/panic/layout.tsx` | Updated metadata — "GRUG HELP NOW" | ✅ |
| `src/app/legal/affiliate/*` | Updated all GiftGrug → JustGrug | ✅ |
| `src/app/legal/privacy/*` | Updated all GiftGrug → JustGrug | ✅ |

### Phase 2: Dictionary Rewrite ✅
| File | Change | Status |
|---|---|---|
| `src/lib/grug-dictionary.ts` | Broadened uiText, added `huntText`, `chatText`, `newsletterText`, new grugQuotes (chatting, newsletter) | ✅ |

### Phase 3: Database Migration ✅
| Change | Status |
|---|---|
| Add `product_type` column to products (`merch`, `affiliate`, `own`) | ✅ (migration SQL + types) |
| Add `chat_messages` table for analytics/rate limiting | ✅ (migration SQL + types) |
| Update `database.types.ts` | ✅ |
| Migration file: `supabase/migrations/20250211_justgrug_pivot.sql` | ✅ (needs to be run) |

### Phase 4: Homepage Redesign ✅
| File | Change | Status |
|---|---|---|
| `src/app/page.tsx` | New layout: hero → Talk to Grug CTA → quick links (Hunt, Scribbles) → newsletter → pinned scribbles → GRUG HELP NOW | ✅ |

### Phase 5: Newsletter Component ✅
| File | Change | Status |
|---|---|---|
| `src/components/NewsletterSignup.tsx` | CREATE — 3 variants (full, inline, compact), Beehiiv placeholder | ✅ |

### Phase 6: Talk to Grug (AI Chat) ✅
| File | Change | Status |
|---|---|---|
| `src/app/talk/page.tsx` | CREATE — Chat page | ✅ |
| `src/app/talk/layout.tsx` | CREATE — SEO metadata | ✅ |
| `src/app/api/chat/route.ts` | CREATE — OpenAI streaming SSE API (returns 503 until key provided) | ✅ |
| `src/lib/grug-chat.ts` | CREATE — System prompt, starters, types, session ID generator | ✅ |
| `src/components/GrugChat.tsx` | CREATE — Chat UI with streaming, conversation starters, free message limit, signup gate | ✅ |

### Phase 7: Hunt Page — 2-Tab Redesign ✅
| File | Change | Status |
|---|---|---|
| `src/app/hunt/page.tsx` | 2 tabs: "GRUG'S CAVE STORE" (own/merch) + "GRUG HEAR FROM MANY FOLK THIS GOOD" (affiliate) | ✅ |
| `src/lib/products-db.ts` | Added `getMerchProducts()`, `isPanicProduct` field, `getAllProducts` now filters to affiliate only | ✅ |

### Phase 8: Admin Updates ✅
| File | Change | Status |
|---|---|---|
| `src/components/admin/ProductAdmin.tsx` | Added product_type dropdown (affiliate/merch/own) | ✅ |
| `src/components/admin/BulkProductAdmin.tsx` | Added product_type to BulkRow + insert logic | ✅ |

### Phase 9: Component Updates ✅
| File | Change | Status |
|---|---|---|
| `src/components/index.ts` | Added GrugChat, NewsletterSignup exports | ✅ |
| `src/components/PanicButton.tsx` | Text now "GRUG HELP NOW!" (kept /panic link, homepage uses /talk link separately) | ✅ |
| `src/components/GrugMascot.tsx` | Added 'chatting' and 'newsletter' situations | ✅ |
| `src/app/sitemap.ts` | Added /talk, /scribbles, /about; updated category URLs with tab=affiliate | ✅ |

### Phase 10: New Dependencies
| Package | Purpose | Status |
|---|---|---|
| `openai` | Chat API (already in package.json) | ✅ Already installed |
| `ai` (Vercel AI SDK) | Optional streaming enhancement | ⬜ Not needed — used native SSE instead |

---

## Issues / Blockers
| Issue | Status | Notes |
|---|---|---|
| Print-on-demand provider not chosen | ⏳ | Hunt Tab 1 merch links TBD |
| OPENAI_API_KEY needed | ⏳ | Chat will be built but non-functional until provided |
| BEEHIIV_PUBLICATION_ID needed | ⏳ | Newsletter form placeholder until provided |
| Stripe keys needed | ⏳ | Own products checkout placeholder until provided |
| Wishlists migration file has invalid base64url | 🐛 | Pre-existing, not blocking |

---

## Notes
- Categories kept in codebase but demoted from homepage — used on Hunt affiliate tab only
- Cave Paintings (wishlists) unchanged — still works for saving any products
- Special Suns unchanged — works for any reminders
- Scribbles system unchanged — content topics will broaden organically
- Google OAuth still commented out in AuthForm.tsx (pre-existing)
