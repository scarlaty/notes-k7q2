/* ---------- Utilitaires ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function hav(a,b){const R=3440.065,toR=x=>x*Math.PI/180;const dLat=toR(b[0]-a[0]),dLon=toR(b[1]-a[1]);
  const h=Math.sin(dLat/2)**2+Math.cos(toR(a[0]))*Math.cos(toR(b[0]))*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
const legLen = leg => leg.slice(1).reduce((s,p,i)=>s+hav(leg[i],p),0);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => matchMedia('(max-width:960px)').matches;
const store = {
  get(k,d=null){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v);}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* Heure du bord : tous les ports sont en UTC+1 en décembre */
const at = (date,hm) => new Date(`${date}T${hm}:00+01:00`);
const DEPART = at('2026-12-19','17:00');
const tripDate = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris'}).format(new Date());
const todayDay = () => DAYS.find(d=>d.date===tripDate());
const fmtDur = ms => { const m=Math.max(0,Math.round(ms/60000)); const h=Math.floor(m/60); return h ? `${h} h ${String(m%60).padStart(2,'0')}` : `${m} min`; };
const hhmm = d => d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'});

/* ---------- Thème ---------- */
const root = document.documentElement;
function isDark(){const t=root.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;}
{ const saved=store.get('theme'); if(saved) root.dataset.theme=saved; }
const applyTileTheme = () => $$('#map,#citymap').forEach(el=>el.classList.toggle('dark-tiles', isDark()));
const css = v => getComputedStyle(root).getPropertyValue(v).trim();

