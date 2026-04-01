/* ====================================================
   main.js — Portfolio Interactive Behaviors
   ==================================================== */

/* -------------------------------------------------------
   1. NAV — scroll 감지 및 active link 처리
   ------------------------------------------------------- */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__links a');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // scrolled style
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // 초기 실행

/* -------------------------------------------------------
   2. NAV — 모바일 햄버거 메뉴
   ------------------------------------------------------- */
const hamburger = document.getElementById('navHamburger');
const navMenu = document.querySelector('.nav__links');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  // animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// 링크 클릭 시 메뉴 닫기
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* -------------------------------------------------------
   3. REVEAL ANIMATION — Intersection Observer
   ------------------------------------------------------- */
function initReveal() {
  // 큰 섹션 단위
  const revealEls = document.querySelectorAll(
    '.section__title, .about__text, .about__stats, ' +
    '.skills__main, .skills__etc, ' +
    '.project-card, ' +
    '.edu__col, ' +
    '.contact__desc, .contact__links'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  // 작은 요소 단위 (자식 stagger)
  const staggerContainers = [
    { selector: '.about__stats', child: '.stat-card' },
    { selector: '.skills__main', child: '.skill-item' },
    { selector: '.skills__etc-tags', child: '.etag' },
    { selector: '.problem-list',  child: '.problem-item' },
    { selector: '.contribution__grid', child: '.contrib-block' },
    { selector: '.cert-list', child: '.cert-item' },
    { selector: '.tl-item', child: null },
    { selector: '.contact__links', child: '.contact-card' },
  ];

  staggerContainers.forEach(({ selector, child }) => {
    if (child) {
      document.querySelectorAll(child).forEach((el, i) => {
        el.classList.add('reveal-child');
        el.style.transitionDelay = `${i * 70}ms`;
      });
    }
  });

  const allReveal = document.querySelectorAll('.reveal, .reveal-child');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  allReveal.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------
   4. SKILL LEVEL BAR — 레벨 시각화
   ------------------------------------------------------- */
function initSkillBars() {
  document.querySelectorAll('.skill-item').forEach(item => {
    const level = parseInt(item.dataset.level || '3', 10);
    const header = item.querySelector('.skill-item__header');
    const barWrap = document.createElement('div');
    barWrap.className = 'skill-bar';
    barWrap.innerHTML = `
      <div class="skill-bar__track">
        <div class="skill-bar__fill" style="width: 0%;" data-target="${level * 20}%"></div>
      </div>
    `;
    header.insertAdjacentElement('afterend', barWrap);
  });
}

function animateSkillBars() {
  document.querySelectorAll('.skill-bar__fill').forEach(fill => {
    const target = fill.dataset.target;
    fill.style.width = target;
  });
}

// skill bar CSS injection
(function injectSkillBarCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .skill-bar { margin: 6px 0 12px; }
    .skill-bar__track {
      height: 4px;
      background: var(--bg-raised);
      border-radius: 2px;
      overflow: hidden;
    }
    .skill-bar__fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-dim), var(--accent));
      border-radius: 2px;
      transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
})();

/* -------------------------------------------------------
   5. TYPING EFFECT — hero code block 커서
   ------------------------------------------------------- */
function initCodeCursor() {
  const codeBlock = document.querySelector('.code-body code');
  if (!codeBlock) return;
  const cursor = document.createElement('span');
  cursor.style.cssText = `
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--accent);
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  `;
  const blinkStyle = document.createElement('style');
  blinkStyle.textContent = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(blinkStyle);
  codeBlock.appendChild(cursor);
}

/* -------------------------------------------------------
   6. SMOOTH SCROLL — 내부 anchor
   ------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* -------------------------------------------------------
   7. PROJECT CARD — hover 강조 효과
   ------------------------------------------------------- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'border-color 0.25s, box-shadow 0.25s, transform 0.25s';
    card.style.transform = 'translateY(-3px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* -------------------------------------------------------
   8. INIT — DOM ready
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSkillBars();
  initCodeCursor();

  // skill bar 애니메이션은 스크롤 진입 시 실행
  const skillSection = document.getElementById('skills');
  if (skillSection) {
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(animateSkillBars, 300);
          skillObs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    skillObs.observe(skillSection);
  }
});
