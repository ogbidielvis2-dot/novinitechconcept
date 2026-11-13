/* Novini Tech Concept — site behaviour. No dependencies. */
(function () {
  'use strict';
  /* ---- Site configuration: fill these in; anything empty is hidden or falls back to an in-page anchor. ---- */
  var CONFIG = {
    links: { truxpylot: '', academy: '' },        // e.g. 'https://truxpylot.com'
    contact: { email: '', phone: '', whatsapp: '' }, // whatsapp: digits only, e.g. '2348000000000'
    socials: []                                    // e.g. [{ label: 'LinkedIn', url: 'https://…' }]
  };

  var d = document, $ = function (s, c) { return (c || d).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };
  $('#yr').textContent = new Date().getFullYear();

  /* external links from config */
  $$('[data-link]').forEach(function (a) {
    var u = CONFIG.links[a.dataset.link];
    if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; }
  });

  /* contact channels */
  var c = CONFIG.contact, ch = {
    email: c.email && ['mailto:' + c.email, c.email],
    phone: c.phone && ['tel:' + c.phone.replace(/\s/g, ''), c.phone],
    whatsapp: c.whatsapp && ['https://wa.me/' + c.whatsapp, 'Message us']
  };
  Object.keys(ch).forEach(function (k) {
    var a = $('[data-channel="' + k + '"]'); if (!a) return;
    if (ch[k]) { a.href = ch[k][0]; $('b', a).textContent = ch[k][1]; a.hidden = false; } else a.remove();
  });
  if (CONFIG.socials.length) {
    var ul = $('#socials'); ul.textContent = '';
    CONFIG.socials.forEach(function (s) {
      var li = d.createElement('li'), a = d.createElement('a');
      a.href = s.url; a.textContent = s.label; a.target = '_blank'; a.rel = 'noopener noreferrer'; li.appendChild(a); ul.appendChild(li);
    });
  }

  /* nav: solid on scroll, mobile menu, active link */
  var nav = $('#nav'), links = $('#links'), burger = $('#burger');
  function onScroll() { nav.classList.toggle('solid', scrollY > 24); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function setMenu(o) { links.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); d.body.style.overflow = o ? 'hidden' : ''; }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', function () { if (innerWidth > 760) setMenu(false); });

  if ('IntersectionObserver' in window) {
    var secs = $$('main section[id]'), map = {};
    $$('.links a[href^="#"]:not(.btn)').forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { Object.keys(map).forEach(function (k) { map[k].classList.toggle('on', k === e.target.id); }); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { so.observe(s); });

    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { ro.observe(el); });
  } else $$('.rv').forEach(function (el) { el.classList.add('in'); });

  /* ecosystem hero interaction */
  var copy = {
    ventures: '<b>Digital Ventures —</b> TruxPylot, the trusted professional network.',
    education: '<b>Technology Education —</b> Novini ICT Academy, where technology becomes a skill.',
    enterprise: '<b>Enterprise Solutions —</b> custom web engineering, architecture and reliable infrastructure.'
  }, det = $('#eco-detail'), base = det.innerHTML;
  function act(k) {
    $$('.eco .node').forEach(function (n) { n.classList.toggle('act', n.dataset.k === k); });
    det.innerHTML = k ? copy[k] : base;
  }
  $$('.eco .node').forEach(function (n) {
    n.addEventListener('mouseenter', function () { act(n.dataset.k); });
    n.addEventListener('focus', function () { act(n.dataset.k); });
    n.addEventListener('mouseleave', function () { act(null); });
    n.addEventListener('blur', function () { act(null); });
  });

  /* contact form → opens the visitor's mail client (no backend required) */
  var form = $('#form'), msg = $('#form-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form), name = (f.get('name') || '').trim(), em = (f.get('email') || '').trim(), m = (f.get('message') || '').trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(em) || !m) { msg.textContent = 'Please add your name, a valid email and a short message.'; return; }
    if (!CONFIG.contact.email) { msg.textContent = 'Thanks — our contact channel is being finalised. Please check back shortly.'; return; }
    var body = 'Name: ' + name + '\nEmail: ' + em + '\n\n' + m;
    location.href = 'mailto:' + CONFIG.contact.email + '?subject=' + encodeURIComponent('Enquiry: ' + f.get('topic')) + '&body=' + encodeURIComponent(body);
    msg.textContent = 'Opening your email app…';
  });
})();
