/* DORN STUDIO — shared site behavior
   Index hero carousel + parallax, scroll reveals, footer utilities. */

(function () {
  'use strict';

  /* Measure the sticky nav into --nav-h so the pinned Index hero can sit
     exactly beneath it and fill the rest of the viewport from scroll 0. */
  var siteNavEl = document.querySelector('.site-nav');
  var setNavH = function () {
    if (siteNavEl) {
      document.documentElement.style.setProperty('--nav-h', siteNavEl.offsetHeight + 'px');
    }
  };
  setNavH();
  window.addEventListener('resize', setNavH);

  /* Scroll-triggered reveal for below-the-fold content (About / On the Side /
     case studies). Geometry-based rather than IntersectionObserver so content
     can never get stuck invisible: anything in (or entering) the viewport is
     revealed on load and on scroll, and the listeners detach once all reveal
     elements have shown. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    var reduceReveal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceReveal) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var pendingReveal = revealEls.slice();
      var revealQueued = false;

      var runReveal = function () {
        revealQueued = false;
        var vh = window.innerHeight || document.documentElement.clientHeight;
        pendingReveal = pendingReveal.filter(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < vh * 0.92 && r.bottom > 0) {
            el.classList.add('is-visible');
            return false;
          }
          return true;
        });
        if (!pendingReveal.length) {
          window.removeEventListener('scroll', onRevealScroll);
          window.removeEventListener('resize', onRevealScroll);
        }
      };

      var onRevealScroll = function () {
        if (revealQueued) return;
        revealQueued = true;
        window.requestAnimationFrame(runReveal);
      };

      window.addEventListener('scroll', onRevealScroll, { passive: true });
      window.addEventListener('resize', onRevealScroll);
      runReveal(); /* reveal whatever is already on screen at load */
    }
  }

  /* Footer "Back to top" */
  var topBtn = document.querySelector('[data-scroll-top]');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Live local clock (Europe/Berlin) — footer availability widget */
  var clockEls = document.querySelectorAll('[data-clock]');
  if (clockEls.length) {
    var tickClock = function () {
      var t = new Intl.DateTimeFormat('de-DE', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin'
      }).format(new Date());
      clockEls.forEach(function (el) { el.textContent = t; });
    };
    tickClock();
    setInterval(tickClock, 30000);
  }

  /* Click-to-copy email */
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var value = el.getAttribute('data-copy');
      var label = el.querySelector('[data-copy-label]');
      var write = navigator.clipboard
        ? navigator.clipboard.writeText(value)
        : Promise.reject();
      write.then(function () {
        if (!label) return;
        var original = label.textContent;
        label.textContent = 'Copied ✓';
        el.classList.add('is-copied');
        setTimeout(function () {
          label.textContent = original;
          el.classList.remove('is-copied');
        }, 1600);
      }).catch(function () {
        window.location.href = 'mailto:' + value; /* clipboard unavailable */
      });
    });
  });

  /* Contact form — static site, so "send" opens the visitor's mail app
     with the whole message pre-filled via mailto:. */
  var contactForm = document.getElementById('contact');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('cfName').value || '').trim();
      var email = (document.getElementById('cfEmail').value || '').trim();
      var message = (document.getElementById('cfMessage').value || '').trim();
      if (!name || !email || !message) {
        /* lean on native hints for whichever field is empty */
        var firstEmpty = [document.getElementById('cfName'), document.getElementById('cfEmail'), document.getElementById('cfMessage')]
          .filter(function (f) { return !(f.value || '').trim(); })[0];
        if (firstEmpty) firstEmpty.focus();
        return;
      }
      var subject = 'Project inquiry — ' + name;
      var body = message + '\n\n— ' + name + '\n' + email;
      window.location.href = 'mailto:dacjan.dorniok@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  }

  /* "Let's work together" — scroll to the form and put the cursor in it */
  document.querySelectorAll('[data-focus-form]').forEach(function (cta) {
    cta.addEventListener('click', function () {
      var firstField = document.getElementById('cfName');
      if (!firstField) return;
      setTimeout(function () {
        firstField.focus({ preventScroll: true });
      }, 450); /* after the smooth scroll has mostly settled */
    });
  });

  /* On the Side — cursor-following image preview over channel rows */
  var channelNav = document.querySelector('.channel-nav');
  if (channelNav && window.matchMedia('(pointer: fine)').matches) {
    var previewImg = document.createElement('img');
    previewImg.className = 'channel-preview';
    previewImg.alt = '';
    previewImg.setAttribute('aria-hidden', 'true');
    document.body.appendChild(previewImg);

    channelNav.querySelectorAll('.channel-nav__item[data-preview]').forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        previewImg.src = item.getAttribute('data-preview');
        previewImg.classList.add('is-on');
      });
      item.addEventListener('mouseleave', function () {
        previewImg.classList.remove('is-on');
      });
    });
    channelNav.addEventListener('mousemove', function (e) {
      previewImg.style.left = (e.clientX + 28) + 'px';
      previewImg.style.top = (e.clientY - 80) + 'px';
    });
  }

  /* Custom cursor — gold dot + trailing ring. Fine pointers only,
     skipped entirely for touch and reduced-motion users. */
  var wantsCursor = window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (wantsCursor) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add('has-custom-cursor');

    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    var rx = cx, ry = cy;
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX;
      cy = e.clientY;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    });
    (function follow() {
      rx += (cx - rx) * 0.16;
      ry += (cy - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(follow);
    })();

    document.addEventListener('mouseover', function (e) {
      var interactive = e.target.closest('a, button, [role="button"], .tab, .track');
      ring.classList.toggle('is-active', !!interactive);
    });
  }

  /* About — flip cards (whole card clickable + keyboard accessible).
     The turn is a requestAnimationFrame tween that writes an inline
     transform every frame on the main thread. Unlike a compositor-driven
     WAAPI/CSS animation, the rendered transform and the faces' backface
     culling can never disagree mid-turn — which is what made flips after
     the first one visually snap to their end state. The inline style
     overrides the resting class pose while turning and is cleared at the
     end, so the hand-off can never go stale either. */
  var flipReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var flipCards = document.querySelectorAll('.flip-card');

  /* Mobile: the faces are absolutely positioned, so the card row needs an
     explicit height — but a fixed one sized for the long back face leaves
     the short front sitting in a mostly-empty row. Instead, measure the
     face currently showing and size the card to it; the CSS height
     transition animates the resize in step with the turn. */
  var flipMobile = window.matchMedia('(max-width: 760px)'); /* must match the CSS single-column breakpoint */

  function faceNaturalHeight(face) {
    /* Lift the face into normal flow for one synchronous measurement —
       no paint happens in between, so nothing flashes. */
    var s = face.style;
    s.position = 'static';
    s.height = 'auto';
    var h = face.offsetHeight;
    s.position = '';
    s.height = '';
    return h;
  }

  function sizeCard(card) {
    if (!flipMobile.matches) {
      card.style.height = '';
      return;
    }
    var showing = card.classList.contains('is-flipped')
      ? '.flip-card__back'
      : '.flip-card__front';
    card.style.height = faceNaturalHeight(card.querySelector(showing)) + 'px';
  }

  function sizeAllCards() {
    flipCards.forEach(sizeCard);
  }

  flipCards.forEach(function (card) {
    var inner = card.querySelector('.flip-card__inner');
    var flipped = card.classList.contains('is-flipped');
    var turning = false;

    function setState(next) {
      flipped = next;
      card.classList.toggle('is-flipped', next);
      card.setAttribute('aria-pressed', String(next));
      sizeCard(card); /* mobile: grow/shrink to the face now showing */
    }

    /* ease-in-out cubic — close match for the old cubic-bezier(.645,.045,.355,1) */
    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function flip() {
      if (flipReducedMotion) {
        setState(!flipped);
        return;
      }
      if (turning) return; /* mid-turn */

      var from = flipped ? 180 : 0;
      var to = flipped ? 0 : 180;

      /* Logical end state up front — the is-flipped class provides the
         resting transform once the inline style is cleared. */
      setState(!flipped);
      card.classList.add('is-animating');
      turning = true;

      var DURATION = 1100;
      var t0 = null;

      function frame(now) {
        if (t0 === null) t0 = now;
        var p = Math.min(1, (now - t0) / DURATION);
        var e = ease(p);
        var angle = from + (to - from) * e;
        var scale = 1 + 0.05 * Math.sin(Math.PI * p); /* lift at the midpoint */
        inner.style.transform = 'rotateY(' + angle + 'deg) scale(' + scale + ')';
        if (p < 1) {
          window.requestAnimationFrame(frame);
        } else {
          inner.style.transform = ''; /* class pose takes over, exactly matching */
          card.classList.remove('is-animating');
          turning = false;
        }
      }
      window.requestAnimationFrame(frame);
    }

    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });

  /* Initial sizing + keep it correct across rotation / viewport changes */
  sizeAllCards();
  window.addEventListener('resize', sizeAllCards);
  if (flipMobile.addEventListener) flipMobile.addEventListener('change', sizeAllCards);
})();

