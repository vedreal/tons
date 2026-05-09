import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { store, useStore } from "@/lib/store";
import { BoltIcon, DiamondCoinIcon, PixieIcon } from "@/components/icons/TonIcons";

const PixieGame = lazy(() => import("@/components/PixieGame"));

export const Route = createFileRoute("/")({ component: GamePage });

function GamePage() {
  const { tons, energy, maxEnergy } = useStore();
  const [combo, setCombo] = useState(0);

  return (
    <div className="relative h-full px-4 pb-2 pt-3">
      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="TONS" value={tons.toLocaleString()} icon={<DiamondCoinIcon className="h-5 w-5" />} />
        <Stat label="Energy" value={`${energy}/${maxEnergy}`} icon={<BoltIcon className="h-5 w-5" />} />
        <Stat label="Combo" value={`x${combo}`} icon={<PixieIcon className="h-5 w-5" />} highlight={combo > 0} />
      </div>

      {/* Energy bar */}
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/60 shadow-inner">
        <div
          className="h-full bg-gradient-ton transition-all duration-500"
          style={{ width: `${(energy / maxEnergy) * 100}%` }}
        />
      </div>

      {/* Game arena */}
      <div className="relative mt-3 h-[58vh] overflow-hidden rounded-[2rem] bg-gradient-ton-deep shadow-ton">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(125,211,252,0.35),transparent_60%)]" />
        <Suspense fallback={null}>
          <PixieGame
            onCoin={(v) => {
              if (store.get().energy <= 0) return;
              store.addTons(v);
              store.spendEnergy(1);
            }}
            onCombo={setCombo}
          />
        </Suspense>

        {/* HUD overlay */}
        <div className="pointer-events-none absolute left-3 top-3 rounded-2xl bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
          Tap koin · Swipe ←→ vacuum
        </div>
        {combo >= 3 && (
          <div key={combo} className="pointer-events-none absolute right-3 top-3 animate-pop-in rounded-full bg-white px-3 py-1 text-xs font-black text-[oklch(0.55_0.21_252)] shadow-glow">
            🔥 COMBO x{combo}
          </div>
        )}

        {/* Pixie mascot */}
        <PixieIcon className="pointer-events-none absolute bottom-3 left-3 h-16 w-16 animate-float drop-shadow-2xl" />
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Hint: <span className="font-bold text-foreground">swipe</span> across the arena to vacuum all coins for a combo bonus.
      </p>
    </div>
  );
}

function Stat({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`glass-card flex items-center gap-2 rounded-2xl px-3 py-2 ${highlight ? "animate-pulse-glow" : ""}`}>
      {icon}
      <div className="leading-tight">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-xs font-extrabold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
