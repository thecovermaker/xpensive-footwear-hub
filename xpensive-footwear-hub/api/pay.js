const crypto=require('crypto'),D=require('../products.json');
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).end();
  try{
    const{items,ship,country,c}=req.body||{};
    if(!Array.isArray(items)||!items.length||!c||!/^\S+@\S+\.\S+$/.test(c.email||''))return res.status(400).json({error:'Invalid order'});
    let sub=0,lines=[];
    for(const i of items){
      const p=D.p.find(x=>x[0]==i.id),q=Math.min(20,parseInt(i.q)||0);
      if(!p||q<1)return res.status(400).json({error:'Invalid item'});
      sub+=(p[3]+(i.fs?D.fs:0))*q;
      lines.push(`${p[1]} | EU ${String(i.sz).slice(0,3)} | ${i.fs?'Foreign sole':'Local sole'} | x${q}`);
    }
    const fee=D.ship[country==='Nigeria'?'NG':'INT'][ship==='exp'?1:0];
    const ref='XFH-'+crypto.randomBytes(4).toString('hex').toUpperCase();
    const f=(n,v)=>({display_name:n,variable_name:n.toLowerCase().replace(/\W/g,'_'),value:String(v||'').slice(0,250)});
    const r=await fetch('https://api.paystack.co/transaction/initialize',{
      method:'POST',
      headers:{Authorization:'Bearer '+process.env.PAYSTACK_SECRET_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({email:c.email,amount:(sub+fee)*100,currency:'NGN',reference:ref,
        callback_url:`https://${req.headers.host}/paid.html`,
        metadata:{custom_fields:[f('Name',c.name),f('Phone',c.phone),f('Country',country),f('Address',c.addr+', '+c.city),f('Shipping',ship),f('Items',lines.join(' ; '))]}})
    });
    const d=await r.json();
    if(!d.status)return res.status(502).json({error:d.message});
    res.json({url:d.data.authorization_url});
  }catch(e){res.status(500).json({error:'Server error'})}
};