/* ---------- Tuiles (CORS pour la mise en cache hors ligne) ---------- */
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_OPTS = {maxZoom:19,crossOrigin:true,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'};

/* ---------- Carte générale ---------- */
const map = L.map('map',{zoomControl:true,scrollWheelZoom:!isMobile(),attributionControl:true});
L.tileLayer(TILE_URL,{...TILE_OPTS,maxZoom:18}).addTo(map);
applyTileTheme();
const legLines = LEGS.map(l => L.polyline(l,{color:css('--route-dim'),weight:3,dashArray:'6 6',opacity:.9}).addTo(map));
map.fitBounds(L.latLngBounds(LEGS.flat()),{padding:[20,20]});

Object.entries(PORTS).forEach(([key,p])=>{
  const days = DAYS.filter(d=>d.port===key).map(d=>d.n);
  const icon = L.divIcon({className:'',html:`<div class="pin ${key==='mer'?'sea':''}" data-port="${key}">${days.join('·')}</div>`,iconSize:[30,30],iconAnchor:[15,15]});
  L.marker(p.coord,{icon,keyboard:true,title:p.name}).addTo(map)
    .bindTooltip(p.name,{direction:'top',offset:[0,-16],className:'lbl'})
    .on('click',()=>select(days[days.length===2 && current===1 ? 1 : 0]));
});
const ship = L.marker(PORTS.marseille.coord,{icon:L.divIcon({className:'',html:'<div class="ship">🛳️</div>',iconSize:[28,28],iconAnchor:[14,14]}),interactive:false,zIndexOffset:1000}).addTo(map);

let anim = null;
function animateShip(path){
  if(anim) cancelAnimationFrame(anim);
  if(reduceMotion || !path){ ship.setLatLng(path?path[path.length-1]:PORTS.marseille.coord); return; }
  const seg=[0]; for(let i=1;i<path.length;i++) seg.push(seg[i-1]+hav(path[i-1],path[i]));
  const total=seg[seg.length-1], dur=1800, t0=performance.now();
  const step=now=>{
    let k=Math.min(1,(now-t0)/dur); k=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    const dist=k*total; let i=1; while(i<seg.length-1 && seg[i]<dist) i++;
    const f=(dist-seg[i-1])/((seg[i]-seg[i-1])||1);
    ship.setLatLng([path[i-1][0]+(path[i][0]-path[i-1][0])*f, path[i-1][1]+(path[i][1]-path[i-1][1])*f]);
    if(k<1) anim=requestAnimationFrame(step);
  };
  anim=requestAnimationFrame(step);
}
function fitView(n, animate){
  if(!map.getContainer().offsetWidth) return;
  map.invalidateSize();
  const b = n===1 ? L.latLngBounds(LEGS.flat()) : L.latLngBounds(LEGS[n-2]);
  const o = {padding:n===1?[20,20]:[40,40],maxZoom:8};
  if(animate && !reduceMotion) map.flyToBounds(b,{...o,duration:1.1}); else map.fitBounds(b,o);
}

/* Carte du trajet repliable sur téléphone */
const mapwrap = $('#mapwrap');
function setMapCollapsed(c){
  mapwrap.classList.toggle('collapsed',c);
  $('#mapToggle').textContent = c ? '🗺️ Afficher la carte du trajet' : 'Masquer la carte du trajet';
  store.set('mapCollapsed',c);
  if(!c) setTimeout(()=>{map.invalidateSize();fitView(current,false);},50);
}
$('#mapToggle').onclick=()=>setMapCollapsed(!mapwrap.classList.contains('collapsed'));
setMapCollapsed(store.get('mapCollapsed',false));

/* ---------- Plans de ville ---------- */
const CAT = {
  port:{label:'Navire / terminal',color:'#0b5c8c'},
  transport:{label:'Transport',color:'#6b5bd2'},
  visite:{label:'À voir',color:'#c0612b'},
  food:{label:'Marché / food',color:'#2f8a4c'},
  noel:{label:'Spécial Noël',color:'#b23a3a'}
};
const LINESTYLE = {
  metro:{color:'#d0342c',weight:4,dashArray:'2 7',sw:'<b style="color:#d0342c">┅</b>'},
  walk:{color:'#555',weight:3,dashArray:'1 6',sw:'<b>┈</b>'},
  bus:{color:'#6b5bd2',weight:5,sw:'<b style="color:#6b5bd2">━</b>'},
  bus2:{color:'#6b5bd2',weight:2,opacity:.5,dashArray:'4 4',sw:'<b style="color:#6b5bd2;opacity:.6">╍</b>'},
  shuttle:{color:'#0b5c8c',weight:3,dashArray:'6 6',sw:'<b style="color:#0b5c8c">╍</b>'},
  train:{color:'#2f8a4c',weight:4,dashArray:'8 5',sw:'<b style="color:#2f8a4c">╍</b>'}
};
let cityMap = null, cityRefit = null, geoWatch = null, meMarker = null;
function stopGeo(){ if(geoWatch!==null){navigator.geolocation.clearWatch(geoWatch);geoWatch=null;} meMarker=null; }
function initCityMap(d){
  stopGeo();
  if(cityMap){ cityMap.remove(); cityMap = null; }
  cityRefit = null;
  const c = CITY[d.port], el = $('#citymap');
  if(!c || !el) return;
  el.classList.toggle('dark-tiles', isDark());
  cityMap = L.map(el,{scrollWheelZoom:false,tap:false});
  L.tileLayer(TILE_URL,TILE_OPTS).addTo(cityMap);
  c.lines.forEach(l=>L.polyline(l.ll,{...LINESTYLE[l.kind],opacity:LINESTYLE[l.kind].opacity||.9}).bindTooltip(l.label,{sticky:true}).addTo(cityMap));
  const ms = c.pois.map((p,i)=>{
    const icon = L.divIcon({className:'',html:`<div class="cpin" style="background:${CAT[p.cat].color}">${i+1}</div>`,iconSize:[26,26],iconAnchor:[13,13]});
    const gm = 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination='+p.ll.join(',');
    return L.marker(p.ll,{icon,title:p.name}).bindPopup(`<b>${i+1}. ${p.name}</b>${p.note?'<br>'+p.note:''}<br><a href="${gm}" target="_blank" rel="noopener">Itinéraire à pied (Google Maps)</a>`).addTo(cityMap);
  });
  const all = L.latLngBounds(c.pois.map(p=>p.ll));
  const route = d.port==='marseille' ? L.latLngBounds(c.lines.flatMap(l=>l.ll)) : null;
  const fit = b => cityMap.fitBounds(b,{padding:[24,24]});
  cityRefit = () => { cityMap.invalidateSize(); fit(route || all); };
  if(el.offsetWidth) fit(route || all); else cityMap.setView(all.getCenter(),13);
  const det = el.closest('details');
  if(det) det.addEventListener('toggle',()=>{ if(det.open) setTimeout(cityRefit,30); });
  $$('ol.pois li').forEach(li=>li.onclick=()=>{const m=ms[+li.dataset.i];cityMap.setView(m.getLatLng(),17);m.openPopup();$('.cmwrap').scrollIntoView({block:'center',behavior:reduceMotion?'auto':'smooth'});});
  $$('.mapbtns button').forEach(b=>b.onclick=()=>fit(b.dataset.fit==='route'?route:all));

  // Plein écran
  const wrap = $('.cmwrap'), fsBtn = $('#cmFs');
  fsBtn.onclick = ()=>{
    const on = !wrap.classList.contains('fs');
    wrap.classList.toggle('fs',on); fsBtn.textContent = on?'✕':'⛶'; fsBtn.title = on?'Fermer':'Plein écran';
    document.body.style.overflow = on?'hidden':'';
    setTimeout(()=>cityMap.invalidateSize(),60);
  };
  // Me localiser (fonctionne aussi sans réseau, grâce au GPS)
  const locBtn = $('#cmLoc');
  if(!('geolocation' in navigator)){ locBtn.hidden=true; return; }
  locBtn.onclick = ()=>{
    if(geoWatch!==null){ stopGeo(); cityMap.eachLayer(l=>{if(l._isMe) cityMap.removeLayer(l);}); locBtn.classList.remove('on'); return; }
    locBtn.classList.add('on');
    let first = true;
    geoWatch = navigator.geolocation.watchPosition(pos=>{
      const ll=[pos.coords.latitude,pos.coords.longitude];
      if(!meMarker){
        meMarker=L.marker(ll,{icon:L.divIcon({className:'',html:'<div class="me"></div>',iconSize:[18,18],iconAnchor:[9,9]}),zIndexOffset:2000}).addTo(cityMap);
        meMarker._isMe=true;
      } else meMarker.setLatLng(ll);
      if(first){ cityMap.setView(ll,Math.max(cityMap.getZoom(),16)); first=false; }
    },err=>{ alert('Position indisponible : '+(err.code===1?'autorisez la localisation pour ce site.':'signal GPS introuvable.')); stopGeo(); locBtn.classList.remove('on'); },
    {enableHighAccuracy:true,maximumAge:10000,timeout:20000});
  };
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && $('.cmwrap.fs')) $('#cmFs').click(); });

