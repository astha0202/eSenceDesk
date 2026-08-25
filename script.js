const nav=document.querySelector(".nav"),progress=document.querySelector(".scroll-progress"),preloader=document.querySelector(".preloader");
window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(max?scrollY/max*100:0)+"%";if(nav)nav.classList.toggle("is-scrolled",scrollY>24)});
window.addEventListener("load",()=>setTimeout(()=>preloader?.classList.add("done"),650));
document.querySelector(".menu")?.addEventListener("click",()=>{const n=document.querySelector(".nav nav");if(getComputedStyle(n).display==="none"){Object.assign(n.style,{display:"flex",position:"absolute",top:"76px",left:0,right:0,padding:"25px 6vw",background:"#08090c",flexDirection:"column",gap:"22px"})}else n.removeAttribute("style")});

/* =========================================================
   eSenceDesk — CINEMATIC 8-SHOT SHOWREEL
   Put shot1.mp4 ... shot8.mp4 beside index.html.
   The site plays them one after another without needing
   a large merged MP4.
   ========================================================= */
const showreel = document.querySelector("#showreelVideo");
const playBtn = document.querySelector("#showreelPlay");
const counter = document.querySelector("#shotCounter");
const caption = document.querySelector("#showreelCaption");
const timeline = [...document.querySelectorAll("#showreelTimeline i")];

const shots = [
  {file:"shot1.mp4", title:"LANGUAGE WITHOUT BORDERS.", sub:"Translation · Subtitling · Localization"},
  {file:"shot2.mp4", title:"ORIGINAL CONTENT", sub:"Film · Series · Streaming"},
  {file:"shot3.mp4", title:"TRANSLATION", sub:"Meaning · Tone · Context"},
  {file:"shot4.mp4", title:"SUBTITLING & CAPTIONING", sub:"Timing · Readability · Accuracy"},
  {file:"shot5.mp4", title:"ONE STORY. MANY WORLDS.", sub:"Localization for global audiences"},
  {file:"shot6.mp4", title:"HUMAN-LED. QUALITY-DRIVEN.", sub:"Review · QC · Final delivery"},
  {file:"shot7.mp4", title:"FROM ONE LANGUAGE TO THE WORLD.", sub:"Global media delivery"},
  {file:"shot8.mp4", title:"eSenceDesk", sub:"Global Language & Media Solutions"}
];

let shotIndex=0;
let playing=true;

function updateShotUI(){
  const s=shots[shotIndex];
  if(counter) counter.textContent=String(shotIndex+1).padStart(2,"0")+" / 08";
  if(caption){
    caption.classList.remove("caption-in");
    void caption.offsetWidth;
    caption.innerHTML="<span>"+s.title+"</span><strong>"+s.sub+"</strong>";
    caption.classList.add("caption-in");
  }
  timeline.forEach((el,i)=>el.classList.toggle("active",i===shotIndex));
}

function playShot(index){
  if(!showreel) return;
  shotIndex=index;
  updateShotUI();
  showreel.src=shots[shotIndex].file;
  showreel.load();
  const p=showreel.play();
  if(p && typeof p.catch==="function") p.catch(()=>{});
  playing=true;
  if(playBtn){playBtn.textContent="Ⅱ";playBtn.setAttribute("aria-label","Pause showreel");}
}

function nextShot(){
  if(!showreel) return;
  const next=(shotIndex+1)%shots.length;
  playShot(next);
}

if(showreel){
  showreel.addEventListener("ended",nextShot);

  // If a later clip hasn't been copied into the folder yet,
  // skip it gracefully instead of breaking the whole section.
  showreel.addEventListener("error",()=>{
    if(shotIndex < shots.length-1){
      shotIndex++;
      playShot(shotIndex);
    }else{
      playShot(0);
    }
  });

  showreel.addEventListener("loadeddata",()=>{
    if(playing){
      const p=showreel.play();
      if(p && typeof p.catch==="function") p.catch(()=>{});
    }
  });

  showreel.addEventListener("timeupdate",()=>{
    const d=showreel.duration;
    if(!d) return;
    const pct=(showreel.currentTime/d)*100;
    showreel.style.setProperty("--video-progress",pct+"%");
  });

  playBtn?.addEventListener("click",()=>{
    if(showreel.paused){
      showreel.play();
      playing=true;
      playBtn.textContent="Ⅱ";
      playBtn.setAttribute("aria-label","Pause showreel");
    }else{
      showreel.pause();
      playing=false;
      playBtn.textContent="▶";
      playBtn.setAttribute("aria-label","Play showreel");
    }
  });

  timeline.forEach((el,i)=>el.addEventListener("click",()=>playShot(i)));
  playShot(0);
}

