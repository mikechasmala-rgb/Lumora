const games = [
  {
    id: "mlbb", name: "Mobile Legends", short: "ML", publisher: "Moonton",
    category: "moba", color: "linear-gradient(135deg,#3b5bdb,#1c2a6b)",
    currency: "Diamonds", zone: true, popular: true,
    items: [[86, 22000], [172, 43500], [257, 64000], [344, 86000], [429, 107000], [514, 128000], [706, 172000], [1412, 342000]],
  },
  {
    id: "ff", name: "Free Fire", short: "FF", publisher: "Garena",
    category: "battle", color: "linear-gradient(135deg,#f08c00,#a33b00)",
    currency: "Diamonds", zone: false, popular: true,
    items: [[70, 10000], [140, 20000], [355, 50000], [720, 100000], [1450, 200000], [2180, 300000]],
  },
  {
    id: "pubgm", name: "PUBG Mobile", short: "PB", publisher: "Tencent",
    category: "battle", color: "linear-gradient(135deg,#c9a227,#6b5410)",
    currency: "UC", zone: false, popular: true,
    items: [[60, 15000], [325, 75000], [660, 150000], [1800, 375000], [3850, 750000], [8100, 1500000]],
  },
  {
    id: "genshin", name: "Genshin Impact", short: "GI", publisher: "HoYoverse",
    category: "rpg", color: "linear-gradient(135deg,#4dabf7,#1864ab)",
    currency: "Genesis Crystals", zone: true, zoneLabel: "Server", popular: false,
    items: [[60, 16000], [330, 79000], [1090, 249000], [2240, 479000], [3880, 799000], [8080, 1599000]],
  },
  {
    id: "hsr", name: "Honkai: Star Rail", short: "HS", publisher: "HoYoverse",
    category: "rpg", color: "linear-gradient(135deg,#9775fa,#4527a0)",
    currency: "Oneiric Shard", zone: true, zoneLabel: "Server", popular: false,
    items: [[60, 16000], [330, 79000], [1090, 249000], [2240, 479000], [3880, 799000], [8080, 1599000]],
  },
  {
    id: "valorant", name: "Valorant", short: "VL", publisher: "Riot Games",
    category: "fps", color: "linear-gradient(135deg,#fa5252,#7a1d1d)",
    currency: "Points", zone: false, popular: true,
    items: [[475, 56000], [1000, 112000], [2050, 224000], [3650, 392000], [5350, 560000], [11000, 1120000]],
  },
  {
    id: "codm", name: "Call of Duty Mobile", short: "CD", publisher: "Activision",
    category: "fps", color: "linear-gradient(135deg,#495057,#141619)",
    currency: "CP", zone: false, popular: false,
    items: [[63, 10000], [128, 20000], [321, 50000], [645, 100000], [1373, 200000], [3564, 500000]],
  },
  {
    id: "roblox", name: "Roblox", short: "RB", publisher: "Roblox Corp",
    category: "casual", color: "linear-gradient(135deg,#20c997,#0b6b52)",
    currency: "Robux", zone: false, popular: false,
    items: [[80, 16000], [400, 79000], [800, 155000], [1700, 309000], [4500, 779000], [10000, 1549000]],
  },
];

const payments = {
  "E-Wallet": [
    { id: "dana", name: "DANA", fee: 0 },
    { id: "ovo", name: "OVO", fee: 0 },
    { id: "gopay", name: "GoPay", fee: 0 },
    { id: "shopeepay", name: "ShopeePay", fee: 0 },
  ],
  "QRIS & Virtual Account": [
    { id: "qris", name: "QRIS", fee: 0.007 },
    { id: "bca", name: "BCA Virtual Account", fee: 4000 },
    { id: "mandiri", name: "Mandiri VA", fee: 4000 },
    { id: "bri", name: "BRI VA", fee: 4000 },
  ],
};

const categories = [
  { id: "all", label: "Semua" },
  { id: "moba", label: "MOBA" },
  { id: "battle", label: "Battle Royale" },
  { id: "fps", label: "FPS" },
  { id: "rpg", label: "RPG" },
  { id: "casual", label: "Casual" },
];

const state = {
  category: "all",
  query: "",
  game: games[0],
  item: null,
  payment: null,
};

const $ = (sel) => document.querySelector(sel);
const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const number = (n) => new Intl.NumberFormat("id-ID").format(n);