/* ---------- Jours ---------- */
const daysNav = $('#days');
DAYS.forEach(d=>{
  const b=document.createElement('button');
  b.className='chip'; b.setAttribute('role','tab'); b.id='chip-'+d.n;
  const short=new Date(d.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric'});
  b.innerHTML=`<span class="num">${d.n}</span>${PORTS[d.port].name.replace(' (Tunis)','')} <small style="opacity:.7">${short}</small>`;
  b.onclick=()=>select(d.n);
  daysNav.appendChild(b);
});

const LEX_BY_DAY = {}; Object.values(LEXIQUE).forEach(L_=>L_.days.forEach(n=>LEX_BY_DAY[n]=L_));
const sec = (title, inner, open=false) => `<details class="sec"${open?' open':''}><summary>${title}</summary><div class="in">${inner}</div></details>`;
const ul = items => `<ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul>`;

function nowInfo(d){
  if(d.date!==tripDate()) return '';
  const now=new Date(), nxt=DAYS[d.n];
  if(d.n===1){
    return now<DEPART ? `<div class="nowbar">🛳️ <b>C'est aujourd'hui !</b> Départ du navire à 17 h 00, dans <b>${fmtDur(DEPART-now)}</b>.</div>`
                      : `<div class="nowbar">🌊 Bon voyage ! Prochaine escale : <b>Savone</b> demain à 7 h 00.</div>`;
  }
  if(d.port==='mer') return `<div class="nowbar">🎄 Journée en mer : joyeux réveillon ! Arrivée à <b>Barcelone</b> demain à 8 h 00.</div>`;
  if(d.n===8) return `<div class="nowbar">🏁 Arrivée à Marseille à 8 h 00. Bus 35T vers la Joliette à partir de <b>9 h 15</b>.</div>`;
  const arr=at(d.date,d.arr), dep=at(d.date,d.dep), board=new Date(dep-30*60000);
  if(now<arr) return `<div class="nowbar">⚓ Arrivée à ${d.arr}, dans <b>${fmtDur(arr-now)}</b>. Départ prévu à ${d.dep}.</div>`;
  if(now<board){ const left=board-now; return `<div class="nowbar${left<75*60000?' late':''}">⏰ Retour à bord vers <b>${hhmm(board)}</b> : il reste <b>${fmtDur(left)}</b><br><small>30 min avant le départ de ${d.dep}. L'heure exacte est dans le programme du jour.</small></div>`; }
  if(now<dep) return `<div class="nowbar late">⏰ <b>Retour à bord maintenant !</b> Départ à ${d.dep}.</div>`;
  return `<div class="nowbar">🌊 Le navire est reparti. Prochaine étape : <b>${PORTS[nxt.port].name}</b>${nxt.arr&&nxt.arr!=='—'?` à ${nxt.arr}`:''}.</div>`;
}

let current = 0;
function render(d){
  const p=PORTS[d.port], x=EXTRA[d.n]||{}, c=CITY[d.port], lex=LEX_BY_DAY[d.n];
  let h = `
    <div class="hero">
      <div class="date">Jour ${d.n} · ${d.label} 2026</div>
      <h2>${p.name}</h2>
      <div class="country">${d.country}</div>
      ${d.badge?`<span class="badge ${d.xmas?'xmas':''}">${d.badge}</span>`:''}
    </div>
    <div id="nowbar">${nowInfo(d)}</div>
    <div class="facts">
      <div class="fact"><span>Arrivée</span><b>${d.arr}</b></div>
      <div class="fact"><span>Départ</span><b>${d.dep}</b></div>
      <div class="fact"><span>À terre</span><b>${d.ashore}</b></div>
      <div class="fact"><span>Temp. moy.</span><b>${d.temp}</b></div>
      <div class="fact"><span>Coucher soleil</span><b>${d.sunset}</b></div>
      <div class="fact"><span>Navigation</span><b>${d.n>1?Math.round(legLen(LEGS[d.n-2]))+' nm':'—'}</b></div>
    </div>
    <div class="body">
      <p class="intro">${d.intro}</p>
      ${d.tip?`<div class="tip ${d.warn?'warn':''}">💡 ${d.tip}</div>`:''}`;
  if(d.port==='marseille'){
    const it=MRS_STEPS[d.n===1?'aller':'retour'];
    h += sec(it.title, `<ol class="steps">${it.steps.map(st=>`<li><b class="h">${st[0]}</b>${st[1]}</li>`).join('')}</ol>`, true);
  }
  if(c){
    h += sec(`🗺️ Plan ${d.port==='goulette'?'Tunis · Carthage · Sidi Bou Saïd':'de la ville'}`, `
      ${d.port==='marseille'?`<div class="mapbtns"><button data-fit="route">Trajet gare ⇄ navire</button><button data-fit="all">Tout Marseille</button></div>`:''}
      <div class="cmwrap"><div id="citymap" role="region" aria-label="Plan de la ville"></div>
        <div class="cmtools"><button id="cmFs" title="Plein écran" aria-label="Plein écran">⛶</button><button id="cmLoc" title="Me localiser" aria-label="Me localiser">◎</button></div></div>
      <div class="legend">${Object.entries(CAT).filter(([k])=>c.pois.some(q=>q.cat===k)).map(([,v])=>`<span><i style="background:${v.color}"></i>${v.label}</span>`).join('')}${c.lines.map(l=>`<span>${LINESTYLE[l.kind].sw} ${l.label}</span>`).join('')}</div>
      <ol class="pois">${c.pois.map((q,i)=>`<li data-i="${i}"><span class="n" style="background:${CAT[q.cat].color}">${i+1}</span><span><span class="t">${q.name}</span>${q.note?`<small>${q.note}</small>`:''}</span></li>`).join('')}</ol>`, true);
  }
  if(x.transport&&x.transport.length) h += sec('🚇 Transports & accès', ul(x.transport), true);
  d.sections.forEach((s,i)=> h += sec(s.t, ul(s.items), i===0 && d.port!=='marseille'));
  if(lex) h += sec(`💬 Phrases utiles · ${lex.title.replace(/^\S+\s/,'')}`, lexTable(lex, 8) + `<p class="muted" style="margin:8px 0 0">Toutes les phrases : onglet <b>Phrases</b>.</p>`);
  if(x.voices&&x.voices.length) h += sec('💬 Retours de voyageurs', x.voices.map(v=>`<blockquote class="voice">« ${v[0]} »<cite><a href="${v[2]}" target="_blank" rel="noopener">${v[1]}</a></cite></blockquote>`).join(''));
  if(x.links&&x.links.length) h += sec('🔗 Liens utiles & sources', `<ul class="links">${x.links.map(l=>`<li><a href="${l[1]}" target="_blank" rel="noopener">${l[0]}</a> <span class="dom">${new URL(l[1]).hostname.replace(/^www\./,'')}</span></li>`).join('')}</ul>`);
  h += `</div>
    <div class="nav">
      <button id="prev" ${d.n===1?'disabled':''}>← Jour ${d.n-1||''}</button>
      <button id="next" ${d.n===DAYS.length?'disabled':''}>Jour ${d.n<DAYS.length?d.n+1:''} →</button>
    </div>
    <div class="swipehint">Astuce : glissez vers la gauche ou la droite pour changer de jour</div>`;
  $('#panel').innerHTML = h;
  initCityMap(d);
  bindSay($('#panel'));
  $('#prev').onclick=()=>select(d.n-1,{scroll:true});
  $('#next').onclick=()=>select(d.n+1,{scroll:true});
}

function select(n, opts={}){
  if(n<1||n>DAYS.length) return;
  const prev=current; current=n;
  const d=DAYS[n-1];
  render(d);
  $$('.chip').forEach(c=>c.setAttribute('aria-selected', c.id==='chip-'+n));
  const chip=$('#chip-'+n);
  daysNav.scrollTo({left:chip.offsetLeft-(daysNav.clientWidth-chip.offsetWidth)/2,behavior:reduceMotion?'auto':'smooth'});
  legLines.forEach((l,i)=>{
    const done=i<n-2, today=i===n-2;
    l.setStyle({color:today||done?css('--route'):css('--route-dim'),weight:today?5:3,dashArray:today||done?null:'6 6',opacity:today?1:done?.55:.9});
    if(today) l.bringToFront();
  });
  $$('.pin').forEach(el=>el.classList.toggle('active',el.dataset.port===d.port));
  if(n===1) animateShip(null);
  else if(!opts.instant && n===prev+1) animateShip(LEGS[n-2]);
  else { if(anim) cancelAnimationFrame(anim); ship.setLatLng(PORTS[d.port].coord); }
  fitView(n, !opts.instant);
  if(opts.scroll){ const top=$('.vgrid').getBoundingClientRect().top+scrollY-daysNav.offsetHeight-4; if(scrollY>top) scrollTo({top,behavior:reduceMotion?'auto':'smooth'}); }
  if(view==='voyage') history.replaceState(null,'','#jour-'+n);
}

/* Glisser pour changer de jour */
(()=>{
  let x0=null,y0=0,t0=0;
  const panel=$('#panel');
  panel.addEventListener('touchstart',e=>{ if(e.target.closest('.leaflet-container,.cmwrap,.lex,table')){x0=null;return;} const t=e.touches[0]; x0=t.clientX; y0=t.clientY; t0=Date.now(); },{passive:true});
  panel.addEventListener('touchend',e=>{
    if(x0===null) return; const t=e.changedTouches[0], dx=t.clientX-x0, dy=t.clientY-y0; x0=null;
    if(Math.abs(dx)>70 && Math.abs(dy)<60 && Date.now()-t0<700) select(current+(dx<0?1:-1),{scroll:true});
  },{passive:true});
})();
document.addEventListener('keydown',e=>{
  if(view!=='voyage' || e.target.closest('input,textarea')) return;
  if(e.key==='ArrowRight') select(current+1);
  if(e.key==='ArrowLeft') select(current-1);
});

/* ---------- Lexique ---------- */
const canSpeak = 'speechSynthesis' in window;
function lexTable(lex, limit){
  const rows = lex.rows.slice(0, limit||lex.rows.length);
  const sayBtn = (txt,lang) => canSpeak ? `<button class="say" data-say="${esc(txt)}" data-lang="${lang}" aria-label="Écouter">🔊</button>` : '';
  if(lex.lang2) return `<table class="lex"><tbody>${rows.map(r=>`<tr><td class="fr">${r[0]}</td><td class="lo">
      <div class="l2"><span>${r[1]} <small>cat.</small></span>${sayBtn(r[1],lex.lang)}</div>
      <div class="l2"><span>${r[2]} <small>esp.</small></span>${sayBtn(r[2],lex.lang2)}</div></td></tr>`).join('')}</tbody></table>`;
  const rtl = lex.lang==='ar';
  return `<table class="lex"><tbody>${rows.map(r=>`<tr><td class="fr">${r[0]}</td><td class="lo"><span${rtl?' dir="rtl"':''}>${r[1]}</span><small>${r[2]}</small></td><td>${sayBtn(r[1],lex.lang)}</td></tr>`).join('')}</tbody></table>`;
}
function bindSay(scope){
  scope.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(b.dataset.say); u.lang=b.dataset.lang; u.rate=.85;
    const v=speechSynthesis.getVoices().find(v=>v.lang.replace('_','-').toLowerCase().startsWith(b.dataset.lang.toLowerCase().slice(0,2)));
    if(v) u.voice=v;
    speechSynthesis.speak(u);
  });
}
function renderPhrases(){
  $('#phrases').innerHTML = Object.values(LEXIQUE).map(lex=>`
    <div class="card"><h2>${lex.title}</h2>
      <p class="muted" style="margin:-4px 0 8px">Jour${lex.days.length>1?'s':''} ${lex.days.join(', ')}${lex.note?' · '+lex.note:''}</p>
      ${lexTable(lex)}</div>`).join('') +
    `<div class="card"><h2>🔊 Prononciation</h2><p class="muted">Le bouton 🔊 utilise la voix de synthèse du téléphone. Elle fonctionne hors ligne si la langue est installée (Réglages → Accessibilité → Contenu énoncé sur iPhone ; Synthèse vocale sur Android). Pour l'arabe tunisien, la voix lit l'arabe standard : fiez-vous plutôt à la prononciation écrite.</p></div>`;
  bindSay($('#phrases'));
}

