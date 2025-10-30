// dashboard.js
(function(){
  const session = localStorage.getItem('ifts_session');
  if(!session){ window.location.href = 'index.html'; return; }
  const users = JSON.parse(localStorage.getItem('ifts_users') || '[]');
  const me = users.find(u=>u.email===session) || {name: 'User'};
  const nameEl = document.getElementById('userNameShort');
  if(nameEl) nameEl.textContent = me.name.split(' ')[0];

  const profileKey = `profile_${me.email}`;
  const imgData = localStorage.getItem(profileKey);
  const smallThumb = document.getElementById('profileImgSmall');
  if(smallThumb) smallThumb.src = imgData || 'assets/images/profile-default.svg';

  const assetsKey = 'ifts_assets';
  const txKey = 'ifts_transactions';
  const notesKey = 'ifts_notes';

  if(!localStorage.getItem(assetsKey)){
    const sampleAssets = [
      {id: 'a1', owner: session, type: 'savings', name:'Commercial Bank FD', amount:50000, value:50000, notes:'1yr FD'},
      {id: 'a2', owner: session, type: 'bond', name:'Gov Bond 2026', amount:1, value:20000, notes:'matures 2026-05-01'},
      {id: 'a3', owner: session, type: 'share', name:'ABC Share', amount:100, value:15000, notes:'Listed'}
    ];
    localStorage.setItem(assetsKey, JSON.stringify(sampleAssets));
  }
  if(!localStorage.getItem(txKey)){
    const sampleTx = [
      {id:'t1', owner:session, assetId:'a1', type:'deposit', amount:50000, date:new Date().toISOString().slice(0,10), note:'Initial deposit'},
      {id:'t2', owner:session, assetId:'a3', type:'deposit', amount:10000, date:new Date().toISOString().slice(0,10), note:'Buy shares'},
    ];
    localStorage.setItem(txKey, JSON.stringify(sampleTx));
  }
  if(!localStorage.getItem(notesKey)){
    const sampleNotes = [
      {id:'n1', owner:session, title:'Bond maturing', date:'2026-05-01', text:'Gov Bond 2026 maturity'},
    ];
    localStorage.setItem(notesKey, JSON.stringify(sampleNotes));
  }

  const assets = JSON.parse(localStorage.getItem(assetsKey) || '[]').filter(a=>a.owner===session);
  const tx = JSON.parse(localStorage.getItem(txKey) || '[]').filter(t=>t.owner===session);
  const notes = JSON.parse(localStorage.getItem(notesKey) || '[]').filter(n=>n.owner===session);

  const total = assets.reduce((s,a)=>s + Number(a.value || 0),0);
  const totalAssets = assets.length;
  const upcoming = notes.filter(n=>{
    try{
      const nd = new Date(n.date);
      const today = new Date(); today.setHours(0,0,0,0);
      const diffDays = (nd - today)/(1000*60*60*24);
      return diffDays >=0 && diffDays <=60;
    }catch(e){return false;}
  }).length;

  const tp = document.getElementById('totalPortfolio');
  if(tp) tp.textContent = `${formatETB(total)}`;
  const aa = document.getElementById('activeAssets');
  if(aa) aa.textContent = totalAssets;
  const ua = document.getElementById('upcomingAlerts');
  if(ua) ua.textContent = `${upcoming} items`;

  const monthlyPL = tx.reduce((s,t)=> {
    if(t.type === 'interest') return s + Number(t.amount || 0);
    if(t.type === 'withdraw') return s - Number(t.amount || 0);
    return s;
  }, 0);
  const mpl = document.getElementById('monthlyPL');
  if(mpl) mpl.textContent = formatETB(monthlyPL);

  const byType = assets.reduce((acc,a)=>{
    acc[a.type] = (acc[a.type] || 0) + Number(a.value || 0);
    return acc;
  }, {});
  const pieLabels = Object.keys(byType).map(k => k.charAt(0).toUpperCase()+k.slice(1));
  const pieData = Object.values(byType);

  try{
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
      type:'pie',
      data:{labels:pieLabels,datasets:[{data:pieData}]},
      options:{plugins:{legend:{position:'bottom'}}}
    });
  }catch(e){}

  try{
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const months = generateMonths(6);
    const values = months.map((m,i) => Math.round(total * (0.9 + (i/12) + Math.random()*0.08)));
    new Chart(lineCtx, {
      type:'line',
      data:{labels:months,datasets:[{label:'Portfolio Value', data:values, fill:true, tension:0.3}]},
      options:{plugins:{legend:{display:false}}}
    });
  }catch(e){}

  function formatETB(v){ return Number(v).toLocaleString('en-ET', {maximumFractionDigits:2}) + ' ETB'; }
  function generateMonths(n){
    const arr=[]; const d = new Date();
    for(let i=n-1;i>=0;i--){
      const dd = new Date(d.getFullYear(), d.getMonth()-i, 1);
      arr.push(dd.toLocaleString('en-ET',{month:'short', year:'numeric'}));
    }
    return arr;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('ifts_session');
    window.location.href = 'index.html';
  });

})();