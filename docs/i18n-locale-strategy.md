# i18n Locale Strategy: Cookie-based vs URL-path-based

**Decision date:** 2026-03-15
**Decision:** Stay with cookie-based locale (`locale` cookie) — do NOT migrate to URL-based paths (`/en/`, `/th/`)

---

## Current implementation

- Locale stored in a `locale` cookie (1-year expiry)
- `next-intl` reads the cookie server-side via `getLocale()` in `src/i18n/request.ts`
- `LanguageSwitcher` calls `setLocale()` server action + `router.refresh()` to apply the change
- The `<html lang={locale}>` attribute is set correctly on every server render

---

## Why NOT URL-based paths right now

### The core SEO fact

Google's crawler ignores cookies. It crawls every URL as a fresh visitor with no cookie set, so it always sees the English version. Thai content at the same URL is invisible to search engines.

With URL-based paths (`/en/scrum-poker`, `/th/scrum-poker`):
- Both language versions are separately indexed by Google
- `hreflang` tags work correctly (they require different URLs per language)
- Shareable links carry the correct language
- Sitemap can include both versions

### Why it doesn't matter for this project (yet)

| Factor | Assessment |
|---|---|
| Target keywords | "planning poker", "planning poker online", "free planning poker" — all **English** |
| Thai search volume for these terms | Very low — Thai users searching for this tool typically use English terms |
| Thai translation purpose | UX enhancement for existing users, **not** a strategy to rank in Thai search |
| Migration cost | Very high — restructure entire `app/` directory into `app/[locale]/`, update all `Link` hrefs, rewrite middleware, update sitemap, update all canonical URLs |
| SEO gain from Thai indexing | Marginal for this product's current goals |

The Thai i18n is a **user experience feature**, not an SEO play. The site's SEO strategy targets English keywords, and those pages are fully server-rendered with proper metadata.

---

## When to upgrade to URL-based locales

Migrate to `app/[locale]/` only if:

1. You decide to actively target **Thai-language organic search traffic** (e.g., blog posts written in Thai optimized for Thai queries)
2. You run **Thai Google Ads** and need a dedicated Thai landing page URL
3. Thai users become a significant enough segment to warrant separate sitemap entries and `hreflang` signals

---

## Current SEO correctness

Even with cookie-based locale, the English SEO is correct:
- `<html lang="en">` is set server-side via `getLocale()` — Google sees the correct language tag
- Every page exports its own `metadata` with `title`, `description`, and `canonical` URL
- No `hreflang` tags are needed (only one indexable URL per page)