/* ---------- Navire ---------- */
function renderNavire(){
  $('#navire').innerHTML = `
  <div class="card"><h2>Notre formule</h2>
    <ul>
      <li>Cabine <b>Balcon vue mer</b> (ponts 6 à 10) : lit double ou jumeaux, douche, TV interactive, coffre-fort, climatisation.</li>
      <li><b>Pension complète</b>, avec boissons sans alcool au buffet du petit-déjeuner et du déjeuner.</li>
      <li><b>Forfait boissons My Drinks</b> inclus (détail ci-dessous).</li>
      <li>Activités, spectacles et <b>taxes portuaires</b> inclus.</li>
      <li>Non inclus : <b>Wi-Fi</b>, excursions, restaurants de spécialités, spa.</li>
    </ul></div>
  <div class="card"><h2>🍹 My Drinks</h2>
    <h3 style="margin-top:0">Inclus</h3><ul class="yes">${SHIP.drinks_in.map(i=>`<li>${i}</li>`).join('')}</ul>
    <h3>Non inclus</h3><ul class="no">${SHIP.drinks_out.map(i=>`<li>${i}</li>`).join('')}</ul>
    <p class="muted" style="margin:10px 0 0">La carte Costa est scannée à chaque commande. Tous les adultes d'une même cabine ont obligatoirement le même forfait.</p></div>
  <div class="card"><h2>🧭 Repères par pont</h2>
    <div class="deck">${SHIP.decks.map(r=>`<div class="dn${r[0]==='6 – 10'?' me':''}">${r[0]}</div><div>${r[1]}</div>`).join('')}</div>
    <p class="muted" style="margin:8px 0 0">Repères tirés d'un guide public. Référez-vous aux plans affichés près des ascenseurs.</p></div>
  <div class="card"><h2>🍽️ Restaurants inclus</h2>
    <div class="dl">${SHIP.included.map(r=>`<div><b>${r[0]}</b><small>${r[1]}</small><br>${r[2]}</div>`).join('')}</div>
    <h3>Restaurants payants (sur réservation)</h3>
    <div class="dl">${SHIP.paying.map(r=>`<div><b>${r[0]}</b><small>${r[1]}</small></div>`).join('')}</div></div>
  <div class="card"><h2>🍸 Bars</h2>
    <div class="dl">${SHIP.bars.map(r=>`<div><b>${r[0]}</b><small>${r[1]}</small></div>`).join('')}</div></div>
  <div class="card"><h2>🎄 Noël à bord</h2>
    <ul>
      <li><b>24/12, journée en mer</b> : réveillon. Prévoir une tenue habillée.</li>
      <li><b>25/12 à Barcelone</b> : la ville est fériée, beaucoup de choses sont fermées. Le déjeuner à bord est une bonne option.</li>
      <li>Je n'ai pas trouvé de programme publié pour cette croisière. Dîner de fête, animations et éventuelle messe seront annoncés dans le <b>programme du jour</b> remis en cabine et dans l'app MyCosta.</li>
      <li>Réservez dès le 1<sup>er</sup> jour un restaurant de spécialités ou le spa pour le 24 si vous le souhaitez.</li>
    </ul></div>
  <div class="card"><h2>Le navire</h2>
    <ul>
      <li>Costa Pacifica, classe Concordia, en service depuis 2009 (Fincantieri).</li>
      <li>290 m, 14 ponts passagers, 1 504 cabines, ≈ 1 100 membres d'équipage.</li>
      <li>Thème : la musique. Piscine sous verrière, toboggan, spa, théâtre, casino, club enfants.</li>
    </ul></div>
  <div class="card"><h2>💬 Ce qu'en disent les croisiéristes</h2>
    <ul>
      <li><b>7,4/10</b> sur 1 764 avis (<a href="https://www.logitravel.fr/croisieres/compagnies-maritimes/costa-croisieres/bateaux/costa-pacifica/avis-des-clients/" target="_blank" rel="noopener">Logitravel</a>). Les cabines obtiennent 8/10, <b>les excursions sont le point le moins bien noté</b>.</li>
      <li>Points forts : cuisine du soir, personnel attentionné, bonne literie.</li>
      <li>Points faibles : piscines petites, animation du soir jugée en baisse par des habitués.</li>
      <li>Les escales de cet itinéraire se font très bien en autonomie, sauf Pompéi.</li>
    </ul></div>`;
}

