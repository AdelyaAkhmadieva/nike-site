'use strict';
document.documentElement.classList.add('js');
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const variants=[
{id:'pink',group:'pink',name:'Pink energy',image:'shoe.png',filter:'none',label:'PINK ENERGY',angle:'-15deg',scale:1.119158,offset:'0%',x:'-7.213885%',y:'.563881%'},
{id:'lime',group:'lime',name:'Green pulse',image:'shoe-green.png',filter:'none',label:'GREEN PULSE',angle:'0deg',scale:.981919,offset:'0%',x:'-.110701%',y:'-3.154982%'},
{id:'blue',group:'blue',name:'Black edition',image:'shoe-black.png',filter:'none',label:'BLACK EDITION',angle:'0deg',scale:1.090574,offset:'0%',x:'.061475%',y:'-3.75%'},
{id:'ice',group:'lime',name:'Ice blue',image:'shoe-green.png',filter:'hue-rotate(95deg)',label:'COLOR CONCEPT',angle:'0deg',scale:.981919,offset:'0%',x:'-.110701%',y:'-3.154982%'},
{id:'sunset',group:'pink',name:'Sunset orange',image:'shoe.png',filter:'hue-rotate(45deg) saturate(.85)',label:'COLOR CONCEPT',angle:'-15deg',scale:1.119158,offset:'0%',x:'-7.213885%',y:'.563881%'}];
let heroIndex=0,heroRequest=0;
async function showHero(index){
 heroIndex=(index+variants.length)%variants.length;
 const request=++heroRequest,v=variants[heroIndex];
 $('#hero-name').textContent=v.name;$('#hero-index').textContent=String(heroIndex+1).padStart(2,'0')+' / '+String(variants.length).padStart(2,'0');
 $$('[data-hero]').forEach((b,i)=>{b.classList.toggle('active',i===heroIndex);b.setAttribute('aria-pressed',String(i===heroIndex))});
 const img=new Image();img.src='assets/'+v.image;img.alt='Nike Zoom — '+v.name;img.className='hero-shoe hero-entering';
 img.style.setProperty('--shoe-filter',v.filter);img.style.setProperty('--shoe-angle',v.angle);img.style.setProperty('--shoe-scale',v.scale);img.style.setProperty('--shoe-offset',v.offset);img.style.setProperty('--pose-x',v.x||'0%');img.style.setProperty('--pose-y',v.y||'0%');
 try{await img.decode()}catch{ return }
 if(request!==heroRequest)return;
 const old=$$('.hero-product .hero-shoe');$('.hero-product').append(img);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{if(request!==heroRequest){img.remove();return}img.classList.remove('hero-entering');old.forEach(el=>el.classList.add('hero-leaving'));setTimeout(()=>old.forEach(el=>el.remove()),850)}));
}