(function () {
  'use strict';

  var hero = document.getElementById('hero');
  if (!hero) return; /* Index-only carousel below */

  var PARALLAX_INTENSITY = 40; // px, matches design default

  var PROJECTS = [
    {
      title: 'Arka',
      desc: 'A UX case study and mobile-first web concept for people who find stray or wild animals in Poland, turning a fragmented, insider-only reporting system into a guided triage-and-routing experience with trackable closure.',
      mockupSrc: 'assets/mockup-arka.png',
      mockupAlt: 'Arka on iPhone mockup',
      caseUrl: 'case-arka.html',
      liveProtoUrl: 'https://www.figma.com/proto/fJ3T5UYHN63B6CtRnKB1QG/Arka?node-id=100-11&p=f&scaling=scale-down&page-id=96%3A2&starting-point-node-id=100%3A11'
    },
    {
      title: 'History Museum',
      desc: 'A UX case study and mobile app concept for a natural history museum, turning a queue-bound, easy-to-get-lost visit into a companion-guided experience with timed entry, live crowd maps, and accessibility built in from the first tap.',
      mockupSrc: 'assets/mockup-museum.png',
      mockupAlt: 'History Museum on iPhone mockup',
      caseUrl: 'case-museum.html',
      liveProtoUrl: 'https://www.figma.com/proto/n56QXwGyZoMEDtL3hIBC8Z/-Dino----WIngs---Museum--Copy---Copy-?node-id=3012-4590&p=f&scaling=min-zoom&page-id=3012%3A4589&starting-point-node-id=3012%3A4590'
    },
    {
      title: 'Schuh-Werk & Statik',
      desc: 'A UX redesign and companion-app concept for a Bavarian orthopedic shoemaker, turning a low-trust website into a credibility-driven experience with frictionless booking.',
      mockupSrc: 'assets/mockup-schuhwerk.png',
      mockupAlt: 'Schuh-Werk & Statik on iPhone mockup',
      caseUrl: 'case-schuhwerk.html',
      liveProtoUrl: 'https://www.figma.com/proto/dfxKBjmeT7HRSESdmwtCQj/Shuhwerk_Dacjan_Dorniok?node-id=244-255&p=f&scaling=min-zoom&page-id=244%3A254&starting-point-node-id=244%3A255'
    }
  ];

  var heroImage = document.getElementById('heroImage');
  var heroText = document.getElementById('heroText');
  var phoneWrap = document.getElementById('phoneWrap');
  var content = document.getElementById('showcaseContent');
  var titleEl = document.getElementById('projectTitle');
  var descEl = document.getElementById('projectDesc');
  var mockupEl = document.getElementById('projectMockup');
  var caseLink = document.getElementById('projectCaseLink');
  var mockupLink = document.getElementById('projectMockupLink');
  var protoLink = document.getElementById('projectProtoLink');
  var ghostNum = document.getElementById('ghostNum');
  var track = document.getElementById('track');
  var indicator = document.getElementById('trackIndicator');
  var handle = document.getElementById('trackHandle');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  var activeIndex = -1;

  /* Preload mockups so switching is instant */
  PROJECTS.forEach(function (p) {
    var img = new Image();
    img.src = p.mockupSrc;
  });

  function render(animate) {
    var p = PROJECTS[activeIndex];

    titleEl.textContent = p.title;
    descEl.textContent = p.desc;
    mockupEl.src = p.mockupSrc;
    mockupEl.alt = p.mockupAlt;
    if (caseLink) caseLink.href = p.caseUrl;
    if (mockupLink) {
      mockupLink.href = p.caseUrl;
      mockupLink.setAttribute('aria-label', 'Open the ' + p.title + ' case study');
    }
    protoLink.href = p.liveProtoUrl;
    ghostNum.textContent = '0' + (activeIndex + 1);

    indicator.style.transform = 'translateX(' + activeIndex * 100 + '%)';
    handle.style.left = 'calc(' + ((activeIndex + 1) / PROJECTS.length) * 100 + '% - 5px)';
    track.setAttribute('aria-valuenow', String(activeIndex + 1));

    tabs.forEach(function (tab, i) {
      tab.classList.toggle('is-active', i === activeIndex);
    });

    if (animate) {
      content.style.transition = 'none';
      content.style.opacity = '0';
      content.style.transform = 'translateY(8px)';
      void content.offsetHeight; /* flush styles so the fade-in transitions */
      content.style.transition = '';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0px)';
    }
  }

  function setIndex(idx) {
    idx = ((idx % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
    if (idx === activeIndex) return;
    activeIndex = idx;
    render(true);
  }

  /* ---- Scroll-jack: the pinned hero maps scroll position to project ----
     On desktop, the tall .hero-scroll track pins the hero; scrolling through
     it advances the carousel. Nav controls (arrows / tabs / track) scroll the
     page to the matching segment so the two always stay in sync. On mobile
     the track collapses, scrollDriven() is false, and controls flip projects
     directly without moving the page. */
  var heroScroll = document.querySelector('.hero-scroll');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileLayout = window.matchMedia('(max-width: 900px)'); /* must match the CSS pin-collapse breakpoint */
  var navEl = document.querySelector('.site-nav');

  function navOffset() {
    return navEl ? navEl.offsetHeight : 72;
  }

  /* The pin sits at top: nav-height and is (100vh - nav) tall, so it is
     already stuck at scroll 0 — the full stick range runs from scrollY 0
     until the track's bottom meets the viewport bottom. */
  function travelDistance() {
    return heroScroll ? heroScroll.offsetHeight - window.innerHeight + navOffset() : 0;
  }
  function scrollDriven() {
    return !mobileLayout.matches && travelDistance() > 40;
  }

  function scrollToProject(i) {
    var travel = travelDistance();
    var start = window.pageYOffset + heroScroll.getBoundingClientRect().top - navOffset();
    var seg = travel / PROJECTS.length;
    var y = start + seg * i + seg * 0.5; /* aim for the middle of the segment */
    window.scrollTo({ top: Math.round(y), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function goToProject(i) {
    i = ((i % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
    if (scrollDriven()) scrollToProject(i);
    else setIndex(i);
  }

  var scrollQueued = false;
  function syncFromScroll() {
    scrollQueued = false;
    if (!scrollDriven()) return;
    var travel = travelDistance();
    var scrolled = navOffset() - heroScroll.getBoundingClientRect().top;
    var p = Math.min(1, Math.max(0, scrolled / travel));
    var i = Math.min(PROJECTS.length - 1, Math.floor(p * PROJECTS.length));
    setIndex(i);
  }
  window.addEventListener('scroll', function () {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(syncFromScroll);
  }, { passive: true });

  /* Arrows */
  document.getElementById('prevBtn').addEventListener('click', function () {
    goToProject(activeIndex - 1);
  });
  document.getElementById('nextBtn').addEventListener('click', function () {
    goToProject(activeIndex + 1);
  });

  /* Tabs */
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      goToProject(parseInt(tab.dataset.index, 10));
    });
  });

  /* Touch swipe — on mobile / tablet (pin collapsed, scrollDriven false)
     a horizontal finger swipe on the showcase flips projects directly.
     Listeners are passive and only act on a clearly horizontal gesture,
     so normal vertical page scrolling is never blocked. */
  var swipeArea = document.querySelector('.showcase');
  if (swipeArea) {
    var swipeX = 0;
    var swipeY = 0;
    var swipeOn = false;
    swipeArea.addEventListener('touchstart', function (e) {
      if (scrollDriven()) return; /* desktop pin: scroll already drives it */
      swipeOn = true;
      swipeX = e.touches[0].clientX;
      swipeY = e.touches[0].clientY;
    }, { passive: true });
    swipeArea.addEventListener('touchend', function (e) {
      if (!swipeOn) return;
      swipeOn = false;
      var dx = e.changedTouches[0].clientX - swipeX;
      var dy = e.changedTouches[0].clientY - swipeY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        goToProject(activeIndex + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  /* Track scrubbing */
  function projectFromClientX(clientX) {
    var rect = track.getBoundingClientRect();
    var ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.min(PROJECTS.length - 1, Math.floor(ratio * PROJECTS.length));
  }
  function scrubTo(clientX) {
    var i = projectFromClientX(clientX);
    if (scrollDriven()) {
      /* jump without smooth so dragging tracks the finger */
      var travel = travelDistance();
      var start = window.pageYOffset + heroScroll.getBoundingClientRect().top - navOffset();
      var seg = travel / PROJECTS.length;
      window.scrollTo({ top: Math.round(start + seg * i + seg * 0.5), behavior: 'auto' });
    } else {
      setIndex(i);
    }
  }

  function onTrackPointerMove(e) { scrubTo(e.clientX); }
  function onTrackPointerUp() {
    window.removeEventListener('pointermove', onTrackPointerMove);
    window.removeEventListener('pointerup', onTrackPointerUp);
  }

  track.addEventListener('pointerdown', function (e) {
    scrubTo(e.clientX);
    window.addEventListener('pointermove', onTrackPointerMove);
    window.addEventListener('pointerup', onTrackPointerUp);
  });

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToProject(activeIndex - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToProject(activeIndex + 1);
    }
  });

  /* Mouse parallax */
  var strength = Math.min(PARALLAX_INTENSITY, 40);
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Magnetic arrow buttons — a few px of pull toward the cursor */
  if (!prefersReducedMotion) {
    [document.getElementById('prevBtn'), document.getElementById('nextBtn')].forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + dx * 0.25 + 'px, ' + (dy * 0.25 - 1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  if (!prefersReducedMotion) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroImage.style.transform = 'translate(' + relX * strength + 'px, ' + relY * strength + 'px)';
      heroText.style.transform = 'translate(' + relX * -strength * 0.4 + 'px, ' + relY * -strength * 0.4 + 'px)';
      phoneWrap.style.transform = 'translate(' + relX * -strength * 0.25 + 'px, ' + relY * -strength * 0.25 + 'px) rotate(' + relX * 3 + 'deg)';
    });

    hero.addEventListener('mouseleave', function () {
      heroImage.style.transform = 'translate(0px, 0px)';
      heroText.style.transform = 'translate(0px, 0px)';
      phoneWrap.style.transform = 'translate(0px, 0px) rotate(0deg)';
    });
  }

  /* Tilt parallax — on touch layouts (no cursor) the same gentle drift
     follows the phone's physical tilt instead. The first sensor reading
     becomes the neutral pose (however the visitor happens to hold the
     phone), and ±18° of tilt from there covers the same range the cursor
     covers on desktop. Readings are eased through a rAF lerp so the
     motion stays soft, never jittery. */
  if (!prefersReducedMotion && 'DeviceOrientationEvent' in window) {
    var tiltBase = null;
    var tiltX = 0;
    var tiltY = 0;
    var tiltCurX = 0;
    var tiltCurY = 0;
    var tiltRaf = null;

    function tiltFrame() {
      tiltCurX += (tiltX - tiltCurX) * 0.08;
      tiltCurY += (tiltY - tiltCurY) * 0.08;
      heroImage.style.transform = 'translate(' + (tiltCurX * strength) + 'px, ' + (tiltCurY * strength) + 'px)';
      heroText.style.transform = 'translate(' + (tiltCurX * -strength * 0.4) + 'px, ' + (tiltCurY * -strength * 0.4) + 'px)';
      phoneWrap.style.transform = 'translate(' + (tiltCurX * -strength * 0.25) + 'px, ' + (tiltCurY * -strength * 0.25) + 'px) rotate(' + (tiltCurX * 3) + 'deg)';
      if (Math.abs(tiltX - tiltCurX) > 0.001 || Math.abs(tiltY - tiltCurY) > 0.001) {
        tiltRaf = window.requestAnimationFrame(tiltFrame);
      } else {
        tiltRaf = null;
      }
    }

    function onTilt(e) {
      if (!mobileLayout.matches) return; /* desktop keeps the cursor version */
      if (e.gamma === null || e.beta === null) return;
      if (tiltBase === null) tiltBase = { g: e.gamma, b: e.beta };
      tiltX = Math.max(-0.5, Math.min(0.5, (e.gamma - tiltBase.g) / 36));
      tiltY = Math.max(-0.5, Math.min(0.5, (e.beta - tiltBase.b) / 36));
      if (!tiltRaf) tiltRaf = window.requestAnimationFrame(tiltFrame);
    }

    function armTilt() {
      window.addEventListener('deviceorientation', onTilt);
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      /* iOS asks the visitor for motion access, and the request must come
         from a user gesture — piggyback on their first tap. If they
         decline, the page simply stays still. */
      var tiltAskOnce = function () {
        window.removeEventListener('touchend', tiltAskOnce);
        DeviceOrientationEvent.requestPermission().then(function (state) {
          if (state === 'granted') armTilt();
        }).catch(function () {});
      };
      window.addEventListener('touchend', tiltAskOnce, { passive: true });
    } else {
      armTilt();
    }
  }

  activeIndex = 0;
  render(false);
  if (scrollDriven()) syncFromScroll(); /* honour a deep-linked scroll position */
})();

/* Scrollspy — highlight the nav link for the section in view */
(function () {
  'use strict';
  var sections = document.querySelectorAll('[data-section]');
  var links = {};
  document.querySelectorAll('.site-nav__link[data-nav]').forEach(function (a) {
    links[a.getAttribute('data-nav')] = a;
  });
  if (!sections.length || !('IntersectionObserver' in window)) return;

  function setActive(id) {
    Object.keys(links).forEach(function (k) {
      links[k].classList.toggle('is-active', k === id);
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) setActive(e.target.id);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(function (s) { io.observe(s); });
})();

/* Prototype videos — muted, and playing only while actually on screen:
   start when scrolled into view, pause when scrolled away. */
(function () {
  'use strict';
  var vids = document.querySelectorAll('video[data-autoplay]');
  if (!vids.length) return;
  vids.forEach(function (v) { v.muted = true; }); /* never any sound */
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked — stay paused */ });
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });
})();

/* Floating back-to-top — injected on every page, shown after the first
   screenful of scroll. */
(function () {
  'use strict';
  var btn = document.createElement('button');
  btn.className = 'to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  var queued = false;
  function update() {
    queued = false;
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  update();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* Image lightbox — click any gallery image (print, drawings, logo) to
   open a full-screen preview. Closes on backdrop click, ✕, or Escape. */
(function () {
  'use strict';
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  var closeBtn = lightbox.querySelector('.lightbox__close');
  var images = document.querySelectorAll('.print-scroll__item, .sketch-card img, .logo-feature__img, .cs-figure img, .cs-figrow img, .cs-screens img, .cs-moodboard img');
  if (!images.length) return;

  var lastFocused = null;

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    /* release the (large) image once hidden */
    setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) lightboxImg.src = '';
    }, 320);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  images.forEach(function (img) {
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    if (!img.getAttribute('aria-label')) {
      img.setAttribute('aria-label', (img.getAttribute('alt') || 'Image') + ' — click to enlarge');
    }
    img.addEventListener('click', function () {
      lastFocused = img;
      open(img.currentSrc || img.src, img.getAttribute('alt'));
    });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocused = img;
        open(img.currentSrc || img.src, img.getAttribute('alt'));
      }
    });
  });

  lightbox.addEventListener('click', function (e) {
    /* click anywhere except the image itself closes */
    if (e.target !== lightboxImg) close();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
})();