/* V5 subtle reveal motion — no custom cursor */
const revealItems = document.querySelectorAll('.service,.process-grid>div,.partner-row span,.signal-strip>div');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, {threshold:.08});
  revealItems.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    el.style.transition = 'transform .7s cubic-bezier(.2,.8,.2,1)';
    io.observe(el);
  });
}

/* =========================================================
   eSenceDesk V6 — background media card
   The videos are now the background of the MEDIA LOCALIZATION card.
   ========================================================= */
(() => {
  const video = document.getElementById('mediaBgVideo');
  if (!video) return;

  const files = [
    'shot1.mp4','shot2.mp4','shot3.mp4','shot4.mp4',
    'shot5.mp4','shot6.mp4','shot7.mp4','shot8.mp4'
  ];

  const info = [
    ['MEDIA LOCALIZATION','Your story,<br><span>everywhere.</span>','Professional translation, subtitling and localization for film, series and digital media.'],
    ['ORIGINAL CONTENT','Made to travel<br><span>further.</span>','Content prepared for international audiences without losing its original voice.'],
    ['TRANSLATION','Meaning,<br><span>preserved.</span>','Context-aware language translation for global audiences and markets.'],
    ['SUBTITLING & CAPTIONING','Every word,<br><span>in sync.</span>','Precise subtitle timing, adaptation and multilingual captioning.'],
    ['LOCALIZATION','One story.<br><span>Many worlds.</span>','Language and cultural adaptation designed for international distribution.'],
    ['QUALITY CONTROL','Human-led.<br><span>quality-driven.</span>','Detailed linguistic and technical review before final delivery.'],
    ['GLOBAL DELIVERY','From one language<br><span>to the world.</span>','Production-ready localized content for audiences across markets.'],
    ['ESENCEDESK','Built for<br><span>global content.</span>','Translation · Subtitling · Localization · Media Services']
  ];

  let index = 0;
  let timer = null;
  const shotNo = document.getElementById('mediaShotNo');
  const label = document.getElementById('mediaLabel');
  const title = document.getElementById('mediaTitle');
  const desc = document.getElementById('mediaDesc');
  const play = document.getElementById('mediaPlay');
  const playIcon = play ? play.querySelector('.media-play-icon') : null;
  const fill = document.getElementById('mediaProgressFill');
  const metaShots = document.querySelectorAll('.media-card-meta div');

  metaShots.forEach(item => {
    item.addEventListener('click', () => {
      const shot = Number(item.dataset.shot);
      loadShot(shot);
    });
  });
  function setText(i) {
    const [l,t,d] = info[i];
    if (shotNo) shotNo.textContent = String(i+1).padStart(2,'0');
    if (label) label.textContent = l;
    if (title) title.innerHTML = t;
    if (desc) desc.textContent = d;
  }

  function loadShot(i) {
    index = i % files.length;
    setText(index);
    if (!video) return;
    video.src = files[index];
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
    if (fill) fill.style.width = '0%';
  }

  function nextShot() {
    loadShot(index + 1);
  }

  video.addEventListener('ended', nextShot);
  video.addEventListener('timeupdate', () => {
    if (fill && video.duration) {
      fill.style.width = Math.min(100, (video.currentTime / video.duration) * 100) + '%';
    }
  });

  if (play) {
    play.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
        if (playIcon) playIcon.textContent = 'Ⅱ';
        play.setAttribute('aria-label','Pause video');
      } else {
        video.pause();
        if (playIcon) playIcon.textContent = '▶';
        play.setAttribute('aria-label','Play video');
      }
    });
  }

  loadShot(0);
})();
