// Menú: blanco sobre el mar, azul sobre fondos claros
(function(){
  const m=document.querySelector('.menu'), v=document.querySelector('.velo-menu'); if(!m)return;
  function ver(){m.style.visibility='hidden';v&&(v.style.visibility='hidden');
    const el=document.elementFromPoint(innerWidth/2,60);
    m.style.visibility='';v&&(v.style.visibility='');
    const claro=!!(el&&el.closest('.claro, .frase'));
    m.classList.toggle('sobre-claro',claro); v&&v.classList.toggle('claro-on',claro);}
  addEventListener('scroll',ver,{passive:true});addEventListener('resize',ver);addEventListener('load',ver);ver();
})();

// Portada: aparece el título al cargar
requestAnimationFrame(()=>{const p=document.querySelector('.portada');p&&p.classList.add('lista')});

// Aparecer al bajar
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ver');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.aparece').forEach(el=>io.observe(el));

// Título letra por letra
document.querySelectorAll('.letras').forEach(h=>{let k=0;
  h.innerHTML=h.textContent.trim().split(' ').map(w=>'<span style="white-space:nowrap;opacity:1;transform:none">'+w.split('').map(c=>`<span style="transition-delay:${(k++)*35}ms">${c}</span>`).join('')+'</span>').join(' ');
  io.observe(h);});

// Sección que se mueve de costado
(function(){
  const sec=document.getElementById('como'), riel=document.getElementById('riel'); if(!sec)return;
  const ancho=()=>matchMedia('(min-width:881px)').matches;
  function medir(){ if(!ancho()){sec.style.height='';riel.style.transform='';return}
    sec.style.height=(riel.scrollWidth-innerWidth+innerHeight)+'px'; mover(); }
  function mover(){ if(!ancho())return; const r=sec.getBoundingClientRect(), max=riel.scrollWidth-innerWidth;
    const p=Math.min(1,Math.max(0,-r.top/(sec.offsetHeight-innerHeight))); riel.style.transform=`translateX(${-p*max}px)`;
    riel.querySelectorAll('.paso .foto > *').forEach(f=>{const b=f.getBoundingClientRect();const c=(b.left+b.width/2-innerWidth/2)/innerWidth;f.style.transform=`scale(1.08) translateX(${c*-60}px)`}); }
  addEventListener('scroll',mover,{passive:true}); addEventListener('resize',medir); addEventListener('load',medir); medir();
})();

// Cierre: leve movimiento del mar
(function(){const c=document.getElementById('capa1'); if(!c)return; const f=c.parentElement;
  addEventListener('scroll',()=>{const r=f.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)c.style.transform=`translateY(${r.top*-.15}px) scale(1.1)`},{passive:true});})();

// Videos: pausar fuera de pantalla
const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){v.play().catch(()=>{})}else v.pause()}),{threshold:0});
document.querySelectorAll('video').forEach(v=>vio.observe(v));

// Mitos: dar vuelta la tarjeta
document.querySelectorAll('.mito').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('dado')));

// Historias: flechas
document.querySelectorAll('[data-riel]').forEach(b=>b.addEventListener('click',()=>{
  const r=document.querySelector(b.dataset.riel); r.scrollBy({left:(b.dataset.dir==='1'?1:-1)*380,behavior:'smooth'});}));

// Test "¿Qué tipo de inversor sos?"
(function(){
  const el=document.getElementById('quiz'); if(!el)return;
  const LINK_ASESOR='https://linktr.ee/Sailing.reunion', LINK_CUENTA='https://micuenta.sailinginversiones.com/manager/70';
  const Q=[
    {t:'Si mañana tus ahorros bajan un 10%, ¿qué hacés?',o:['Me pongo nervioso y quiero salir','Espero tranquilo a que se recupere','Aprovecho para comprar más']},
    {t:'¿Para cuándo vas a necesitar esta plata?',o:['En menos de un año','Dentro de 1 a 3 años','En más de 3 años, no tengo apuro']},
    {t:'¿Qué te importa más?',o:['Dormir tranquilo, aunque gane poco','Un equilibrio entre seguridad y crecimiento','Que crezca lo más posible, aunque se mueva']},
    {t:'¿Cuánto sabés de inversiones?',o:['Nada, recién empiezo','Algo: plazo fijo, dólares, alguna app','Bastante: ya invertí en la bolsa']}];
  const R=[
    {n:'Cuidadoso',d:'Priorizás la tranquilidad. Te sentís mejor sabiendo que tu plata está cuidada, aunque crezca de a poco. Y está perfecto: lo importante es invertir sin perder el sueño.',c:'Opciones de bajo riesgo y que se pueden retirar rápido: fondos que rinden día a día, cauciones y bonos de corto plazo.'},
    {n:'Equilibrado',d:'Buscás equilibrio: que tu plata crezca, pero sin sobresaltos. Aceptás algo de movimiento si sabés hacia dónde vas.',c:'Una combinación de bonos y fondos para estabilidad, con una parte en acciones o CEDEARs para sumar crecimiento.'},
    {n:'Arriesgado',d:'Pensás a largo plazo y sabés que el mercado sube y baja. Te bancás los vaivenes porque tenés claro tu objetivo.',c:'Más peso en acciones y CEDEARs de empresas locales y del mundo, con una parte en instrumentos estables para equilibrar.'}];
  let paso=0, resp=[];
  function pintar(){
    if(paso<Q.length){const q=Q[paso];
      el.innerHTML=`<div class="top"><span>Pregunta ${paso+1} de ${Q.length}</span>${paso?'<button type="button" data-volver>← Volver</button>':''}</div>
      <div class="barra"><i style="width:${paso/Q.length*100}%"></i></div><h3>${q.t}</h3>`+
      q.o.map((o,i)=>`<button type="button" class="op" data-i="${i}"><b>${'ABC'[i]}</b><span>${o}</span></button>`).join('');
      requestAnimationFrame(()=>requestAnimationFrame(()=>{el.querySelector('.barra i').style.width=((paso+.5)/Q.length*100)+'%'}));return;}
    const tot=resp.reduce((a,b)=>a+b+1,0), i=tot<=6?0:tot<=9?1:2, r=R[i];
    el.innerHTML=`<div class="res"><span class="etiqueta">Tu resultado</span><h3 style="margin-top:14px">Tu perfil: <em>${r.n}</em></h3>
      <div class="medidor">${[0,1,2].map(k=>`<i class="${k===i?'on':''}"></i>`).join('')}</div><div class="etq"><span>Cuidadoso</span><span>Equilibrado</span><span>Arriesgado</span></div>
      <p>${r.d}</p><p><strong>Suele tener en su cartera:</strong> ${r.c}</p>
      <div class="botones" style="margin-top:24px"><a class="btn btn-azul" href="${LINK_ASESOR}" target="_blank" rel="noopener">Hablalo con un asesor</a><a class="btn btn-borde" href="${LINK_CUENTA}" target="_blank" rel="noopener">Abrí tu cuenta</a></div>
      <p class="aviso-q">Es una orientación general, no una recomendación de inversión. Tu asesor arma la estrategia con vos. <button type="button" data-otra style="background:none;border:0;color:var(--azul);cursor:pointer;font:inherit;text-decoration:underline">Hacerlo de nuevo</button></p></div>`;}
  el.addEventListener('click',e=>{const o=e.target.closest('.op');
    if(o){resp[paso]=+o.dataset.i;paso++;setTimeout(pintar,180);return}
    if(e.target.closest('[data-volver]')){paso--;pintar();return}
    if(e.target.closest('[data-otra]')){paso=0;resp=[];pintar()}});
  pintar();
})();

