import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useCallback } from "react";
import { store, useStore } from "@/lib/store";
import { BoltIcon, DiamondCoinIcon, PixieIcon } from "@/components/icons/TonIcons";

const PixieGame = lazy(() => import("@/components/PixieGame"));

export const Route = createFileRoute("/")({ component: GamePage });

type GameState = "idle" | "playing" | "gameover" | "finished";

function GamePage() {
  const { energy, maxEnergy, winning } = useStore();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [gameKey, setGameKey] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(15);

  const handlePlay = () => {
    const ok = store.spendGameEnergy();
    if (!ok) return;
    setScore(0);
    setSecondsLeft(15);
    setGameKey((k) => k + 1);
    setGameState("playing");
  };

  const handleScore = useCallback((val: number) => {
    setScore((s) => s + val);
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState("gameover");
  }, []);

  const handleFinished = useCallback(() => {
    store.addWinning();
    setGameState("finished");
  }, []);

  const handleTick = useCallback((s: number) => {
    setSecondsLeft(s);
  }, []);

  return (
    <div className="relative h-full px-4 pb-2 pt-3">
      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="SCORE" value={score.toLocaleString()} icon={<DiamondCoinIcon className="h-5 w-5" />} />
        <Stat label="ENERGY" value={`${energy}/${maxEnergy}`} icon={<BoltIcon className="h-5 w-5" />} />
        <Stat label="WINNING" value={winning.toString()} icon={<PixieIcon className="h-5 w-5" />} />
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

        {gameState === "playing" && (
          <Suspense fallback={null}>
            <PixieGame
              key={gameKey}
              onScore={handleScore}
              onGameOver={handleGameOver}
              onFinished={handleFinished}
              onTick={handleTick}
            />
          </Suspense>
        )}

        {/* Timer HUD — shown only when playing */}
        {gameState === "playing" && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-2xl bg-white/10 px-4 py-1.5 backdrop-blur">
            <span className={`text-2xl font-black tabular-nums ${secondsLeft <= 5 ? "text-red-300" : "text-white"}`}>
              {secondsLeft}
            </span>
          </div>
        )}

        {/* Idle state */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <PixieIcon className="h-20 w-20 animate-float drop-shadow-2xl" />
            <div className="text-center">
              <div className="text-lg font-black text-white">Ready to play?</div>
              <div className="mt-0.5 text-xs text-white/70">Catch all coins in 15 seconds</div>
            </div>
            {energy > 0 ? (
              <button
                onClick={handlePlay}
                className="mt-1 rounded-full bg-white px-8 py-3 text-sm font-black text-[oklch(0.55_0.21_252)] shadow-lg active:scale-95 transition-transform"
              >
                Play  —  1 Energy
              </button>
            ) : (
              <div className="rounded-full bg-white/20 px-6 py-3 text-sm font-bold text-white/80 backdrop-blur">
                No energy left
              </div>
            )}
          </div>
        )}

        {/* Game over overlay */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm">
            <div className="rounded-full bg-red-500/30 px-5 py-2 text-lg font-black text-red-200 border border-red-400/40">GAME OVER</div>
            <div className="text-center">
              <div className="text-2xl font-black text-white">You missed a coin</div>
              <div className="mt-1 text-sm text-white/80">Score: <span className="font-extrabold text-white">{score}</span></div>
            </div>
            <div className="flex gap-3">
              {energy > 0 && (
                <button
                  onClick={handlePlay}
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-black text-[oklch(0.55_0.21_252)] shadow active:scale-95 transition-transform"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => setGameState("idle")}
                className="rounded-full bg-white/20 px-6 py-2.5 text-sm font-extrabold text-white backdrop-blur active:scale-95 transition-transform"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Finished overlay */}
        {gameState === "finished" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm">
            <div className="rounded-full bg-[oklch(0.5_0.2_140)]/40 px-5 py-2 text-lg font-black text-green-200 border border-green-400/40">FINISHED</div>
            <div className="text-center">
              <div className="text-2xl font-black text-white">All coins caught!</div>
              <div className="mt-1 text-sm text-white/80">Score: <span className="font-extrabold text-white">{score}</span></div>
              <div className="mt-0.5 text-xs text-white/70">Win #{winning} recorded</div>
            </div>
            <div className="flex gap-3">
              {energy > 0 && (
                <button
                  onClick={handlePlay}
                  className="rounded-full bg-white px-6 py-2.5 text-sm font-black text-[oklch(0.55_0.21_252)] shadow active:scale-95 transition-transform"
                >
                  Play Again
                </button>
              )}
              <button
                onClick={() => setGameState("idle")}
                className="rounded-full bg-white/20 px-6 py-2.5 text-sm font-extrabold text-white backdrop-blur active:scale-95 transition-transform"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Tap all coins before they fall — avoid the bombs!
      </p>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card flex items-center gap-2 rounded-2xl px-3 py-2">
      {icon}
      <div className="leading-tight">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-xs font-extrabold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
