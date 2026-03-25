# TODO: Fix app/page.tsx and Address 400 Error
Status: In Progress

## 1. Create TODO.md [✅ Completed]

## 2. Fix page.tsx structure (static fixes) [✅ Completed - page renders with fallback, API fixed]
- Connect DataTable to dummyTrendingCoins and columns
- Add rowKey prop
- Dynamic Bitcoin overview from first coin
- Format price cells properly
- Complete Trending Coins and Categories sections
- Fix cell renders (Image alt, Link layout)

## 3. Test static rendering
- Run `npm run dev`
- Verify no TS/console errors, table renders with dummy data

## 4. Investigate 400 Bad Request [✅ Completed]
- Double // in URL from BASE_URL + /endpoint
- Fixed: cleanEndpoint strips leading /

## 5. Test full page [✅ Completed - no errors, page renders perfectly]

## 6. Final test & completion
- Full page working with real data

