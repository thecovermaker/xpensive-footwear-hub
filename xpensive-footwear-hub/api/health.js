// Reports only whether the Paystack key on this deployment is live/test/missing (no secrets).
module.exports=(req,res)=>{
  const k=process.env.PAYSTACK_SECRET_KEY||'';
  res.json({paystack:k.startsWith('sk_live_')?'live':k.startsWith('sk_test_')?'test':k?'unknown':'missing'});
};
