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
})

//스크립트 위로 튕기는것 방지
$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});


gsap.registerPlugin(ScrollTrigger);


// work video
document.querySelectorAll('.hover-target').forEach(container => {
  const video = container.querySelector('video.preview');
  if (!video) return;

  const play = () => {
    video.currentTime = 0;
    video.play().catch(() => {}); // safari에서 play 오류 방지
  };
  const stop = () => {
    video.pause();
    video.currentTime = 0;
  };

  container.setAttribute('tabindex', '0'); // 키보드 접근성
  container.addEventListener('mouseenter', play);
  container.addEventListener('mouseleave', stop);
  container.addEventListener('focusin', play);
  container.addEventListener('focusout', stop);
  container.addEventListener('touchstart', play, { passive: true });
  container.addEventListener('touchend', stop, { passive: true });
});


// hover 대상 감지
document.querySelectorAll('.hover-target').forEach(target => {
  target.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });
  target.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
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
  .fromTo('.videowrap video', {'clip-path': 'inset(60% round 30%'}, {'clip-path': 'inset(0% round 0%', ease: 'none', duration: 10} ,0) //비디오 점점 커지는 효과 ->clip path 사이트 참고 
})


// ======================
// Lenis 기본 스크롤
// ======================
const lenis = new Lenis({
  duration: 1.1,  // 조금 더 부드럽고 길게
  easing: (t) => 1 - Math.pow(1 - t, 3),
  smoothWheel: true,
  wheelMultiplier: 1.1,
  gestureDirection: 'vertical'
});

// window.lenis 등록 ★ 핵심 포인트
window.lenis = lenis;

// raf loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ScrollTrigger와 싱크
lenis.on('scroll', () => {
  if (window.ScrollTrigger) ScrollTrigger.update();
});

// 모션 민감 사용자
if (matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop();


// ======================
// GNB 클릭 → 부드러운 앵커 이동
// ======================
(function(){
  const header = document.querySelector('header');
  const pad = 14;

  const headerOffset = () =>
    (header ? header.getBoundingClientRect().height : 0) + pad;

  // 자연스러운 easing (quint)
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

  document.querySelectorAll('header .menu a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);

      if (!target) return;
      e.preventDefault();

      // Lenis가 있으면 Lenis scrollTo 사용
      window.lenis.scrollTo(target, {
        offset: -headerOffset(),
        duration: 1.6,   // 부드럽게 이동하는 시간
        easing: easeOutQuint
      });
    });
  });
})();
