// splitting , scrolla
$(function(){
  Splitting(); 
});

// // motion
// $(function(){
//   $('.animate').scrolla({
//     mobile:true,
//     once:true
//   })
// });

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

// *** 여기 cursor 관련 블럭은 전부 삭제 / 주석!! ***


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
  wheelMultiplier: 1.1,
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


// ====================== con5 리스트 hover 이미지 ======================
window.addEventListener('DOMContentLoaded', () => {
  const listBox = document.querySelectorAll(".con5 .listBox li");   
  const imgBox  = document.querySelector(".con5 .imgBox");
  const img     = document.querySelector(".con5 .imgBox img");

  if (!listBox.length || !imgBox || !img) return;

  listBox.forEach((item, i) => {
    item.addEventListener("mouseenter", () => {
      img.src = `img/img${i}.jpg`;
      gsap.set(imgBox, { scale: 0, opacity: 0 });
      gsap.to(imgBox, { scale: 1, opacity: 1, duration: 0.3 });
    });

    item.addEventListener("mousemove", (e) => {
      imgBox.style.left = (e.pageX + 20) + 'px';
      imgBox.style.top  = (e.pageY - 20) + 'px';
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(imgBox, { scale: 0, opacity: 0, duration: 0.3 });
    });
  });
});