const els = {
  grid: $("#gameGrid"),
  filters: $("#filters"),
  search: $("#searchInput"),
  selectedGame: $("#selectedGame"),
  zoneField: $("#zoneField"),
  zoneLabel: $("#zoneLabel"),
  userId: $("#userId"),
  zoneId: $("#zoneId"),
  contact: $("#contact"),
  items: $("#itemGrid"),
  payments: $("#paymentGroups"),
  sumGame: $("#sumGame"),
  sumId: $("#sumId"),
  sumItem: $("#sumItem"),
  sumPay: $("#sumPay"),
  sumFee: $("#sumFee"),
  sumTotal: $("#sumTotal"),
  buyBtn: $("#buyBtn"),
  modal: $("#successModal"),
  invoice: $("#invoiceDetail"),
  toast: $("#toast"),
  feed: $("#liveFeed"),
  nav: $("#nav"),
  menuToggle: $("#menuToggle"),
};

function iconHTML(game) {
  return `<span class="game-icon" style="--game-color:${game.color}" aria-hidden="true">${game.short}</span>`;
}

function renderFilters() {
  els.filters.innerHTML = categories
    .map(
      (c) =>
        `<button type="button" class="chip ${c.id === state.category ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`
    )
    .join("");
}

function renderGames() {
  const q = state.query.trim().toLowerCase();
  const list = games.filter(
    (g) =>
      (state.category === "all" || g.category === state.category) &&
      (g.name.toLowerCase().includes(q) || g.publisher.toLowerCase().includes(q))
  );

  if (!list.length) {
    els.grid.innerHTML = `<p class="empty">Game tidak ditemukan. Coba kata kunci lain.</p>`;
    return;
  }

  els.grid.innerHTML = list
    .map(
      (g) => `
      <button type="button" class="game-card" style="--game-color:${g.color}" data-game="${g.id}" aria-label="Top up ${g.name}">
        ${g.popular ? '<span class="badge">Populer</span>' : ""}
        ${iconHTML(g)}
        <div>
          <h3>${g.name}</h3>
          <small>${g.publisher}</small>
        </div>
      </button>`
    )
    .join("");
}

function renderSelectedGame() {
  const g = state.game;
  els.selectedGame.innerHTML = `
    ${iconHTML(g)}
    <div>
      <h3>${g.name}</h3>
      <p>${g.publisher} &middot; Proses instan 1-3 detik</p>
    </div>`;
  els.zoneField.hidden = !g.zone;
  els.zoneLabel.textContent = g.zoneLabel || "Zone ID";
  els.zoneId.placeholder = g.zoneLabel ? "Contoh: Asia" : "Contoh: 2001";
}

function renderItems() {
  const g = state.game;
  els.items.innerHTML = g.items
    .map(
      ([amount, price], i) => `
      <button type="button" class="option" data-item="${i}" aria-pressed="${state.item === i}">
        <strong>${number(amount)} ${g.currency}</strong>
        <span>${rupiah(price)}</span>
      </button>`
    )
    .join("");
}

function feeFor(pay, price) {
  if (!pay) return 0;
  return pay.fee < 1 ? Math.round(price * pay.fee) : pay.fee;
}

