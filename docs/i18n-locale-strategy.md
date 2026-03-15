# i18n Locale Strategy: Cookie-based with Query Override

**Decision date:** 2026-03-16
**Decision:** Stay with cookie-based locale (`locale` cookie) but support `?hl=` query override and `hreflang` for SEO indexing.

---

## Current implementation

- Locale stored in a `locale` cookie (1-year expiry).
- **SEO Support:** The `src/proxy.ts` interceptor detects `?hl=th` (or `?hl=en`) to set the cookie and inject an `x-locale` header.
- `next-intl` reads the header/cookie server-side in `src/i18n/request.ts`.
- `hreflang` tags in `layout.tsx` point to both versions.
- Dynamic `sitemap.ts` includes both English and Thai (`?hl=th`) URLs.

---

## Why this works for SEO

Google's crawler now sees both versions:
- `https://www.corgiplanningpoker.com` -> English
- `https://www.corgiplanningpoker.com?hl=th` -> Thai

Both are correctly tagged with `hreflang` and listed in the sitemap, enabling Thai content to be indexed without the overhead of folder-based (`/en/`, `/th/`) restructuring.
