(function () {
  'use strict';
  const launch = document.getElementById('genetic-tour-launch');
  if (!launch) return;
  const steps = [
    {selector:'.edition-workspace-header',title:'Bienvenido a la edición genética',text:'Esta edición permite estudiar las fases de escritura y revisión de la comedia. Puedes cerrar la visita en cualquier momento.'},
    {selector:'#reconstruction-select',title:'Explora las fases del texto',text:'Selecciona «Génesis del texto» o una fase de elaboración para examinar los distintos estados de la obra.'},
    {selector:'.toolbar-layers',title:'Filtra las intervenciones',text:'Utiliza los controles A1, A2 y B para distinguir las correcciones y las intervenciones de otras manos.'},
    {selector:'#facsimile-pane',title:'Consulta el manuscrito',text:'Contrasta las lecturas con el facsímil; puedes cambiar de folio y ampliar la imagen.'},
    {selector:'#genetic-pane',title:'Lee el texto genético',text:'Aquí se representan las intervenciones. Las notas y las marcas del texto ofrecen información adicional.'},
    {selector:'.toolbar-tools',title:'Encuentra más herramientas',text:'Accede a la transcripción diplomática, la búsqueda, la navegación por versos y la sincronización.'}
  ];
  let index=-1,overlay,panel,heading,description,counter,back,next,previousFocus;
  function targetAt(n){return document.querySelector(steps[n].selector);}
  function position(){
    if(!overlay || overlay.hidden || index<0)return;
    document.querySelectorAll('.genetic-tour-focus').forEach(el=>el.classList.remove('genetic-tour-focus'));
    const target=targetAt(index);
    if(!target)return;
    target.classList.add('genetic-tour-focus');
    const r=target.getBoundingClientRect();
    const width=Math.min(370,window.innerWidth-32);
    panel.style.width=width+'px';
    const below=window.innerHeight-r.bottom>260;
    panel.style.top=Math.max(12,below?Math.min(r.bottom+14,window.innerHeight-245):r.top-245)+'px';
    panel.style.left=Math.max(12,Math.min(window.innerWidth-width-12,r.left))+'px';
  }
  function close(){
    if(!overlay)return;
    overlay.hidden=true;
    document.querySelectorAll('.genetic-tour-focus').forEach(el=>el.classList.remove('genetic-tour-focus'));
    document.body.classList.remove('genetic-tour-active');
    try{localStorage.setItem('genetic-tour-seen','1')}catch(e){}
    index=-1;
    (previousFocus&&previousFocus.isConnected?previousFocus:launch).focus();
  }
  function show(n){
    if(n<0||n>=steps.length)return;
    index=n;
    const step=steps[n];
    heading.textContent=step.title;description.textContent=step.text;
    counter.textContent='Paso '+(n+1)+' de '+steps.length;
    back.disabled=n===0;
    next.textContent=n===steps.length-1?'Terminar':'Siguiente';
    const target=targetAt(n);
    if(target)target.scrollIntoView({block:'nearest',behavior:'instant'});
    position();next.focus();
  }
  function build(){
    overlay=document.createElement('div');
    overlay.className='genetic-tour-overlay';overlay.hidden=true;
    overlay.innerHTML='<div class="genetic-tour-shade"></div><section class="genetic-tour-dialog" role="dialog" aria-modal="true" aria-labelledby="genetic-tour-heading" aria-describedby="genetic-tour-description"><div class="genetic-tour-top"><span class="genetic-tour-counter" aria-live="polite"></span><button class="genetic-tour-close" type="button" aria-label="Cerrar visita guiada">×</button></div><h2 id="genetic-tour-heading"></h2><p id="genetic-tour-description"></p><div class="genetic-tour-actions"><button class="genetic-tour-back" type="button">Anterior</button><button class="genetic-tour-next" type="button">Siguiente</button></div></section>';
    document.body.appendChild(overlay);
    panel=overlay.querySelector('.genetic-tour-dialog');
    heading=overlay.querySelector('h2');description=overlay.querySelector('p');
    counter=overlay.querySelector('.genetic-tour-counter');
    back=overlay.querySelector('.genetic-tour-back');next=overlay.querySelector('.genetic-tour-next');
    overlay.querySelector('.genetic-tour-close').addEventListener('click',close);
    back.addEventListener('click',()=>show(index-1));
    next.addEventListener('click',()=>index===steps.length-1?close():show(index+1));
    document.addEventListener('keydown',event=>{
      if(overlay.hidden)return;
      if(event.key==='Escape'){event.preventDefault();close();}
      if(event.key==='Tab'){
        const focusables=Array.from(panel.querySelectorAll('button:not([disabled])'));
        const first=focusables[0],last=focusables[focusables.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    });
    window.addEventListener('resize',position);
  }
  function open(){if(!overlay)build();previousFocus=document.activeElement;overlay.hidden=false;document.body.classList.add('genetic-tour-active');show(0);}
  launch.addEventListener('click',open);
  try{if(!localStorage.getItem('genetic-tour-seen'))window.setTimeout(()=>{if(!document.hidden)open();},1100)}catch(e){}
})();