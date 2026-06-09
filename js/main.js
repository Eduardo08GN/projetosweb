/* =============================================
   ARTIMPLAN — Landing Page Scripts
   - Formulário → WhatsApp
   - Carrossel de sorrisos
   - Header sticky
   - Menu mobile
   - Fade-in on scroll
   ============================================= */

(function () {
  'use strict';

  // =========================================
  // CONFIG — Número do WhatsApp da clínica
  // Trocar pelo número real no formato: 5511999999999
  // =========================================
  var WHATSAPP_NUMBER = '5511989980606';


  // =========================================
  // FORMULÁRIO → WHATSAPP
  // Monta a URL wa.me com os dados do form
  // =========================================
  var form = document.getElementById('formAgendamento');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nomeInput = document.getElementById('nome');
      var procInput = document.getElementById('procedimento');
      var nome = nomeInput.value.trim();
      var procedimento = procInput.value;

      if (!nome) {
        nomeInput.focus();
        return;
      }
      if (!procedimento) {
        procInput.focus();
        return;
      }

      var texto = 'Olá! Meu nome é ' + nome + ', tenho interesse no tratamento de ' + procedimento + ' e vim pelo site.';

      var mensagem = encodeURIComponent(texto);
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + mensagem;

      window.open(url, '_blank');
    });
  }


  // =========================================
  // MÁSCARA DE TELEFONE
  // =========================================
  var telInput = document.getElementById('telefone');

  if (telInput) {
    telInput.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '');

      if (v.length <= 2) {
        this.value = v.length ? '(' + v : '';
      } else if (v.length <= 7) {
        this.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      } else if (v.length <= 11) {
        this.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
      } else {
        this.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7, 11);
      }
    });
  }


  // =========================================
  // CARROSSEL
  // =========================================
  var track = document.getElementById('carouselTrack');
  var dotsContainer = document.getElementById('carouselDots');
  var prevBtn = document.getElementById('carouselPrev');
  var nextBtn = document.getElementById('carouselNext');

  if (track) {
    var slides = track.children;
    var total = slides.length;
    var current = 0;
    var paused = false;
    var autoTimer;

    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
    }

    var dots = dotsContainer.querySelectorAll('.carousel__dot');

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', j === current);
      }
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        if (!paused) goTo(current + 1);
      }, 5000);
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });

    dotsContainer.addEventListener('click', function (e) {
      var dot = e.target.closest('.carousel__dot');
      if (dot) { goTo(parseInt(dot.dataset.index)); startAuto(); }
    });

    track.addEventListener('mousedown', function () { paused = true; });
    track.addEventListener('mouseup', function () { paused = false; startAuto(); });
    track.addEventListener('mouseleave', function () { paused = false; });
    track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    track.addEventListener('touchend', function () { paused = false; startAuto(); });

    startAuto();
  }


  // =========================================
  // CARROSSEL DE DEPOIMENTOS
  // =========================================
  var depTrack = document.getElementById('depTrack');
  var depDotsContainer = document.getElementById('depDots');
  var depPrev = document.getElementById('depPrev');
  var depNext = document.getElementById('depNext');

  if (depTrack) {
    var depCards = depTrack.children;
    var depTotal = depCards.length;
    var depCurrent = 0;
    var depPaused = false;
    var depAutoTimer;
    var depPerPage = window.innerWidth <= 768 ? 1 : 3;
    var depPages = Math.ceil(depTotal / depPerPage);

    for (var di = 0; di < depPages; di++) {
      var dd = document.createElement('button');
      dd.className = 'dep-dot' + (di === 0 ? ' active' : '');
      dd.dataset.index = di;
      depDotsContainer.appendChild(dd);
    }

    var depDots = depDotsContainer.querySelectorAll('.dep-dot');

    function depGoTo(index) {
      if (index < 0) index = depPages - 1;
      if (index >= depPages) index = 0;
      depCurrent = index;
      var shift = (100 / depPerPage) * depPerPage * depCurrent;
      depTrack.style.transform = 'translateX(-' + shift + '%)';
      for (var dj = 0; dj < depDots.length; dj++) {
        depDots[dj].classList.toggle('active', dj === depCurrent);
      }
    }

    function depStartAuto() {
      clearInterval(depAutoTimer);
      depAutoTimer = setInterval(function () {
        if (!depPaused) depGoTo(depCurrent + 1);
      }, 6000);
    }

    depPrev.addEventListener('click', function () { depGoTo(depCurrent - 1); depStartAuto(); });
    depNext.addEventListener('click', function () { depGoTo(depCurrent + 1); depStartAuto(); });
    depDotsContainer.addEventListener('click', function (e) {
      var dot = e.target.closest('.dep-dot');
      if (dot) { depGoTo(parseInt(dot.dataset.index)); depStartAuto(); }
    });

    depTrack.addEventListener('mousedown', function () { depPaused = true; });
    depTrack.addEventListener('mouseup', function () { depPaused = false; depStartAuto(); });
    depTrack.addEventListener('mouseleave', function () { depPaused = false; });
    depTrack.addEventListener('touchstart', function () { depPaused = true; }, { passive: true });
    depTrack.addEventListener('touchend', function () { depPaused = false; depStartAuto(); });

    depStartAuto();

    window.addEventListener('resize', function () {
      var newPerPage = window.innerWidth <= 768 ? 1 : 3;
      if (newPerPage !== depPerPage) {
        depPerPage = newPerPage;
        depPages = Math.ceil(depTotal / depPerPage);
        depDotsContainer.innerHTML = '';
        for (var ri = 0; ri < depPages; ri++) {
          var rd = document.createElement('button');
          rd.className = 'dep-dot' + (ri === 0 ? ' active' : '');
          rd.dataset.index = ri;
          depDotsContainer.appendChild(rd);
        }
        depDots = depDotsContainer.querySelectorAll('.dep-dot');
        depCurrent = 0;
        depGoTo(0);
      }
    });
  }


  // =========================================
  // HEADER STICKY (scroll detection)
  // =========================================
  var header = document.getElementById('header');

  if (header) {
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('header--scrolled', scrollY > 20);
      lastScroll = scrollY;
    }, { passive: true });
  }


  // =========================================
  // MENU MOBILE
  // =========================================
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
      }
    });
  }


  // =========================================
  // FADE-IN ON SCROLL (Intersection Observer)
  // =========================================
  var faders = document.querySelectorAll(
    '.service-card, .diferencial-card, .equipe-card, .depoimento-card, .faq__item'
  );

  if ('IntersectionObserver' in window && faders.length) {
    faders.forEach(function (el) {
      el.classList.add('fade-in');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    faders.forEach(function (el) { observer.observe(el); });
  }

})();
