// splitting , scrolla
$(function(){
  Splitting(); 
});

// motion
$(function(){
  $('.animate').scrolla({
    mobile:true,
    once:true
  })
});

// a href="#" 튕김 방지
$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});

// header 스크롤 방향 감지
$(function(){
  var prevScrollTop = 0;
  document.addEventListener('scroll', function(){
      var nowScrollTop = $(window).scrollTop();

      if(nowScrollTop > prevScrollTop){
          $('header').addClass('active');
      }else {
          $('header').removeClass('active');
      }

      prevScrollTop = nowScrollTop;
  })
});


gsap.registerPlugin(ScrollTrigger);

// work video
document.querySelectorAll('.hover-target').forEach(container => {
  const video = container.querySelector('video.preview');
  if (!video) return;

  const play = () => {
    video.currentTime = 0;
    video.play().catch(() => {});
  };
  const stop = () => {
    video.pause();
    video.currentTime = 0;
  };

  container.setAttribute('tabindex', '0');
  container.addEventListener('mouseenter', play);
  container.addEventListener('mouseleave', stop);
  container.addEventListener('focusin', play);
  container.addEventListener('focusout', stop);
  container.addEventListener('touchstart', play, { passive: true });
  container.addEventListener('touchend', stop, { passive: true });
});


// mainvideo  scrolltrigger
$(function(){
  gsap.timeline({
      scrollTrigger: {
          trigger: '.video',
          start: '0% 80%',
          end: '100% 100%',
          scrub: 1,
          markers: false
      }
  })
  .fromTo('.videowrap video',
    {'clip-path': 'inset(60% round 30%'},
    {'clip-path': 'inset(0% round 0%', ease: 'none', duration: 10},
    0
  );
});


// ====================== Lenis ======================
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => 1 - Math.pow(1 - t, 3),
  smoothWheel: true,
  wheelMultiplier: 0.7, //스크롤 속도 조절
  gestureDirection: 'vertical'
});
window.lenis = lenis;

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', () => {
  if (window.ScrollTrigger) ScrollTrigger.update();
});
if (matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop();



// ====================== 앵커 스크롤 ======================
(function(){
  const header = document.querySelector('header');
  const pad = 14;

  const headerOffset = () =>
    (header ? header.getBoundingClientRect().height : 0) + pad;

  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);

      if (!target) return;
      e.preventDefault();

      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(target, {
          offset: -headerOffset(),
          duration: 1.6,
          easing: easeOutQuint
        });
      } else {
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();



// ===========================
// Visual 섹션 마우스 트레일 효과 (즉시 반응 + 지연 없음)
// ===========================

let visualIndex = 0;
const visualImgList = [
  'img/visual1.png',
  'img/visual2.png',
  'img/visual3.png',
  'img/visual4.png',
  'img/visual5.png',
  'img/visual6.png',
  'img/visual7.png',
  'img/visual8.png',
  'img/visual9.png',
  'img/visual10.png'
];

const visualWrapper = document.querySelector('.visual .floating-images');

// =====================================
// 🔥 이미지 미리 로딩 → 첫 마우스 움직임부터 바로 출력됨
// =====================================
visualImgList.forEach(src => {
  const preload = new Image();
  preload.src = src;
});

// =====================================
// 설정값
// =====================================
let lastVisualTime = 0;
const visualDelay = 200; // 0.2초 간격

// =====================================
// 마우스 트레일 생성
// =====================================
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastVisualTime < visualDelay) return;
  lastVisualTime = now;

  // 🔥 뷰포트 체크 제거 (즉시 반응)
  // const rect = visualSection.getBoundingClientRect();
  // if(!inViewport) return;   // ← 이것들 제거

  const img = document.createElement('img');
  img.src = visualImgList[visualIndex % visualImgList.length];
  img.classList.add('trail-img');

  img.style.left = `${e.clientX}px`;
  img.style.top = `${e.clientY}px`;

  visualWrapper.appendChild(img);
  visualIndex++;

  // 사라지는 시간
  setTimeout(() => {
    img.remove();
  }, 900);
});




/// Top Button 푸터 근처에서 나타나기
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector('.to-top');
  const footer = document.querySelector('section.footer, .footer, footer'); // 푸터 선택자

  if (!btn || !footer) return;

  // 📌 옵저버: footer가 화면에 가까워지면 버튼 등장
  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (entry.intersectionRatio > 0) {
        // footer가 화면에 보이기 시작하면 show ON
        btn.classList.add('show');
      } else {
        // footer에서 멀어지면 show OFF
        btn.classList.remove('show');
      }
    },
    {
      root: null,
      threshold: 0,
      // 📌 footer가 화면에 닿기 "약간 전"부터 감지되도록
      rootMargin: "50px 0px -75% 0px"
      /*
        🔍 rootMargin 설명:
        top: 100px → footer가 화면 아래에서 100px 정도 남았을 때부터 감지
        bottom: -20% → footer 20% 정도 화면 안에 들어올 때 확실히 show 유지
        값은 원하는 위치에 맞게 아주 쉽게 조절 가능
      */
    }
  );

  io.observe(footer);

  // ✅ Top 버튼 클릭 시 부드러운 스크롤 (Lenis 우선 적용)
  btn.addEventListener('click', () => {
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(0, {
        duration: 2.5, // ⭐ 부드러운 속도: 2~3 추천 (20은 너무 느림)
        easing: t => 1 - Math.pow(1 - t, 4)
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
