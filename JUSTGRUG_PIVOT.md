# Grug Pivot — Progress Tracker

## Overview
Pivoted from **GiftGrug** (gift-focused) → **JustGrug** (lifestyle helper) → **Grug** (simplified brand).
Keeping: brand voice, cave theme, design system, Grug character.
Built: AI chat, newsletter signup, merch-only store, broader lifestyle content.
Focus: modern, functional UX — less caveman gimmickry, more intentional design.

---

## Monetisation
| Channel | Provider | Status |
|---|---|---|
| Own products (sticks, rocks, gimmicks) | Stripe (Pay by Bank) | Awaiting API setup |
| Merch (t-shirts etc) | Print-on-demand (TBD) | Provider not chosen |
| Affiliate products | Amazon Associates UK (giftgrug-21) | In blog/newsletter only |
| Newsletter | Beehiiv | Awaiting setup |
| Transactional emails | Brevo | Existing ✅ |
| Ads | Google AdSense + Ezoic | Existing ✅ |

---

## Environment Variables
| Variable | Purpose | Status |
|---|---|---|
| `OPENAI_API_KEY` | Talk to Grug AI chat | ✅ Set |
| `OPENAI_MODEL` | Model override (default: gpt-5-mini-2025-08-07) | ✅ Set |
| `BEEHIIV_PUBLICATION_ID` | Newsletter embed/API | ❌ Needed |
| `STRIPE_SECRET_KEY` | Merch checkout | ❌ Needed |
| `STRIPE_PUBLISHABLE_KEY` | Merch checkout (client) | ❌ Needed |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | ✅ Exists |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | ✅ Exists |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin (rate limiting, usage tracking) | ✅ Set (dev + prod) |
| `BREVO_API_KEY` | Transactional email | ✅ Exists |

---

## Implementation Phases

### Phase 1: Initial Branding Pass (GiftGrug → JustGrug) ✅
| File | Change | Status |
|---|---|---|
| `src/app/layout.tsx` | SEO metadata, title, description, OG, structured data | ✅ |
| `src/components/Header.tsx` | Brand name, added Talk to Grug nav link | ✅ |
| `src/components/Footer.tsx` | Brand name, tagline, copyright | ✅ |
| `src/app/not-found.tsx` | Updated CTA to link to /talk | ✅ |
| `src/app/about/page.tsx` | Rewritten — broader lifestyle messaging | ✅ |
| `src/app/hunt/layout.tsx` | Updated metadata | ✅ |
| `src/app/panic/layout.tsx` | Updated metadata | ✅ |
| `src/app/legal/affiliate/*` | Updated brand references | ✅ |
| `src/app/legal/privacy/*` | Updated brand references | ✅ |

### Phase 2: Dictionary Rewrite ✅
| File | Change | Status |
|---|---|---|
| `src/lib/grug-dictionary.ts` | Broadened uiText, added `huntText`, `chatText`, `newsletterText`, new grugQuotes | ✅ |

### Phase 3: Database Migration ✅
| Change | Status |
|---|---|
| Add `product_type` column to products (`merch`, `affiliate`, `own`) | ✅ Applied via Supabase MCP |
| Add `chat_messages` table for analytics/rate limiting | ✅ Applied via Supabase MCP |
| Update `database.types.ts` | ✅ |

### Phase 4: Initial Homepage Redesign ✅
| File | Change | Status |
|---|---|---|
| `src/app/page.tsx` | Hub layout: hero → Talk to Grug → quick links → newsletter | ✅ (superseded by Phase 12) |

### Phase 5: Newsletter Component ✅
| File | Change | Status |
|---|---|---|
| `src/components/NewsletterSignup.tsx` | 3 variants (full, inline, compact), Beehiiv placeholder | ✅ |

### Phase 6: Talk to Grug (AI Chat) ✅
| File | Change | Status |
|---|---|---|
| `src/app/talk/page.tsx` | Chat page | ✅ |
| `src/app/talk/layout.tsx` | SEO metadata | ✅ |
| `src/app/api/chat/route.ts` | OpenAI streaming SSE API (lazy client init for Vercel build) | ✅ |
| `src/lib/grug-chat.ts` | System prompt, starters, types, session ID generator | ✅ |
| `src/components/GrugChat.tsx` | Chat UI with streaming, conversation starters, free message limit, signup gate | ✅ |

### Phase 7: Hunt Page — Initial 2-Tab Design ✅
| File | Change | Status |
|---|---|---|
| `src/app/hunt/page.tsx` | 2 tabs: store + affiliate | ✅ (superseded by Phase 13) |
| `src/lib/products-db.ts` | Added `getMerchProducts()`, `isPanicProduct` field | ✅ |

### Phase 8: Admin Updates ✅
| File | Change | Status |
|---|---|---|
| `src/components/admin/ProductAdmin.tsx` | Added product_type dropdown (affiliate/merch/own) | ✅ |
| `src/components/admin/BulkProductAdmin.tsx` | Added product_type to BulkRow + insert logic | ✅ |

### Phase 9: Component Updates ✅
| File | Change | Status |
|---|---|---|
| `src/components/index.ts` | Added GrugChat, NewsletterSignup exports | ✅ |
| `src/components/PanicButton.tsx` | Text now "GRUG HELP NOW!" | ✅ |
| `src/components/GrugMascot.tsx` | Added 'chatting' and 'newsletter' situations | ✅ |
| `src/app/sitemap.ts` | Added /talk, /scribbles, /about | ✅ |

### Phase 10: OpenAI Integration ✅
| Change | Status |
|---|---|
| Set OPENAI_API_KEY and OPENAI_MODEL env vars | ✅ |
| Chat route uses env var for model with fallback | ✅ |
| `openai` package already in deps | ✅ |

