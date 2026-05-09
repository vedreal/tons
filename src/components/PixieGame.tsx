import { useEffect, useRef } from "react";
import { Application, Container, Graphics, Text } from "pixi.js";

type Props = {
  onCoin: (value: number) => void;
  onCombo: (combo: number) => void;
};

// Lightweight cartoon coin field + swipe combo ribbon, drawn purely with Graphics.
export default function PixieGame({ onCoin, onCombo }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onCoinRef = useRef(onCoin);
  const onComboRef = useRef(onCombo);
  onCoinRef.current = onCoin;
  onComboRef.current = onCombo;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let destroyed = false;
    const app = new Application();
    let cleanupFns: Array<() => void> = [];

    (async () => {
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });
      if (destroyed) {
        app.destroy(true);
        return;
      }
      host.appendChild(app.canvas);

      const stars = new Container();
      app.stage.addChild(stars);
      for (let i = 0; i < 28; i++) {
        const s = new Graphics().circle(0, 0, Math.random() * 1.6 + 0.6).fill({ color: 0xffffff, alpha: 0.7 });
        s.x = Math.random() * app.screen.width;
        s.y = Math.random() * app.screen.height;
        (s as any)._sp = Math.random() * 0.3 + 0.1;
        stars.addChild(s);
      }

      const coins = new Container();
      app.stage.addChild(coins);

      const ribbon = new Container();
      app.stage.addChild(ribbon);

      let combo = 0;
      let comboTimer = 0;

      function makeCoin() {
        const c = new Container();
        const r = 22 + Math.random() * 10;
        const shadow = new Graphics().ellipse(0, r + 6, r * 0.7, 4).fill({ color: 0x0a1628, alpha: 0.25 });
        const body = new Graphics()
          .circle(0, 0, r).fill(0x0098ea)
          .circle(-r * 0.3, -r * 0.3, r * 0.55).fill({ color: 0x7dd3fc, alpha: 0.9 })
          .circle(0, 0, r).stroke({ color: 0x0f62fe, width: 3, alpha: 0.9 });
        const t = new Text({
          text: "T",
          style: { fontFamily: "system-ui", fontSize: r, fontWeight: "900", fill: 0xffffff },
        });
        t.anchor.set(0.5);
        c.addChild(shadow, body, t);
        c.x = 40 + Math.random() * (app.screen.width - 80);
        c.y = -40;
        (c as any)._vy = 1.2 + Math.random() * 1.6;
        (c as any)._vr = (Math.random() - 0.5) * 0.06;
        (c as any)._r = r;
        c.eventMode = "static";
        c.cursor = "pointer";
        c.on("pointerdown", () => {
          combo = Math.min(combo + 1, 99);
          comboTimer = 60;
          const value = Math.round(r) + combo;
          onCoin(value);
          onCombo(combo);
          // burst
          for (let i = 0; i < 8; i++) {
            const p = new Graphics().circle(0, 0, 3).fill(0x7dd3fc);
            p.x = c.x;
            p.y = c.y;
            const ang = (i / 8) * Math.PI * 2;
            (p as any)._vx = Math.cos(ang) * 4;
            (p as any)._vy = Math.sin(ang) * 4;
            (p as any)._life = 30;
            ribbon.addChild(p);
          }
          // floating score text
          const txt = new Text({
            text: `+${value}`,
            style: { fontFamily: "system-ui", fontSize: 22, fontWeight: "900", fill: 0xffffff, stroke: { color: 0x0f62fe, width: 4 } },
          });
          txt.anchor.set(0.5);
          txt.x = c.x;
          txt.y = c.y;
          (txt as any)._float = 60;
          ribbon.addChild(txt);
          coins.removeChild(c);
          c.destroy();
        });
        coins.addChild(c);
      }

      let spawn = 0;
      const ticker = (time: any) => {
        const dt = time.deltaTime;
        spawn += dt;
        if (spawn > 22) {
          spawn = 0;
          makeCoin();
        }
        for (const s of stars.children) {
          s.y += (s as any)._sp * dt;
          if (s.y > app.screen.height) s.y = 0;
        }
        for (const c of [...coins.children]) {
          c.y += (c as any)._vy * dt;
          c.rotation += (c as any)._vr * dt;
          if (c.y > app.screen.height + 60) {
            coins.removeChild(c);
            c.destroy();
            combo = 0;
            onCombo(0);
          }
        }
        for (const p of [...ribbon.children]) {
          if ((p as any)._vx !== undefined) {
            p.x += (p as any)._vx;
            p.y += (p as any)._vy;
            (p as any)._vy += 0.2;
            (p as any)._life -= dt;
            p.alpha = Math.max(0, (p as any)._life / 30);
            if ((p as any)._life <= 0) { ribbon.removeChild(p); p.destroy(); }
          } else if ((p as any)._float !== undefined) {
            p.y -= 1.2 * dt;
            (p as any)._float -= dt;
            p.alpha = Math.max(0, (p as any)._float / 60);
            if ((p as any)._float <= 0) { ribbon.removeChild(p); p.destroy(); }
          }
        }
        if (comboTimer > 0) {
          comboTimer -= dt;
          if (comboTimer <= 0) { combo = 0; onCombo(0); }
        }
      };
      app.ticker.add(ticker);
      cleanupFns.push(() => app.ticker.remove(ticker));

      // swipe combo: swipe across screen to vacuum coins
      let sx = 0, sy = 0, swiping = false;
      const onDown = (e: PointerEvent) => { swiping = true; sx = e.clientX; sy = e.clientY; };
      const onMove = (e: PointerEvent) => {
        if (!swiping) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 60) {
          // collect all coins currently on screen
          for (const c of [...coins.children]) {
            const v = Math.round((c as any)._r);
            combo = Math.min(combo + 1, 99);
            comboTimer = 60;
            onCoin(v + combo);
            onCombo(combo);
            const trail = new Graphics().circle(0, 0, 4).fill(0x7dd3fc);
            trail.x = c.x; trail.y = c.y;
            (trail as any)._vx = dx > 0 ? 6 : -6;
            (trail as any)._vy = -2;
            (trail as any)._life = 30;
            ribbon.addChild(trail);
            coins.removeChild(c); c.destroy();
          }
          swiping = false;
        }
      };
      const onUp = () => { swiping = false; };
      host.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      cleanupFns.push(() => {
        host.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      });
    })();

    return () => {
      destroyed = true;
      cleanupFns.forEach((f) => f());
      try { app.destroy(true, { children: true }); } catch {}
    };
  }, [onCoin, onCombo]);

  return <div ref={hostRef} className="absolute inset-0" />;
}
