import { useEffect, useRef } from "react";
import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";

type Props = {
  onScore: (value: number) => void;
  onGameOver: () => void;
  onFinished: () => void;
  onTick: (secondsLeft: number) => void;
};

const COIN_IMG = "https://gold-defensive-cattle-30.mypinata.cloud/ipfs/bafkreie6xttzzc7auyoajanpwqnef2cpuvakrs5z7s5h6d4kcgvqmfmu3i";
const GAME_DURATION = 30;
const SPAWN_INTERVAL_TICKS = 22; // ticks between spawns (~0.37s at 60fps) — matches original feel
const BOMB_CHANCE = 0.18;

export default function PixieGame({ onScore, onGameOver, onFinished, onTick }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onScoreRef = useRef(onScore);
  const onGameOverRef = useRef(onGameOver);
  const onFinishedRef = useRef(onFinished);
  const onTickRef = useRef(onTick);
  onScoreRef.current = onScore;
  onGameOverRef.current = onGameOver;
  onFinishedRef.current = onFinished;
  onTickRef.current = onTick;

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
      if (destroyed) { app.destroy(true); return; }
      host.appendChild(app.canvas);

      let coinTexture: any = null;
      try {
        coinTexture = await Assets.load(COIN_IMG);
      } catch { /* fallback to drawn coin */ }
      if (destroyed) { app.destroy(true); return; }

      // Stars background
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

      const particles = new Container();
      app.stage.addChild(particles);

      let gameOver = false;
      let timeLeft = GAME_DURATION;
      let elapsedMs = 0;
      let lastSecond = GAME_DURATION;
      let spawnTicks = 0;

      function makeCoin() {
        const isBomb = Math.random() < BOMB_CHANCE;
        const c = new Container();
        const r = 24;

        if (isBomb) {
          const txt = new Text({
            text: "💣",
            style: { fontFamily: "system-ui", fontSize: 44 },
          });
          txt.anchor.set(0.5);
          c.addChild(txt);
          (c as any)._r = r;
          (c as any)._isBomb = true;
        } else {
          if (coinTexture) {
            const sprite = new Sprite(coinTexture);
            sprite.anchor.set(0.5);
            sprite.width = r * 2;
            sprite.height = r * 2;
            c.addChild(sprite);
          } else {
            // fallback drawn coin
            const body = new Graphics()
              .circle(0, 0, r).fill(0x0098ea)
              .circle(-r * 0.3, -r * 0.3, r * 0.55).fill({ color: 0x7dd3fc, alpha: 0.9 })
              .circle(0, 0, r).stroke({ color: 0x0f62fe, width: 3, alpha: 0.9 });
            const t = new Text({
              text: "T",
              style: { fontFamily: "system-ui", fontSize: r, fontWeight: "900", fill: 0xffffff },
            });
            t.anchor.set(0.5);
            c.addChild(body, t);
          }
          (c as any)._r = r;
          (c as any)._isBomb = false;
        }

        c.x = r + 16 + Math.random() * (app.screen.width - r * 2 - 32);
        c.y = -r - 10;
        (c as any)._vy = 1.5 + Math.random() * 1.4;
        c.eventMode = "static";
        c.cursor = "pointer";
        c.on("pointerdown", () => {
          if (gameOver) return;
          if ((c as any)._isBomb) {
            gameOver = true;
            // Save position BEFORE removing/destroying
            const bx = c.x;
            const by = c.y;
            coins.removeChild(c);
            c.destroy();
            // red flash particles
            for (let i = 0; i < 10; i++) {
              const p = new Graphics().circle(0, 0, 5).fill(0xff3333);
              p.x = bx; p.y = by;
              const ang = (i / 10) * Math.PI * 2;
              (p as any)._vx = Math.cos(ang) * 6;
              (p as any)._vy = Math.sin(ang) * 6;
              (p as any)._life = 35;
              particles.addChild(p);
            }
            onGameOverRef.current();
          } else {
            const val = 20 + Math.floor(Math.random() * 31); // +20 to +50
            onScoreRef.current(val);
            // burst
            for (let i = 0; i < 8; i++) {
              const p = new Graphics().circle(0, 0, 3).fill(0x7dd3fc);
              p.x = c.x; p.y = c.y;
              const ang = (i / 8) * Math.PI * 2;
              (p as any)._vx = Math.cos(ang) * 4;
              (p as any)._vy = Math.sin(ang) * 4;
              (p as any)._life = 30;
              particles.addChild(p);
            }
            // floating text
            const txt = new Text({
              text: `+${val}`,
              style: { fontFamily: "system-ui", fontSize: 20, fontWeight: "900", fill: 0xffffff, stroke: { color: 0x0f62fe, width: 4 } },
            });
            txt.anchor.set(0.5);
            txt.x = c.x; txt.y = c.y;
            (txt as any)._float = 50;
            particles.addChild(txt);
            coins.removeChild(c);
            c.destroy();
          }
        });
        coins.addChild(c);
      }

      const ticker = (time: any) => {
        if (gameOver) return;
        const dt = time.deltaTime;
        const dtMs = time.deltaMS ?? (dt / 60) * 1000;

        elapsedMs += dtMs;
        spawnTicks += dt;

        // Spawn coins at same cadence as the original (every ~22 ticks)
        if (spawnTicks >= SPAWN_INTERVAL_TICKS) {
          spawnTicks -= SPAWN_INTERVAL_TICKS;
          makeCoin();
        }

        // Update time
        timeLeft = Math.max(0, GAME_DURATION - elapsedMs / 1000);
        const secondsLeftInt = Math.ceil(timeLeft);
        if (secondsLeftInt !== lastSecond) {
          lastSecond = secondsLeftInt;
          onTickRef.current(secondsLeftInt);
        }

        // Stars
        for (const s of stars.children) {
          s.y += (s as any)._sp * dt;
          if (s.y > app.screen.height) s.y = 0;
        }

        // Move coins
        for (const c of [...coins.children]) {
          c.y += (c as any)._vy * dt;
          if (c.y > app.screen.height + 60) {
            // Coin missed
            if (!(c as any)._isBomb) {
              gameOver = true;
              coins.removeChild(c);
              c.destroy();
              setTimeout(() => onGameOverRef.current(), 100);
              return;
            } else {
              // Bomb that went off screen — just remove it, not a game over
              coins.removeChild(c);
              c.destroy();
            }
          }
        }

        // Particles
        for (const p of [...particles.children]) {
          if ((p as any)._vx !== undefined) {
            p.x += (p as any)._vx;
            p.y += (p as any)._vy;
            (p as any)._vy += 0.25;
            (p as any)._life -= dt;
            p.alpha = Math.max(0, (p as any)._life / 30);
            if ((p as any)._life <= 0) { particles.removeChild(p); p.destroy(); }
          } else if ((p as any)._float !== undefined) {
            p.y -= 1.2 * dt;
            (p as any)._float -= dt;
            p.alpha = Math.max(0, (p as any)._float / 50);
            if ((p as any)._float <= 0) { particles.removeChild(p); p.destroy(); }
          }
        }

        // Game finished
        if (timeLeft <= 0 && !gameOver) {
          gameOver = true;
          // Clear remaining coins (don't trigger game over)
          for (const c of [...coins.children]) { coins.removeChild(c); c.destroy(); }
          setTimeout(() => onFinishedRef.current(), 100);
        }
      };

      app.ticker.add(ticker);
      cleanupFns.push(() => app.ticker.remove(ticker));

      // Spawn first coin immediately
      makeCoin();
    })();

    return () => {
      destroyed = true;
      cleanupFns.forEach((f) => f());
      try { app.destroy(true, { children: true }); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} className="absolute inset-0" />;
}
