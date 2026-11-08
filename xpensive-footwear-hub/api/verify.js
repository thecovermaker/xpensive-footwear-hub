module.exports=async(req,res)=>{
  const ref=String(req.query.reference||'');
  if(!/^[\w.=-]+$/.test(ref))return res.status(400).json({ok:false});
  try{
    const r=await fetch('https://api.paystack.co/transaction/verify/'+ref,{headers:{Authorization:'Bearer '+process.env.PAYSTACK_SECRET_KEY}});
    const d=await r.json();
    res.json({ok:!!(d.status&&d.data&&d.data.status==='success'),amount:d.data&&d.data.amount});
  }catch(e){res.status(500).json({ok:false})}
};