/* ---------- Préparer ---------- */
function icsEscape(s){ return String(s).replace(/<[^>]+>/g,'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n'); }
function icsFor(list){
  const stamp = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  const ev = list.map(r=>{
    const d=r[1].replace(/-/g,''), nd=new Date(r[1]+'T12:00:00Z'); nd.setUTCDate(nd.getUTCDate()+1);
    return ['BEGIN:VEVENT',`UID:${r[0]}-noel2026@croisiere`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${d}`,`DTEND;VALUE=DATE:${nd.toISOString().slice(0,10).replace(/-/g,'')}`,
      `SUMMARY:${icsEscape('🛳️ '+r[2])}`,`DESCRIPTION:${icsEscape(r[3])}`,
      'BEGIN:VALARM','TRIGGER:PT9H','ACTION:DISPLAY',`DESCRIPTION:${icsEscape(r[2])}`,'END:VALARM','END:VEVENT'].join('\r\n');
  });
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//croisiere-noel-2026//FR','CALSCALE:GREGORIAN',...ev,'END:VCALENDAR'].join('\r\n');
}
function download(name, text, type){
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name;
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);
}
function renderPrepa(){
  const done = store.get('remDone',{});
  const today = tripDate();
  $('#prepa').innerHTML = `
  <div class="card"><h2>⏳ Avant le départ</h2>
    <div class="cd"><div><b id="cdD">–</b><span>jours</span></div><div><b id="cdH">–</b><span>heures</span></div><div><b id="cdM">–</b><span>minutes</span></div></div>
    <p class="muted" style="margin:6px 0 0">Jusqu'au départ du Costa Pacifica, samedi 19 décembre à 17 h 00, Marseille.</p></div>

  <div class="card" id="offlineCard"><h2>📶 Mode hors ligne</h2>
    <p style="margin-top:0">Sans réseau (en mer, à Tunis sans forfait), le site et <b>tous les plans</b> restent consultables une fois préparés. La géolocalisation sur les plans marche aussi sans réseau, grâce au GPS.</p>
    <ol style="padding-left:20px;margin:0 0 6px">
      <li><b>Ajoutez le site à l'écran d'accueil</b>. iPhone : Safari → bouton Partager → « Sur l'écran d'accueil ». Android : Chrome → ⋮ → « Installer l'application ».</li>
      <li><b>Ouvrez-le depuis l'icône</b>. Sur iPhone, c'est indispensable : l'icône a sa propre mémoire, distincte de Safari.</li>
      <li>En <b>Wi-Fi</b>, appuyez sur le bouton ci-dessous. Comptez environ 2 000 morceaux de carte (≈ 30 Mo), quelques minutes.</li>
    </ol>
    <div class="progress" aria-hidden="true"><i id="offBar"></i></div>
    <div id="offStatus" class="muted">—</div>
    <div class="row"><button class="btn" id="offGo">⬇️ Préparer le hors ligne</button><button class="btn ghost" id="offStop" hidden>Arrêter</button></div>
    <p class="muted" style="margin:10px 0 0">À faire une fois, idéalement 2 à 5 jours avant le départ, sur chaque téléphone. Ouvrez le site de temps en temps ensuite, pour que le téléphone ne libère pas la mémoire.</p></div>

  <div class="card wide"><h2>✅ À faire avant de partir</h2>
    <div class="row" style="margin:0 0 6px"><button class="btn ghost" id="icsAll">📅 Tout ajouter à mon calendrier</button></div>
    <ul class="rem">${REMINDERS.map(r=>{
      const past = r[1]<today && !done[r[0]];
      const when = new Date(r[1]+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'long'});
      return `<li class="${done[r[0]]?'done':''}" data-id="${r[0]}">
        <input type="checkbox" ${done[r[0]]?'checked':''} aria-label="Fait">
        <div><span class="when${past?' past':''}">${past?'⚠️ ':''}${when}</span><div class="what"><b>${r[2]}</b></div><small>${r[3]}</small></div>
        <button class="ics" title="Ajouter au calendrier" aria-label="Ajouter au calendrier">📅</button></li>`;}).join('')}</ul>
    <p class="muted" style="margin:8px 0 0">Les cases cochées sont mémorisées sur ce téléphone uniquement.</p></div>

  <div class="card"><h2>🗓️ Itinéraire</h2>
    <table class="t"><thead><tr><th>Jour</th><th>Escale</th><th>Arr.</th><th>Dép.</th></tr></thead><tbody>
    ${DAYS.map(d=>`<tr class="click" data-n="${d.n}"><td class="n">J${d.n} · ${new Date(d.date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric'})}</td><td>${PORTS[d.port].name}</td><td class="n">${d.arr}</td><td class="n">${d.dep}</td></tr>`).join('')}
    </tbody></table></div>

  <div class="card"><h2>ℹ️ Infos pratiques</h2>
    <ul>
      <li><b>Heure</b> : même fuseau partout, aucun décalage.</li>
      <li><b>Monnaie</b> : euro, sauf en Tunisie (dinar, ni importable ni exportable). À bord, tout passe par la carte Costa.</li>
      <li><b>Papiers</b> : passeport valide recommandé (Tunisie hors UE). Vérifiez les exigences de Costa.</li>
      <li><b>Retour à bord</b> : en général 30 min avant le départ, l'heure exacte figure dans le programme du jour.</li>
      <li><b>Météo</b> : 12 à 17 °C le jour, mer parfois agitée. Prévoir coupe-vent, pull et chaussures fermées.</li>
      <li><b>Réseau</b> : en mer, le téléphone peut basculer sur le réseau satellite du navire, très cher. Activez le <b>mode avion</b> (Wi-Fi activé) dès la sortie du port.</li>
    </ul></div>`;

  // Rappels
  $$('.rem li').forEach(li=>{
    const id=li.dataset.id, r=REMINDERS.find(x=>x[0]===id);
    li.querySelector('input').onchange=e=>{ const st=store.get('remDone',{}); st[id]=e.target.checked; store.set('remDone',st); li.classList.toggle('done',e.target.checked); li.querySelector('.when').classList.remove('past'); };
    li.querySelector('.ics').onclick=()=>download(`rappel-${id}.ics`, icsFor([r]), 'text/calendar');
  });
  $('#icsAll').onclick=()=>download('rappels-croisiere.ics', icsFor(REMINDERS.filter(r=>!store.get('remDone',{})[r[0]])), 'text/calendar');
  $$('#prepa tr.click').forEach(tr=>tr.onclick=()=>{ showView('voyage'); select(+tr.dataset.n,{instant:true}); scrollTo(0,0); });
  initOfflineCard();
}

/* ---------- SOS ---------- */
function renderSOS(){
  $('#sos').innerHTML = `
  <div class="card"><a class="big112" href="tel:112">📞 112</a>
    <p class="muted" style="margin:0;text-align:center">Urgence en France, en Italie et en Espagne. En Tunisie : 197 (police), 190 (SAMU), 198 (pompiers).</p></div>
  ${SOS.map(g=>`<div class="card"><h2>${g.title}</h2><ul class="sos">${g.items.map(i=>`<li><div class="lb"><b>${i[0]}</b>${i[3]?`<small>${i[3]}</small>`:''}</div>${i[2]?`<a class="call${g.title.includes('Urgences')?'':' soft'}" href="tel:${i[2]}">📞 ${i[1]}</a>`:`<span class="call none">${i[1]}</span>`}</li>`).join('')}</ul></div>`).join('')}
  <div class="card"><h2>🔗 Liens officiels</h2><ul class="links">${SOS_LINKS.map(l=>`<li><a href="${l[1]}" target="_blank" rel="noopener">${l[0]}</a></li>`).join('')}</ul>
    <p class="muted" style="margin:8px 0 0">Gardez une photo de vos passeports et de vos cartes d'embarquement dans votre téléphone, et une copie papier dans la valise.</p></div>`;
}

/* ---------- Compte à rebours ---------- */
function tick(){
  const now=new Date(), ms=DEPART-now, td=todayDay();
  const pill=$('#countdown');
  if(td){ pill.textContent=`Jour ${td.n}/8`; pill.classList.add('live'); }
  else if(ms>0){ pill.textContent='J-'+Math.ceil(ms/864e5); pill.classList.remove('live'); }
  else { pill.textContent=now<at('2026-12-26','12:00')?'En route':'Bon retour'; }
  if($('#cdD')){
    const s=Math.max(0,ms/1000);
    $('#cdD').textContent=Math.floor(s/86400); $('#cdH').textContent=Math.floor(s%86400/3600); $('#cdM').textContent=Math.floor(s%3600/60);
  }
  if(view==='voyage' && current && $('#nowbar')) $('#nowbar').innerHTML=nowInfo(DAYS[current-1]);
}

/* ---------- Mode hors ligne ---------- */
const TILES_CACHE='tiles-v1', EXT_CACHE='ext-v1';
const FONT_CSS='https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600&display=swap';
function tileXY(lat,lon,z){const n=2**z;const x=Math.floor((lon+180)/360*n);const r=lat*Math.PI/180;const y=Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*n);return [x,y];}
function addRange(set,s,w,n,e,z){const [x0,y0]=tileXY(n,w,z),[x1,y1]=tileXY(s,e,z);for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)set.add(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);}
function tileList(){
  const set=new Set();
  // Carte du trajet
  const all=LEGS.flat(), la=all.map(p=>p[0]), lo=all.map(p=>p[1]);
  for(let z=4;z<=6;z++) addRange(set,Math.min(...la)-1,Math.min(...lo)-1,Math.max(...la)+1,Math.max(...lo)+1,z);
  LEGS.forEach(l=>{const a=l.map(p=>p[0]),o=l.map(p=>p[1]);for(let z=7;z<=8;z++) addRange(set,Math.min(...a)-.3,Math.min(...o)-.3,Math.max(...a)+.3,Math.max(...o)+.3,z);});
  // Plans de ville
  Object.values(CITY).forEach(c=>{
    const pts=[...c.pois.map(p=>p.ll),...c.lines.flatMap(l=>l.ll)];
    const a=pts.map(p=>p[0]),o=pts.map(p=>p[1]);
    const pa=(Math.max(...a)-Math.min(...a))*.15+.003, po=(Math.max(...o)-Math.min(...o))*.15+.003;
    for(let z=11;z<=15;z++) addRange(set,Math.min(...a)-pa,Math.min(...o)-po,Math.max(...a)+pa,Math.max(...o)+po,z);
    c.pois.forEach(p=>{ addRange(set,p.ll[0]-.004,p.ll[1]-.005,p.ll[0]+.004,p.ll[1]+.005,16); addRange(set,p.ll[0]-.002,p.ll[1]-.0026,p.ll[0]+.002,p.ll[1]+.0026,17); });
    c.lines.forEach(l=>l.ll.forEach((q,i)=>{ if(i%4===0) addRange(set,q[0]-.0015,q[1]-.002,q[0]+.0015,q[1]+.002,16); }));
  });
  return [...set];
}
let offAbort=false;
async function prepareOffline(){
  const bar=$('#offBar'), st=$('#offStatus'), go=$('#offGo'), stop=$('#offStop');
  if(!('caches' in window)){ st.textContent='Ce navigateur ne permet pas le mode hors ligne.'; return; }
  if(!navigator.onLine){ st.textContent='Pas de connexion : connectez-vous au Wi-Fi puis réessayez.'; return; }
  offAbort=false; go.disabled=true; stop.hidden=false;
  try{ if(navigator.storage&&navigator.storage.persist) await navigator.storage.persist(); }catch(e){}
  try{
    st.textContent='Mise en cache du site…';
    const app=await caches.open(APP_CACHE);
    await app.addAll(APP_FILES);
    const ext=await caches.open(EXT_CACHE);
    for(const u of EXT_FILES){ try{ const r=await fetch(u,{mode:'cors'}); if(r.ok) await ext.put(u,r); }catch(e){} }
    try{ const r=await fetch(FONT_CSS,{mode:'cors'}); const txt=await r.clone().text(); await ext.put(FONT_CSS,r);
      for(const m of txt.matchAll(/url\((https:[^)]+)\)/g)){ try{ const f=await fetch(m[1],{mode:'cors'}); if(f.ok) await ext.put(m[1],f);}catch(e){} } }catch(e){}
  }catch(e){ st.textContent='Erreur lors de la mise en cache du site : '+e.message; go.disabled=false; stop.hidden=true; return; }
  const list=tileList(), tc=await caches.open(TILES_CACHE);
  let i=0, ok=0, fail=0;
  const worker=async()=>{
    while(i<list.length && !offAbort){
      const u=list[i++];
      try{
        if(await tc.match(u,{ignoreVary:true})){ ok++; }
        else { const r=await fetch(u,{mode:'cors'}); if(r.ok){ await tc.put(u,r); ok++; } else fail++; }
      }catch(e){ fail++; }
      bar.style.width=(100*(ok+fail)/list.length).toFixed(1)+'%';
      st.textContent=`Cartes : ${ok+fail} / ${list.length}${fail?` · ${fail} échec(s)`:''}`;
    }
  };
  await Promise.all([worker(),worker()]); // 2 en parallèle, pour ménager le serveur OpenStreetMap
  go.disabled=false; stop.hidden=true;
  if(offAbort){ st.textContent=`Interrompu : ${ok} cartes enregistrées. Vous pourrez reprendre plus tard.`; return; }
  store.set('offline',{at:new Date().toISOString(),tiles:ok,fail});
  showOfflineStatus();
  if(fail) st.innerHTML += `<br>${fail} morceaux de carte n'ont pas pu être téléchargés : relancez pour compléter.`;
}
async function showOfflineStatus(){
  const st=$('#offStatus'); if(!st) return;
  const o=store.get('offline');
  let used='';
  try{ if(navigator.storage&&navigator.storage.estimate){ const e=await navigator.storage.estimate(); used=` · ${(e.usage/1048576).toFixed(0)} Mo utilisés`; } }catch(e){}
  if(o){ st.innerHTML=`<span class="ok">✅ Prêt hors ligne</span> depuis le ${new Date(o.at).toLocaleDateString('fr-FR',{day:'numeric',month:'long'})} (${o.tiles} cartes)${used}`; $('#offBar').style.width='100%'; }
  else st.textContent='Pas encore préparé sur cet appareil.'+used;
}
function initOfflineCard(){
  $('#offGo').onclick=prepareOffline;
  $('#offStop').onclick=()=>{offAbort=true;};
  showOfflineStatus();
}
const APP_CACHE='app-v1';
const APP_FILES=['./','index.html','data.js','data2.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
const EXT_FILES=['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'];

if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
const netState=()=>document.body.classList.toggle('is-offline',!navigator.onLine);
addEventListener('online',netState); addEventListener('offline',netState); netState();

/* ---------- Onglets ---------- */
let view='voyage';
function showView(v){
  view=v;
  $$('.view').forEach(s=>s.classList.toggle('on',s.id==='v-'+v));
  $$('nav.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.view===v));
  if(v==='voyage'){ setTimeout(()=>{map.invalidateSize(); if(cityRefit) cityRefit(); fitView(current,false);},30); history.replaceState(null,'','#jour-'+current); }
  else history.replaceState(null,'','#'+v);
  if(v==='prepa') renderPrepa();
  if(v==='navire' && !$('#navire').innerHTML) renderNavire();
  if(v==='phrases' && !$('#phrases').innerHTML) renderPhrases();
  if(v==='sos' && !$('#sos').innerHTML) renderSOS();
  tick();
}
$$('nav.tabs button').forEach(b=>b.onclick=()=>{ showView(b.dataset.view); scrollTo(0,0); });

$('#themeBtn').onclick=()=>{
  root.dataset.theme=isDark()?'light':'dark'; store.set('theme',root.dataset.theme);
  applyTileTheme(); select(current,{instant:true});
};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{ if(!root.dataset.theme){applyTileTheme();select(current,{instant:true});} });
let rz; addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{map.invalidateSize();if(cityMap)cityMap.invalidateSize();fitView(current,false);},200);});

/* ---------- Démarrage ---------- */
{
  const td=todayDay();
  if(td) $('#chip-'+td.n).classList.add('today');
  const m=location.hash.match(/jour-(\d)/), v=location.hash.slice(1);
  const startView=['navire','prepa','phrases','sos'].includes(v)?v:'voyage';
  select(m?+m[1]:(td?td.n:1),{instant:true});
  showView(startView);
  setInterval(tick,30000); tick();
}