// Nosotros: línea de tiempo con el scroll
(function(){
  const l=document.querySelector('.hist .linea'); if(!l)return;
  const anios=[...l.querySelectorAll('.anios div')], txt=[...l.querySelectorAll('.textos p')], pts=[...l.querySelectorAll('.puntos i')], n=txt.length;
  function act(){const r=l.getBoundingClientRect(), p=Math.min(.999,Math.max(0,-r.top/(l.offsetHeight-innerHeight))), k=Math.floor(p*n);
    anios.forEach((a,i)=>{a.style.transform=`translateY(${(i-k)*100}%)`;a.style.opacity=i===k?1:0});
    txt.forEach((t,i)=>t.classList.toggle('on',i===k)); pts.forEach((t,i)=>t.classList.toggle('on',i===k));}
  addEventListener('scroll',act,{passive:true}); act();
})();

// Menú celular
(function(){const b=document.querySelector('.burger'),p=document.querySelector('.panel-cel');if(!b||!p)return;
  b.addEventListener('click',()=>p.classList.add('abierto'));
  p.addEventListener('click',e=>{if(e.target.closest('.cerrar')||e.target.closest('a'))p.classList.remove('abierto')});})();

// Inicio: los 4 ítems aparecen de a uno con el scroll
(function(){const s=document.querySelector('.creemos2');if(!s)return;
  const it=[...s.querySelectorAll('.vidrio')],c=[...s.querySelectorAll('.contador i')];
  function act(){const r=s.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(s.offsetHeight-innerHeight)));
    const n=Math.min(it.length,Math.floor(p*(it.length+.6)+.35));
    it.forEach((v,i)=>v.classList.toggle('on',i<n));c.forEach((v,i)=>v.classList.toggle('on',i<n));}
  addEventListener('scroll',act,{passive:true});addEventListener('resize',act);act();})();

// Nosotros: historia con años y flechas
(function(){const l=document.querySelector('.hist3 .linea');if(!l)return;
  const an=[...l.querySelectorAll('.anio')],tx=[...l.querySelectorAll('.textos3 p')],n=tx.length,up=l.querySelector('[data-hist="-1"]'),dn=l.querySelector('[data-hist="1"]');let k=0;
  function pintar(){an.forEach((a,i)=>{const d=i-k;a.style.transform=`translateY(calc(-50% + ${d*86}px)) scale(${d?0.62:1})`;a.style.opacity=d===0?1:(Math.abs(d)===1?.28:0)});
    tx.forEach((t,i)=>t.classList.toggle('on',i===k));up.disabled=k===0;dn.disabled=k===n-1;}
  function act(){const r=l.getBoundingClientRect(),p=Math.min(.999,Math.max(0,-r.top/(l.offsetHeight-innerHeight)));const nk=Math.floor(p*n);if(nk!==k){k=nk;pintar()}}
  function ir(d){const t=Math.max(0,Math.min(n-1,k+d));const y=l.getBoundingClientRect().top+scrollY+(l.offsetHeight-innerHeight)*((t+.5)/n);scrollTo({top:y,behavior:'smooth'})}
  up.addEventListener('click',()=>ir(-1));dn.addEventListener('click',()=>ir(1));
  addEventListener('scroll',act,{passive:true});pintar();act();})();

// Cerrar el desplegable de Servicios al elegir una opción
document.querySelectorAll(".tiene-sub").forEach(t=>{t.addEventListener("click",e=>{if(e.target.closest(".mega a"))t.classList.add("cerrar")});t.addEventListener("mouseleave",()=>t.classList.remove("cerrar"))});
