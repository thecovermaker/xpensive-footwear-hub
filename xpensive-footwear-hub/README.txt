DEPLOY ON VERCEL
1. Upload this folder to a GitHub repo and import it in Vercel (or run `vercel` in the folder).
2. In Vercel > Project > Settings > Environment Variables add:
   PAYSTACK_SECRET_KEY = your Paystack secret key (sk_live_... / sk_test_... to test first)
3. Redeploy. Test with a Paystack test key before going live.
Prices, shipping fees and the foreign-sole surcharge live in products.json.
Local testing needs `vercel dev` (the /api payment routes do not run from plain files).