let selected=variants[0],size=null,cart=[];
try{const saved=JSON.parse(localStorage.getItem('zoom-cart')||'[]');if(Array.isArray(saved))cart=saved.filter(i=>variants.some(v=>v.id===i.color)&&[38,39,40,41,42,43,44,45].includes(i.size)).slice(0,30)}catch{}
function save(){try{localStorage.setItem('zoom-cart',JSON.stringify(cart))}catch{}$('#cart-count').textContent=cart.length}
function notify(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#toast').classList.remove('show'),3000)}
function renderProducts(filter='all'){$('#products').innerHTML=variants.filter(v=>filter==='all'||v.group===filter).map(v=>`<article class="product"><button class="product-art" data-product="${v.id}" aria-label="Выбрать Nike Zoom ${v.name}"><img src="assets/${v.image}" alt="Nike Zoom ${v.name}" style="--shoe-filter:${v.filter};--shoe-angle:${v.angle};--shoe-scale:${v.scale};--shoe-offset:${v.offset};--pose-x:${v.x||'0%'};--pose-y:${v.y||'0%'}" loading="lazy"><span>${v.label}</span></button><div class="product-info"><div><h3>Nike Zoom</h3><p>${v.name} · 18 990 ₽</p></div><button data-product="${v.id}" aria-label="Добавить ${v.name}">↗</button></div></article>`).join('');$$('[data-product]').forEach(b=>b.onclick=()=>openProduct(b.dataset.product))}
function openProduct(id='pink'){selected=variants.find(v=>v.id===id)||variants[0];size=null;$('#detail-color').textContent=selected.name;$('#detail-image').src='assets/'+selected.image;$('#detail-image').style.setProperty('--shoe-filter',selected.filter);$('#detail-image').style.setProperty('--shoe-scale',selected.scale);$('#detail-image').style.setProperty('--shoe-offset',selected.offset);$('#detail-image').style.setProperty('--shoe-angle',selected.angle);$('#detail-image').style.setProperty('--pose-x',selected.x||'0%');$('#detail-image').style.setProperty('--pose-y',selected.y||'0%');$('#size-error').textContent='';$$('.sizes button').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});$('#product-dialog').showModal()}
$('#sizes').innerHTML=[38,39,40,41,42,43,44,45].map(n=>`<button type="button" aria-pressed="false" data-size="${n}">${n}</button>`).join('');
$$('[data-size]').forEach(b=>b.onclick=()=>{size=Number(b.dataset.size);$$('[data-size]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});$('#size-error').textContent=''});
$$('[data-buy]').forEach(b=>b.onclick=()=>openProduct(variants[heroIndex].id));
$('#add-cart').onclick=()=>{if(!size){$('#size-error').textContent='Сначала выбери размер.';return}cart.push({color:selected.id,size});save();$('#product-dialog').close();notify(`${selected.name}, EU ${size} — в корзине`)};
$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$$('dialog').forEach(d=>d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close()}));
function renderCart(){$('#cart-items').innerHTML=cart.length?cart.map((i,n)=>{const v=variants.find(v=>v.id===i.color);return `<div class="cart-item"><img src="assets/${v.image}" alt="${v.name}" style="--shoe-filter:${v.filter};--shoe-angle:${v.angle};--shoe-scale:${v.scale};--shoe-offset:${v.offset};--pose-x:${v.x||'0%'};--pose-y:${v.y||'0%'}"><p><strong>Nike Zoom</strong><br>${v.name} · EU ${i.size}<br>18 990 ₽</p><button data-remove="${n}" aria-label="Удалить ${v.name}, размер ${i.size}">×</button></div>`}).join(''):'<p class="demo-note">Пока пусто. Найди свою пару в коллекции.</p>';$('#cart-total').textContent=(cart.length*18990).toLocaleString('ru-RU')+' ₽';$('#checkout').disabled=!cart.length;$('#checkout').style.opacity=cart.length?'1':'.4';$$('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(Number(b.dataset.remove),1);save();renderCart()})}
$('#cart-open').onclick=()=>{renderCart();$('#cart-dialog').showModal()};$('#continue').onclick=()=>$('#cart-dialog').close();$('#checkout').onclick=()=>{if(!cart.length)return;cart=[];save();renderCart();$('#cart-dialog').close();notify('Демо-заказ оформлен. Оплата не списывалась.')};
$$('[data-filter]').forEach(b=>b.onclick=()=>{$$('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderProducts(b.dataset.filter)});
let shot=0;
const shots=[
 {title:'МЯГКОЕ ПРИЗЕМЛЕНИЕ. МОЩНЫЙ ОТКЛИК.',name:'прыжок в лужу',className:'splash-view'},
 {title:'АМОРТИЗАЦИЯ. В КАЖДОМ ШАГЕ.',name:'подошва',className:'zoom-sole'},
 {title:'ЗНАК ДВИЖЕНИЯ.',name:'логотип Nike',className:'zoom-logo'},
 {title:'ТЕКСТУРА. ЛЁГКОСТЬ. ХАРАКТЕР.',name:'ткань верха',className:'zoom-fabric'}
];
function showShot(delta=0){
 shot=(shot+delta+shots.length)%shots.length;const detail=shots[shot];
 $('#gallery').classList.remove('splash-view','zoom-sole','zoom-logo','zoom-fabric');$('#gallery').classList.add(detail.className);
 $('#shot-index').textContent=String(shot+1).padStart(2,'0')+' / 04';$('#shot-title').textContent=detail.title;$('#shot-image').alt='Nike Zoom — '+detail.name+' крупным планом';
}
$('#splash-drops').innerHTML=Array.from({length:20},(_,i)=>{const side=i%2?1:-1;const distance=70+(i%10)*18;return `<i class="splash-drop" style="--dx:${side*distance}px;--dy:${-45-(i%7)*17}px;--delay:${(i%4)*.035}s;--drop-size:${4+i%4}px"></i>`}).join('');
$('#previous').onclick=()=>showShot(-1);$('#next').onclick=()=>showShot(1);
showShot();
function setNav(id){$$('[data-nav]').forEach(a=>{const active=a.dataset.nav===id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
$$('[data-nav]').forEach(a=>a.addEventListener('click',()=>setNav(a.dataset.nav)));
if('IntersectionObserver' in window){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target)}}),{threshold:.1});$$('.reveal').forEach(e=>reveal.observe(e))}else $$('.reveal').forEach(e=>e.classList.add('visible'));
let scrollFrame;
window.addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=null;const sections=$$('main section[id]');let current='';sections.forEach(s=>{if(s.getBoundingClientRect().top<=window.innerHeight*.35)current=s.id});setNav(current)})},{passive:true});
$('#hero-dots').innerHTML=variants.map((v,i)=>`<button data-hero="${i}" aria-label="Показать ${v.name}" aria-pressed="false"></button>`).join('');
$$('[data-hero]').forEach(b=>b.onclick=()=>showHero(Number(b.dataset.hero)));
$('#hero-prev').onclick=()=>showHero(heroIndex-1);$('#hero-next').onclick=()=>showHero(heroIndex+1);
let touchStart=null;$('.hero-product').addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX},{passive:true});
$('.hero-product').addEventListener('touchend',e=>{if(touchStart===null)return;const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45)showHero(heroIndex+(delta<0?1:-1));touchStart=null},{passive:true});
showHero(0);

renderProducts();save();
