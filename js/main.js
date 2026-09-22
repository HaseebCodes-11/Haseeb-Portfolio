(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

  /* seamless marquee */
  var track=document.getElementById('track');
  if(track) track.innerHTML = track.innerHTML + track.innerHTML;

  /* scroll progress + back to top */
  var prog=document.getElementById('prog'), top=document.getElementById('totop'), ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      var h=document.documentElement.scrollHeight-window.innerHeight;
      var p=h>0 ? Math.min(1, window.scrollY/h) : 0;
      if(prog) prog.style.transform='scaleX('+p+')';
      if(top) top.classList.toggle('on', window.scrollY>700);
      ticking=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(top) top.addEventListener('click',function(){ window.scrollTo({top:0,behavior:reduce?'auto':'smooth'}); });

  /* reveal on scroll */
  var rv=[].slice.call(document.querySelectorAll('.rv'));
  if(!('IntersectionObserver' in window) || reduce){
    rv.forEach(function(el){el.classList.add('in');});
  } else {
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var sibs=[].slice.call(e.target.parentNode.children).filter(function(n){return n.classList.contains('rv');});
        var i=Math.min(sibs.indexOf(e.target),7);
        e.target.style.transitionDelay=(i>0?i*70:0)+'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    rv.forEach(function(el){io.observe(el);});
  }

  /* counters */
  function fmt(v,dec){
    if(dec) return v.toFixed(dec);
    return Math.round(v).toLocaleString('en-US');
  }
  var nums=[].slice.call(document.querySelectorAll('[data-count]'));
  function run(el){
    var target=parseFloat(el.getAttribute('data-count'));
    var dec=parseInt(el.getAttribute('data-dec')||'0',10);
    var dur=parseInt(el.getAttribute('data-dur')||'1200',10);
    if(reduce){ el.textContent=fmt(target,dec); return; }
    var t0=null;
    function tick(ts){
      if(t0===null) t0=ts;
      var p=Math.min(1,(ts-t0)/dur);
      var e=1-Math.pow(1-p,3);
      el.textContent=fmt(target*e,dec);
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ run(e.target); io2.unobserve(e.target); } });
    },{threshold:.4});
    nums.forEach(function(el){io2.observe(el);});
  } else { nums.forEach(run); }

  /* email: open the visitor's mail app, and always copy the address as a fallback */
  var toast=document.getElementById('toast'), tTimer=null;
  function say(msg){
    if(!toast) return;
    toast.textContent=msg; toast.classList.add('on');
    clearTimeout(tTimer); tTimer=setTimeout(function(){toast.classList.remove('on');},2600);
  }
  function copy(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text).catch(function(){return legacy(text);});
    }
    return legacy(text);
  }
  function legacy(text){
    try{
      var ta=document.createElement('textarea');
      ta.value=text; ta.setAttribute('readonly','');
      ta.style.cssText='position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      return Promise.resolve();
    }catch(e){ return Promise.reject(e); }
  }
  [].slice.call(document.querySelectorAll('[data-mail]')).forEach(function(a){
    a.addEventListener('click',function(ev){
      var addr=a.getAttribute('data-mail');
      copy(addr).then(function(){ say(addr+' copied'); }).catch(function(){ say(addr); });
      var opened=false;
      try{ window.location.href='mailto:'+addr; opened=true; }catch(e){}
      if(!opened) ev.preventDefault();
    });
  });

  /* work filter */
  var works=[].slice.call(document.querySelectorAll('#works .work'));
  [].slice.call(document.querySelectorAll('.fbtn')).forEach(function(btn){
    btn.addEventListener('click',function(){
      var f=btn.getAttribute('data-f');
      document.querySelectorAll('.fbtn').forEach(function(b){b.setAttribute('aria-pressed', b===btn ? 'true':'false');});
      works.forEach(function(w){
        var show = f==='all' || (w.getAttribute('data-tags')||'').indexOf(f)>-1;
        w.hidden=!show;
        if(show){ w.classList.remove('in'); void w.offsetWidth; w.classList.add('in'); }
      });
    });
  });

  /* ---- hero background: 3D perspective dot-mesh + drifting light ---- */
  var cv=document.getElementById('bg');
  if(!cv || !cv.getContext) return;
  var ctx=cv.getContext('2d');
  var W=0,H=0,dpr=1;
  var c1='rgba(47,109,246,', c2='rgba(0,191,165,', dotC='12,20,32';
  function theme(){
    var dark = document.documentElement.getAttribute('data-theme')==='dark' ||
      (document.documentElement.getAttribute('data-theme')!=='light' &&
       window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    dotC = dark ? '190,205,230' : '12,20,32';
    c1 = dark ? 'rgba(110,155,255,' : 'rgba(47,109,246,';
    c2 = dark ? 'rgba(47,224,198,' : 'rgba(0,191,165,';
  }
  theme();
  function size(){
    var r=cv.getBoundingClientRect();
    W=Math.max(320,r.width); H=Math.max(360,r.height);
    dpr=Math.min(window.devicePixelRatio||1,2);
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  size();
  window.addEventListener('resize',function(){size();theme();});
  if(window.matchMedia){
    var mq=window.matchMedia('(prefers-color-scheme: dark)');
    if(mq.addEventListener) mq.addEventListener('change',theme);
  }

  var COLS=30, ROWS=15, t=0, px=0, py=0, tx=0, ty=0;
  window.addEventListener('pointermove',function(e){
    tx=(e.clientX/Math.max(window.innerWidth,1)-.5)*2;
    ty=(e.clientY/Math.max(window.innerHeight,1)-.5)*2;
  },{passive:true});

  function blob(x,y,r,col,a){
    var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col+a+')'); g.addColorStop(1,col+'0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }

  function draw(){
    if(!reduce) t+=0.006;
    px+=(tx-px)*0.04; py+=(ty-py)*0.04;
    ctx.clearRect(0,0,W,H);

    /* drifting light */
    var R=Math.max(W,H)*0.55;
    blob(W*(0.16+Math.sin(t*0.6)*0.05)+px*22, H*(0.16+Math.cos(t*0.5)*0.06)+py*16, R, c1, 0.20);
    blob(W*(0.86+Math.cos(t*0.45)*0.05)+px*-18, H*(0.74+Math.sin(t*0.55)*0.05)+py*-14, R*0.86, c2, 0.16);

    /* 3D dot mesh, perspective from a low horizon */
    var hz=H*0.30, fov=1.0;
    for(var r=0;r<ROWS;r++){
      var zr=(r+1)/ROWS;
      var depth=Math.pow(zr,2.1);
      var yb=hz+depth*(H*1.05);
      if(yb>H+30) continue;
      var spread=0.16+depth*1.5;
      for(var c=0;c<COLS;c++){
        var u=(c/(COLS-1)-0.5);
        var wave=Math.sin(u*5.0+t*1.5+zr*4.2)*10*depth + Math.cos(zr*7.0-t*1.1)*5*depth;
        var x=W*0.5 + u*W*spread*fov + px*26*depth;
        var y=yb + wave + py*16*depth;
        if(x<-20||x>W+20) continue;
        var a=Math.max(0, (0.05+depth*0.30) * (1-Math.pow(Math.abs(u)*1.7,2.4)));
        if(a<=0.004) continue;
        var rad=0.7+depth*1.7;
        ctx.fillStyle='rgba('+dotC+','+a.toFixed(3)+')';
        ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