function renderPayments() {
  const price = state.item !== null ? state.game.items[state.item][1] : 0;
  els.payments.innerHTML = Object.entries(payments)
    .map(
      ([group, list]) => `
      <div class="pay-group">
        <h4>${group}</h4>
        <div class="option-grid">
          ${list
            .map((p) => {
              const fee = feeFor(p, price);
              return `
              <button type="button" class="option" data-pay="${p.id}" aria-pressed="${state.payment?.id === p.id}">
                <strong>${p.name}</strong>
                <small>${price ? (fee ? "Biaya " + rupiah(fee) : "Tanpa biaya") : p.fee ? "Biaya admin" : "Tanpa biaya"}</small>
              </button>`;
            })
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

function getAccountId() {
  const id = els.userId.value.trim();
  const zone = els.zoneId.value.trim();
  if (!id) return "";
  return state.game.zone && zone ? `${id} (${zone})` : id;
}

function updateSummary() {
  const g = state.game;
  const item = state.item !== null ? g.items[state.item] : null;
  const price = item ? item[1] : 0;
  const fee = feeFor(state.payment, price);

  els.sumGame.textContent = g.name;
  els.sumId.textContent = getAccountId() || "-";
  els.sumItem.textContent = item ? `${number(item[0])} ${g.currency}` : "-";
  els.sumPay.textContent = state.payment ? state.payment.name : "-";
  els.sumFee.textContent = state.payment && item ? rupiah(fee) : "-";
  els.sumTotal.textContent = rupiah(price + fee);

  const ready =
    els.userId.value.trim() &&
    (!g.zone || els.zoneId.value.trim()) &&
    item &&
    state.payment;
  els.buyBtn.disabled = !ready;
}

function selectGame(id, scroll = true) {
  const g = games.find((x) => x.id === id);
  if (!g) return;
  state.game = g;
  state.item = null;
  els.userId.value = "";
  els.zoneId.value = "";
  renderSelectedGame();
  renderItems();
  renderPayments();
  updateSummary();
  if (scroll) $("#topup").scrollIntoView({ behavior: "smooth" });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function openModal() {
  const g = state.game;
  const [amount, price] = g.items[state.item];
  const fee = feeFor(state.payment, price);
  const invoiceId = "INV" + Date.now().toString().slice(-9);

  els.invoice.innerHTML = `
    <div><span>No. Invoice</span><strong>${invoiceId}</strong></div>
    <div><span>Game</span><strong>${g.name}</strong></div>
    <div><span>ID Akun</span><strong>${escapeHTML(getAccountId())}</strong></div>
    <div><span>Item</span><strong>${number(amount)} ${g.currency}</strong></div>
    <div><span>Pembayaran</span><strong>${state.payment.name}</strong></div>
    <div><span>Total</span><strong>${rupiah(price + fee)}</strong></div>`;

  els.modal.classList.add("open");
  els.modal.setAttribute("aria-hidden", "false");
  $("#closeModal").focus();
  addFeedItem(g, amount, price, true);
}

function closeModal() {
  els.modal.classList.remove("open");
  els.modal.setAttribute("aria-hidden", "true");
  selectGame(state.game.id, false);
  state.payment = null;
  els.contact.value = "";
  renderPayments();
  updateSummary();
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const buyers = ["Raka", "Nadia", "Bima", "Salsa", "Dimas", "Aulia", "Fajar", "Citra", "Yoga", "Intan"];

function addFeedItem(game, amount, price, isYou = false) {
  const name = isYou ? "Kamu" : buyers[Math.floor(Math.random() * buyers.length)] + "***";
  const li = document.createElement("li");
  li.innerHTML = `
    ${iconHTML(game)}
    <div class="feed-info">
      <strong>${name} &middot; ${number(amount)} ${game.currency}</strong>
      <span>${game.name} &middot; baru saja</span>
    </div>
    <span class="feed-price">${rupiah(price)}</span>`;
  els.feed.prepend(li);
  while (els.feed.children.length > 4) els.feed.lastElementChild.remove();
}

function randomFeed() {
  const g = games[Math.floor(Math.random() * games.length)];
  const [amount, price] = g.items[Math.floor(Math.random() * g.items.length)];
  addFeedItem(g, amount, price);
}

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = number(Math.floor(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- Events ---------- */
els.filters.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  state.category = btn.dataset.cat;
  renderFilters();
  renderGames();
});

els.search.addEventListener("input", (e) => {
  state.query = e.target.value;
  renderGames();
});

els.grid.addEventListener("click", (e) => {
  const card = e.target.closest("[data-game]");
  if (card) selectGame(card.dataset.game);
});

els.items.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-item]");
  if (!btn) return;
  state.item = Number(btn.dataset.item);
  renderItems();
  renderPayments();
  updateSummary();
});

els.payments.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pay]");
  if (!btn) return;
  state.payment = Object.values(payments).flat().find((p) => p.id === btn.dataset.pay);
  renderPayments();
  updateSummary();
});

[els.userId, els.zoneId].forEach((input) =>
  input.addEventListener("input", () => {
    input.value = input === els.userId ? input.value.replace(/[^0-9]/g, "") : input.value;
    input.classList.remove("invalid");
    updateSummary();
  })
);

els.buyBtn.addEventListener("click", () => {
  const contact = els.contact.value.trim();
  if (contact && !/^(\+?\d{9,15}|[^\s@]+@[^\s@]+\.[^\s@]+)$/.test(contact)) {
    els.contact.classList.add("invalid");
    showToast("Format WhatsApp atau email belum benar");
    els.contact.focus();
    return;
  }
  els.buyBtn.disabled = true;
  els.buyBtn.textContent = "Memproses...";
  setTimeout(() => {
    els.buyBtn.textContent = "Beli Sekarang";
    openModal();
  }, 900);
});

els.contact.addEventListener("input", () => els.contact.classList.remove("invalid"));

$("#closeModal").addEventListener("click", closeModal);
els.modal.addEventListener("click", (e) => {
  if (e.target === els.modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && els.modal.classList.contains("open")) closeModal();
});

els.menuToggle.addEventListener("click", () => {
  const open = els.nav.classList.toggle("open");
  els.menuToggle.setAttribute("aria-expanded", String(open));
});

els.nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    els.nav.classList.remove("open");
    els.menuToggle.setAttribute("aria-expanded", "false");
  }
});

$("#checkBtn").addEventListener("click", () => showToast("Fitur cek transaksi segera hadir"));

$("#year").textContent = new Date().getFullYear();

/* ---------- Init ---------- */
renderFilters();
renderGames();
selectGame(games[0].id, false);
for (let i = 0; i < 4; i++) randomFeed();
setInterval(randomFeed, 4000);
animateCounters();