### Phase 11: Brand Rename (JustGrug → Grug) ✅
| File | Change | Status |
|---|---|---|
| `src/components/Header.tsx` | "JUSTGRUG" → "GRUG" | ✅ |
| `src/components/Footer.tsx` | Simplified: "GRUG" + about/privacy links, removed Amazon disclaimer | ✅ |
| `src/app/layout.tsx` | All metadata: title, description, OG, Twitter, structured data → "Grug" | ✅ |
| `src/app/about/page.tsx` | Metadata + body text → "Grug", removed affiliate transparency section, added Footer | ✅ |
| `src/app/hunt/layout.tsx` | Metadata → "Grug" | ✅ |
| `src/app/talk/layout.tsx` | Metadata → "Grug" | ✅ |
| `src/app/panic/layout.tsx` | Metadata → "Grug" | ✅ |
| `src/app/legal/affiliate/page.tsx` | All "JustGrug" → "Grug" | ✅ |
| `src/app/legal/privacy/page.tsx` | All "JustGrug" → "Grug" | ✅ |

### Phase 12: Homepage Redesign V2 ✅
| File | Change | Status |
|---|---|---|
| `src/app/page.tsx` | Hero: Grug avatar + "Modern Life Hard. Grug Help Make Simple." + dual CTA ("Talk to Grug" / "Join Tribe") → 3 feature sections (Advice, Cool Things, Scribbles) → Newsletter (#tribe anchor) | ✅ |

### Phase 13: Hunt Page Simplification ✅
| File | Change | Status |
|---|---|---|
| `src/app/hunt/page.tsx` | Stripped tabs + affiliate. Simple own-products-only grid. No search/filter. Clean empty state. | ✅ |

### Phase 14: Cave Page Cleanup ✅
| File | Change | Status |
|---|---|---|
| `src/app/cave/page.tsx` | Compact header, todo-list style reminders with checkbox + urgency colors, 2-col add form, removed CavePaintings + gift hunt links | ✅ |

### Phase 15: Styling Updates ✅
| File | Change | Status |
|---|---|---|
| `tailwind.config.ts` | Lightened cave/stone colors | ✅ |
| `src/app/globals.css` | Updated scrollbar colors to match | ✅ |

### Phase 16: AI Chat Rate Limiting ✅
| File | Change | Status |
|---|---|---|
| `src/app/api/chat/route.ts` | Server-side rate limiting: anonymous 5/day (IP hash), signed-in 25/day (user_id), admin unlimited. Supabase service role client for usage tracking. Guards for missing env vars. | ✅ |
| `src/app/api/chat/usage/route.ts` | New GET endpoint returning remaining/limit/used/isAdmin for current user or IP | ✅ |
| `src/components/GrugChat.tsx` | Server-driven remaining count, optimistic decrement, 429 handling, removed client-side counter | ✅ |
| `src/lib/grug-chat.ts` | Added FREE_MESSAGE_LIMIT (5) and SIGNED_IN_MESSAGE_LIMIT (25) constants | ✅ |
| Supabase migration | `chat_usage` table (identifier, identifier_type, message_date, message_count) + `increment_chat_usage` RPC function | ✅ |

### Phase 17: Grug Avatar ✅
| File | Change | Status |
|---|---|---|
| `public/grug_avatar.png` | Custom Grug character illustration (portrait orientation) | ✅ |
| 13 files across src/ | Replaced all 🗿 emoji with `<img src="/grug_avatar.png">` using height-only sizing (`h-X w-auto`) to preserve aspect ratio | ✅ |

### Phase 18: Homepage Polish ✅
| File | Change | Status |
|---|---|---|
| `src/app/page.tsx` | Headline: "Modern Life Hard." (was "Too Complicated"). Removed mascot-glow and mascot-float animations. Tightened hero spacing for mobile and desktop. | ✅ |
| `src/components/GrugChat.tsx` | Removed small Grug avatar from chat message responses (too small to see) | ✅ |

### Bug Fixes ✅
| Fix | Status |
|---|---|
| OpenAI client moved from module-level to inside POST handler (Vercel build fix) | ✅ |
| BulkProductAdmin paste handler missing product_type field | ✅ |
| TypeScript lint errors on Supabase queries fixed with type assertions | ✅ |
| Guard for missing SUPABASE_SERVICE_ROLE_KEY (fail-open in dev) | ✅ |

---

## Issues / Blockers
| Issue | Status | Notes |
|---|---|---|
| Print-on-demand provider not chosen | ⏳ | Hunt page "GET THIS" buttons are placeholder |
| BEEHIIV_PUBLICATION_ID needed | ⏳ | Newsletter form is placeholder |
| Stripe keys needed | ⏳ | Own products checkout placeholder |
| Wishlists migration file has invalid base64url | 🐛 | Pre-existing, fixed in prod, not in file |

---

## Notes
- Affiliate products still in DB but **not shown on Hunt page** — restricted to blog posts and newsletters
- Categories kept in codebase but not used on any page currently
- CavePaintings (wishlists) component still exists but removed from Cave page
- Special Suns restyled as todo-list items with urgency indicators
- Scribbles system unchanged — content topics broadening organically
- Google OAuth still commented out in AuthForm.tsx (pre-existing)
- OPENAI_API_KEY is set and chat is functional
- Grug avatar (`grug_avatar.png`) is portrait-oriented — always use `h-X w-auto` sizing, never square `w-X h-X`
- Rate limiting uses Supabase `chat_usage` table + `increment_chat_usage` RPC. Anonymous users tracked by SHA-256 hashed IP.
- Chat API fails open if `SUPABASE_SERVICE_ROLE_KEY` is missing (allows chat without rate limiting in dev)
