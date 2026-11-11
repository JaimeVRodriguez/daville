(() => {
  const PRODUCTS = [
    { id: 1, name: 'Emerica Seneca Leo Romero Shoe — Creme', brand: 'Emerica', price: 99.99, cat: 'shoes', badge: 'New', a: '#c6ff3d', b: '#3a7d0a', shape: 'shoe' },
    { id: 2, name: 'Daville Skateboard Deck — Crown Tag White/Black, K-Shape (7.75–9.0)', brand: 'Daville', price: 54.99, cat: 'boards', badge: 'House brand', a: '#7c5cff', b: '#ff4fa3', shape: 'deck' },
    { id: 3, name: 'Moxi Roller Skates — Beach Bunny Sky Blue', brand: 'Moxi', price: 169.99, cat: 'skates', badge: 'Fan fave', a: '#4fc3ff', b: '#7c5cff', shape: 'skate' },
    { id: 4, name: 'Daville Cargo Pants — Black', brand: 'Daville', price: 49.99, cat: 'apparel', badge: 'House brand', a: '#444450', b: '#16161a', shape: 'pants' },
    { id: 5, name: 'Daville Canvas Backpack', brand: 'Daville', price: 49.99, cat: 'acc', badge: 'House brand', a: '#ff9f4f', b: '#ff4fa3', shape: 'bag' },
    { id: 6, name: 'Daville Logo Enamel Lapel Pin — Black Crown', brand: 'Daville', price: 7.99, cat: 'acc', badge: 'Under $10', a: '#c6ff3d', b: '#111114', shape: 'pin' },
  ];

  const SHAPES = {
    shoe: '<path d="M6 62c0-10 6-14 14-16l10-18 12 8 16 2c10 2 14 8 14 16v8H6z" fill="url(#g)"/><path d="M6 70h72" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>',
    deck: '<rect x="30" y="4" width="28" height="92" rx="14" fill="url(#g)"/><path d="M44 28l-6 14 6-4 6 4z" fill="#000" fill-opacity=".55"/>',
    skate: '<path d="M14 24h38l10 22h14v16H14z" fill="url(#g)"/><circle cx="26" cy="72" r="8" fill="#fff"/><circle cx="62" cy="72" r="8" fill="#fff"/>',
    pants: '<path d="M22 8h44l4 84H52L44 40l-8 52H18z" fill="url(#g)"/><rect x="40" y="8" width="8" height="10" fill="#fff" fill-opacity=".2"/>',
    bag: '<rect x="18" y="22" width="52" height="68" rx="14" fill="url(#g)"/><path d="M32 26c0-16 24-16 24 0" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4"/><rect x="28" y="54" width="32" height="20" rx="6" fill="#000" fill-opacity=".25"/>',
    pin: '<circle cx="44" cy="48" r="30" fill="url(#g)"/><path d="M26 62l5-18 9 10 4-13 4 13 9-10 5 18z" fill="#c6ff3d"/>',
  };

  const money = n => '$' + n.toFixed(2);
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('daville-cart')) || {}; } catch { return {}; } },
    set(v) { try { localStorage.setItem('daville-cart', JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  let cart = store.get();

  const art = p => `<svg viewBox="0 0 88 100" aria-hidden="true"><defs><linearGradient id="g${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/></linearGradient></defs>${SHAPES[p.shape].replaceAll('url(#g)', `url(#g${p.id})`)}</svg>`;

  function render(filter = 'all') {
    $('#products').innerHTML = PRODUCTS.filter(p => filter === 'all' || p.cat === filter).map((p, i) => `
      <article class="card" style="animation-delay:${i * 60}ms">
        <div class="thumb" style="background:radial-gradient(circle at 50% 40%,${p.a}33,#16161a 70%)">
          <span class="badge">${p.badge}</span>${art(p)}
        </div>
        <div class="info">
          <small>${p.brand}</small>
          <h3>${p.name}</h3>
          <div class="buy"><span class="price">${money(p.price)}</span>
            <button class="add" data-id="${p.id}">Add to cart</button></div>
        </div>
      </article>`).join('') || '<p class="note">Nothing here yet.</p>';
  }

  function setFilter(f) {
    $$('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === f));
    render(f);
  }

  function renderCart() {
    const items = Object.entries(cart).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === +id), q })).filter(x => x.p);
    const n = items.reduce((s, x) => s + x.q, 0);
    $('#cartCount').textContent = n;
    $('#cartCount').classList.toggle('on', n > 0);
    $('#cartTotal').textContent = money(items.reduce((s, x) => s + x.p.price * x.q, 0));
    $('#cartList').innerHTML = items.length ? items.map(({ p, q }) => `
      <li class="line">
        <div class="sw" style="background:linear-gradient(135deg,${p.a},${p.b})"></div>
        <div><b>${p.name}</b><small>${money(p.price)}</small>
          <div class="qty"><button data-dec="${p.id}" aria-label="Decrease">−</button><span>${q}</span><button data-inc="${p.id}" aria-label="Increase">+</button></div></div>
        <strong>${money(p.price * q)}</strong>
      </li>`).join('') : '<li class="empty">Your cart is empty. Go get some gear.</li>';
    store.set(cart);
  }

  const change = (id, d) => { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; renderCart(); };

  let lastFocus = null;
  function drawer(open) {
    $('#drawer').classList.toggle('open', open);
    $('#drawer').setAttribute('aria-hidden', String(!open));
    $('#scrim').hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { lastFocus = document.activeElement; $('#closeCart').focus(); } else if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('button,a');
    if (!t) return;
    if (t.matches('.add')) {
      change(t.dataset.id, 1);
      t.textContent = 'Added ✓'; t.classList.add('done');
      setTimeout(() => { t.textContent = 'Add to cart'; t.classList.remove('done'); }, 1200);
    }
    else if (t.dataset.inc) change(t.dataset.inc, 1);
    else if (t.dataset.dec) change(t.dataset.dec, -1);
    else if (t.matches('.chip')) setFilter(t.dataset.filter);
    else if (t.dataset.filterLink) setFilter(t.dataset.filterLink);
    else if (t.matches('#checkout')) { alert('Concept prototype: checkout is not wired up.'); }
    if (t.closest('.links')) closeMenu();
  });
  $('#cartBtn').onclick = () => drawer(true);
  $('#closeCart').onclick = $('#scrim').onclick = () => drawer(false);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { drawer(false); closeMenu(); } });

  const burger = $('#burger');
  function closeMenu() { $('#links').classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.onclick = () => burger.setAttribute('aria-expanded', String($('#links').classList.toggle('open')));

  $('#newsForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#email').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    $('#formMsg').textContent = ok ? "You're in. Watch your inbox. (Demo: nothing was sent.)" : 'Please enter a valid email address.';
    if (ok) e.target.reset();
  });

  // scroll reveal
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 });
  $$('.sec-head,.tile,.trio article,.loc,.campaign,.brand>*').forEach(el => { el.classList.add('reveal'); io.observe(el); });

  render();
  renderCart();
})();
