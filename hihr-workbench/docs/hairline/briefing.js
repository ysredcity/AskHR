const {
  Cam, fit, proj, rad, fillet, poly, seg, mk, place,
  tween, tset, tval, tdone, register, pointer, disposer,
} = HL;

const W = 76, H = 78, FOLD = 13, GAP = 34;
const REST = [-16, -7, 7], BASE = [0, 7, 2], SHIFT = [-7, 1, 8];
const sheet = fillet([[0, 0], [W, 0], [W, H - FOLD], [W - FOLD, H], [0, H]], [3, 3, 1.2, 1.2, 3]);

function pose(P, i, angle, lift, spread) {
  const a = rad(angle), y = i * GAP + spread;
  const point = (u, v, back = 0) => P(u + SHIFT[i], y + v * Math.sin(a) - back, v * Math.cos(a) + lift);
  return {
    face: poly(sheet.map(([u, v]) => point(u, v))),
    back: poly(sheet.map(([u, v]) => point(u, v, 1.3))),
    fold: seg(point(W - FOLD, H), point(W - FOLD, H - FOLD)) + seg(point(W - FOLD, H - FOLD), point(W, H - FOLD)),
    rules: [H - 22, H - 34, H - 46, H - 58].map((v, k) => seg(point(17, v), point(k === 3 ? W - 28 : W - 12, v))).join(""),
    holes: [H - 22, H - 46, H - 58].map(v => point(7, v)),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stagger = value, active = -1;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-7, -40, 0], [84, 124, 0], [84, -40, 112], [-7, 124, 112]], 200, 166);
  const P = proj(C), group = mk("g", {}, svg);
  const cards = [0, 1, 2].map(i => {
    const g = mk("g", {}, group);
    const back = mk("path", { class: "lo" }, g);
    const face = mk("path", { class: i === 1 ? "sil hi" : "sil" }, g);
    const fold = mk("path", { class: "nf lo" }, g);
    const rules = mk("path", { class: "nf lo" }, g);
    const holes = [0, 1, 2].map(() => mk("circle", { r: 1.65, class: "dot off" }, g));
    return { back, face, fold, rules, holes, a: tween(REST[i]), z: tween(BASE[i]), spread: tween(0), last: "" };
  });
  const centers = cards.map((_, i) => {
    const a = rad(REST[i]);
    return P(W / 2 + SHIFT[i], i * GAP + H * .72 * Math.sin(a), H * .72 * Math.cos(a) + BASE[i]);
  });

  function draw(i, angle, lift, spread) {
    const card = cards[i], signature = [angle, lift, spread].map(n => n.toFixed(4)).join(",");
    if (signature === card.last) return;
    card.last = signature;
    const q = pose(P, i, angle, lift, spread);
    card.back.setAttribute("d", q.back);
    card.face.setAttribute("d", q.face);
    card.fold.setAttribute("d", q.fold);
    card.rules.setAttribute("d", q.rules);
    card.holes.forEach((hole, n) => place(hole, q.holes[n]));
  }
  cards.forEach((_, i) => draw(i, REST[i], BASE[i], 0));
  const loop = register(stage, (_dt, now) => {
    let moving = false;
    cards.forEach((card, i) => {
      draw(i, tval(card.a, now), tval(card.z, now), tval(card.spread, now));
      if (!tdone(card.a, now) || !tdone(card.z, now) || !tdone(card.spread, now)) moving = true;
    });
    return moving;
  });
  bag.add(loop.unregister);

  function pick([x, y]) {
    if (x < 72 || x > 328 || y < 56 || y > 270) return -1;
    return centers.reduce((best, center, i) => Math.abs(center[0] - x) < Math.abs(centers[best][0] - x) ? i : best, 0);
  }
  function select(next) {
    if (next === active) return;
    const from = next >= 0 ? next : active, now = performance.now();
    active = next;
    cards.forEach((card, i) => {
      const distance = Math.abs(i - from), delay = distance * stagger;
      tset(card.a, next < 0 ? REST[i] : i === next ? 0 : i < next ? -25 : 18, now, delay);
      tset(card.z, BASE[i] + (next === i ? 25 : 0), now, delay);
      tset(card.spread, next < 0 || next === i ? 0 : Math.sign(i - next) * 12, now, delay);
      card.face.classList.toggle("hi", i === (next < 0 ? 1 : next));
    });
    read.textContent = next < 0 ? "rest" : `简报 ${next + 1}`;
    loop.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: point => select(pick(point)), leave: () => select(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: v => { stagger = v; }, destroy: bag.dispose };
}

hairline({
  name: "briefing",
  means: "Three folded, punched report sheets: the one under the pointer rises and its neighbours part.",
  rules: [1, 2, 4, 5, 8, 9, 10],
  range: [20, 40, 60],
  tour: [[200, 135], [145, 155], [250, 110], null],
  mount,
});
