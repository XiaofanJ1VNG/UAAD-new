const UAAD_TILEJSON = 'https://api.maptiler.com/maps/darkmatter/tiles.json?key=nPiqNw0jv1R5uByQ9fYX';
(()=>{'use strict';
const $=id=>document.getElementById(id),status=$('fpStatus'),card=$('fpCard'),online=$('onlineNodes');
let map,layer,programs=[],venues=[],mode='nyc',current=null,expanded=null,markers=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
function dateKey(p){const raw=p.date||'',year=(raw.match(/20\d{2}/)||[p.year||0])[0],months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],month=months.findIndex(m=>raw.toLowerCase().includes(m))+1,day=(raw.match(/\b(\d{1,2})(?:[–\-,\s]|$)/)||[0,1])[1];return Number(year)*10000+month*100+Number(day);}
function isOnline(p){return p.mapMode==='online'||p.section==='Virtual'||/online|virtual|spatial|new art city/i.test(p.venue||'');}
function venue(p){return venues.find(v=>v.id===p.venueId)||venues.find(v=>(v.aliases||[]).includes(p.venue));}
const patterns={Exhibition:/exhibition/i,Performance:/performance/i,Educational:/talk|workshop|panel|lecture|educational/i,Community:/community/i};
function matches(p){const rule=patterns[$('fpCategory').value];return !rule||(p.tags||[]).some(t=>rule.test(t));}
function relevant(){return programs.filter(matches).filter(p=>mode==='online'?isOnline(p):!isOnline(p)&&(mode==='world'||venue(p)?.city==='NYC'));}
function animateView(center,zoom){if(!map)return;map.setView(center,zoom,{animate:!reduced});}
function highlight(){markers.forEach(({marker,project,group})=>{const el=marker.getElement();if(el){el.classList.toggle('selected',project?current===project:group.includes(current));el.setAttribute('aria-pressed',String(project?current===project:group.includes(current)));}});online.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.slug===current?.slug)));}
function show(p){if(!p)return;current=p;card.replaceChildren();
const candidates=[p.cover,...(Array.isArray(p.images)?p.images:[])].map(x=>typeof x==='string'?{src:x}:x).filter(x=>x&&x.src&&x.type!=='video'&&!/\.(mp4|mov|webm)(?:[?#]|$)/i.test(x.src));
if(candidates.length){
 const img=make('img','fp-cover');img.decoding='async';let n=0;
 const load=()=>{const photo=candidates[n++];if(!photo){img.remove();return;}img.alt=photo.alt||p.title;img.src=photo.src;};
 img.onerror=load;card.append(img);load();
}
const v=venue(p);card.append(make('div','fp-place',isOnline(p)?'Online / '+(p.venue||''):v?.name||p.venue||''),make('h3','',p.title));const tags=make('div','fp-tags');(p.tags||[]).forEach(t=>tags.append(make('span','',t)));card.append(tags);const dl=make('dl','fp-meta');[['When',p.date||p.year],['Where',p.venue],['Artists',(p.artists||[]).map(a=>a.name).join(' · ')]].forEach(([k,value])=>{if(value)dl.append(make('dt','',k),make('dd','',value));});card.append(dl);const intro=make('div','fp-intro');(p.mapIntroduction||p.introduction||p.description||'').split(/\n\s*\n/).filter(Boolean).forEach(text=>intro.append(make('p','',text)));card.append(intro);const link=make('a','fp-read','Read more ↗');link.href='program-item.html?slug='+encodeURIComponent(p.slug);card.append(link);const list=isOnline(p)?programs.filter(isOnline).filter(matches):relevant(),i=list.indexOf(p);[['fpPrevious',i-1],['fpNext',i+1]].forEach(([id,index])=>{const b=$(id),target=list[index];b.disabled=!target;b.querySelector('strong').textContent=target?.title||'';b.onclick=()=>{if(target)select(target,true);};});card.scrollTop=0;highlight();}
function select(p,pan){show(p);const v=venue(p);if(v&&pan&&mode!=='online'){expanded=v.id;draw();animateView(v.coordinates,Math.max(map?.getZoom()||0,14));}}
function icon(p,count){const wrap=make('div','fp-dot'+(count>1?' stacked':''),String(p.footprintNumber||'•').padStart(2,'0'));if(count>1)wrap.append(make('small','',String(count)));return L.divIcon({className:'fp-marker',html:wrap.outerHTML,iconSize:[34,34],iconAnchor:[17,17]});}
function draw(){if(!layer)return;layer.clearLayers();markers=[];if(mode==='online'){highlight();return;}if(mode==='world'){
  for(const [city,coord] of [['London',[51.5074,-0.1278]],['Tokyo',[35.6762,139.6503]]]){
    if(programs.some(p=>!isOnline(p)&&venue(p)?.city?.toLowerCase()===city.toLowerCase()))continue;
    const label=city+' / '+(city==='London'?'United Kingdom':'Japan')+' · Unlocking soon';
    const dot=make('div','fp-dot fp-pending-dot','0');
    L.marker(coord,{icon:L.divIcon({className:'fp-marker',html:dot.outerHTML,iconSize:[34,34],iconAnchor:[17,17]}),interactive:false,keyboard:false}).addTo(layer).bindTooltip(label,{className:'fp-tooltip',permanent:true,direction:'auto',offset:[15,0]});
  }
}if(mode==='world'&&map.getZoom()<8){const cities=new Map();relevant().forEach(p=>{const v=venue(p);if(!v)return;const key=v.city+' / '+v.country;if(!cities.has(key))cities.set(key,{v,items:[]});cities.get(key).items.push(p);});cities.forEach(({v,items},city)=>{const dot=make('div','fp-dot',String(items.length));const marker=L.marker(v.coordinates,{icon:L.divIcon({className:'fp-marker',html:dot.outerHTML,iconSize:[34,34],iconAnchor:[17,17]}),title:city}).addTo(layer);marker.bindTooltip(city+(items.length>1?' · '+items.length+' projects':''),{className:'fp-tooltip',permanent:true,direction:'right',offset:[15,0]});marker.on('click',()=>{animateView(v.coordinates,12);draw();});markers.push({marker,group:items});});highlight();return;}const groups=new Map();relevant().forEach(p=>{const v=venue(p);if(!v||!Array.isArray(v.coordinates))return;if(!groups.has(v.id))groups.set(v.id,{v,items:[]});groups.get(v.id).items.push(p);});groups.forEach(({v,items})=>{const opened=expanded===v.id&&items.length>1;const anchor=map.latLngToLayerPoint(v.coordinates);(opened?items:[items[0]]).forEach((p,i)=>{const coord=opened?map.layerPointToLatLng(L.point(anchor.x+(i-(items.length-1)/2)*54,anchor.y-45)):v.coordinates;if(opened)L.polyline([v.coordinates,coord],{color:'#a6b55a',weight:1,interactive:false}).addTo(layer);const marker=L.marker(coord,{icon:icon(p,opened?1:items.length),keyboard:true,title:v.name,riseOnHover:true}).addTo(layer);marker.bindTooltip(v.name,{className:'fp-tooltip',direction:'top',offset:[0,-18]});marker.on('mouseover',()=>{if(current!==p)show(p);if(!opened && items.length>1 && matchMedia('(any-hover: hover)').matches){expanded=v.id;draw();}});marker.on('click',()=>{expanded=v.id;show(p);draw();});const element=marker.getElement();element.setAttribute('role','button');element.setAttribute('aria-label',v.name+'. Preview '+p.title);element.addEventListener('focus',()=>{if(current!==p)show(p);});element.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();expanded=v.id;show(p);draw();}});markers.push({marker,project:opened?p:null,group:items});});});highlight();}
function reset(){if(!map)return;expanded=null;map.setMaxBounds(null);map.setMinZoom(0);if(mode==='world'){const worldPoints=[[51.5074,-0.1278],[35.6762,139.6503],...relevant().map(venue).filter(Boolean).map(v=>v.coordinates)];map.fitBounds(worldPoints,{padding:[50,65],maxZoom:4,animate:!reduced});}else{const points=programs.filter(p=>!isOnline(p)).map(venue).filter(v=>v?.city==='NYC').map(v=>v.coordinates);if(points.length)map.fitBounds(points,{padding:[60,75],maxZoom:12,animate:false});else map.setView([40.715,-73.975],12,{animate:false});map.setMinZoom(map.getZoom());map.setMaxBounds(map.getBounds());}draw();}
function switchMode(next){mode=next;if(map&&mode!=='nyc'){map.setMaxBounds(null);map.setMinZoom(0);}expanded=null;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));const virtual=programs.filter(isOnline).filter(matches);
online.querySelectorAll('button').forEach(b=>b.hidden=!virtual.some(p=>p.slug===b.dataset.slug));online.hidden=!virtual.length;$('footprintsMap').style.visibility='visible';document.querySelector('.fp-map-tools').hidden=mode==='online';const physicalList=relevant(),list=physicalList.length?physicalList:virtual;status.textContent=mode==='online'?'Online / Shared worlds, without a fixed address':mode==='world'?'World / Select a stop to explore':'Hover to preview. Click to select. Drag to explore.';if(list.length)show(list[0]);else{current=null;for(const b of document.querySelectorAll('.fp-navigation strong'))b.textContent='';card.replaceChildren(make('p','','No projects in this view yet.'));['fpPrevious','fpNext'].forEach(id=>$(id).disabled=true);}if(mode!=='online')reset();else draw();}
function init(){const physical=programs.filter(p=>!isOnline(p)),unmapped=physical.filter(p=>!venue(p));if(unmapped.length){const box=$('fpUnmapped');box.hidden=false;box.append(make('span','','More programs: '));unmapped.forEach(p=>{const b=make('button','',p.title);b.type='button';b.onclick=()=>{mode='world';switchMode(mode);show(p);};box.append(b);});}
$('fpCategory').onchange=()=>switchMode(mode);
programs.filter(isOnline).forEach(p=>{const b=make('button');b.type='button';b.dataset.slug=p.slug;b.setAttribute('aria-label','Online: '+p.title);b.append(make('span','fp-dot',String(p.footprintNumber).padStart(2,'0')),make('span','',p.title));b.setAttribute('aria-pressed','false');b.onmouseenter=()=>{if(current!==p)show(p);};b.onfocus=()=>{if(current!==p)show(p);};b.onclick=()=>show(p);online.append(b);});
if(window.L){map=L.map('footprintsMap',{zoomControl:false,scrollWheelZoom:false,bounceAtZoomLimits:false,maxBoundsViscosity:1,zoomSnap:0,minZoom:0,maxZoom:18,worldCopyJump:true}).setView([40.715,-73.975],12);layer=L.layerGroup().addTo(map);(async()=>{
try {
 const res=await fetch(UAAD_TILEJSON); if(!res.ok) throw Error();
 const data=await res.json(), template=data.tiles?.[0]; if(!template || /\.(pbf|mvt)(\?|$)/i.test(template)) throw Error();
 const url=new URL(template,UAAD_TILEJSON);
 if(url.hostname==='api.maptiler.com' && !url.searchParams.has('key')) url.searchParams.set('key', new URL(UAAD_TILEJSON).searchParams.get('key'));
 const tiles=L.tileLayer(url.href.replace(/%7B/gi,'{').replace(/%7D/gi,'}'),{maxNativeZoom:data.maxzoom??19,referrerPolicy:'strict-origin-when-cross-origin',attribution:data.attribution||'© MapTiler · © OpenStreetMap contributors'}).addTo(map); tiles.once('tileerror',()=>{status.textContent='Map background unavailable. Project markers remain interactive.';});
} catch {status.textContent='Map background unavailable. Project markers remain interactive.';}
})();map.on('zoomend',draw);map.on('click',()=>{expanded=null;draw();});map.getContainer().addEventListener('keydown',e=>{if(e.key==='Escape'){expanded=null;draw();}});// Trackpad input is scoped to the geographic map.
const surface=map.getContainer();
let safariPinch=null;
surface.addEventListener('gesturestart',e=>{
  e.preventDefault();
  // A trackpad gesture need not expose a reliable touch count.
  safariPinch={zoom:map.getZoom(),at:map.mouseEventToContainerPoint(e)};
},{passive:false});
surface.addEventListener('gesturechange',e=>{
  e.preventDefault();
  if(safariPinch && e.scale>0)map.setZoomAround(safariPinch.at,safariPinch.zoom+Math.log2(e.scale),{animate:false});
},{passive:false});
surface.addEventListener('gestureend',e=>{e.preventDefault();safariPinch=null;},{passive:false});
surface.addEventListener('wheel',e=>{
  if(!e.ctrlKey && !e.metaKey)return;
  e.preventDefault();
  if(safariPinch)return;
  const unit=e.deltaMode===1?16:e.deltaMode===2?surface.clientHeight:1;
  if(e.ctrlKey || e.metaKey){
    map.setZoomAround(map.mouseEventToContainerPoint(e),map.getZoom()-e.deltaY*unit*0.012,{animate:false});
  }
},{passive:false});
new ResizeObserver(()=>map.invalidateSize()).observe($('footprintsMap'));$('fpZoomIn').onclick=()=>map.zoomIn();$('fpZoomOut').onclick=()=>map.zoomOut();$('fpReset').onclick=reset;
}else{status.textContent='Map could not load. Browse programs using Previous / Next or the full archive.';}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));switchMode('nyc');if(!window.L)status.textContent='Map could not load. Browse programs using Previous / Next or the full archive.';}
Promise.all([fetch('programs.json').then(r=>{if(!r.ok)throw Error();return r.json();}),fetch('venues.json').then(r=>{if(!r.ok)throw Error();return r.json();})]).then(([p,v])=>{venues=v;programs=p.filter(x=>x.title&&x.section!=='Publications'&&x.showOnHome!==false).sort((a,b)=>dateKey(b)-dateKey(a));if(!programs.length){status.textContent='No programs yet.';return;}init();}).catch(()=>{status.textContent='Could not load programs. Please refresh or explore the full archive.';card.append(make('p','','Keep programs.json and venues.json beside index.html. Preview through a local server or GitHub Pages.'));});
})();
