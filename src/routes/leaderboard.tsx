import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { DiamondCoinIcon, PixieIcon, TrophyOrbIcon } from "@/components/icons/TonIcons";

export const Route = createFileRoute("/leaderboard")({ component: LeaderboardPage });

const SEED = [
  { name: "PixieKing", tons: 482300 },
  { name: "TonMaster", tons: 318420 },
  { name: "CryptoFox", tons: 219800 },
  { name: "MoonSwiper", tons: 154900 },
  { name: "StarTapper", tons: 98700 },
  { name: "BlueFalcon", tons: 76200 },
  { name: "NeoDrip", tons: 54100 },
  { name: "Voyager", tons: 41200 },
];

export default function LeaderboardPage() {
  const { tons } = useStore();
  const me = { name: "You", tons };
  const all = [...SEED, me].sort((a, b) => b.tons - a.tons);
  const myRank = all.findIndex((p) => p === me) + 1;
  const top3 = all.slice(0, 3);
  const rest = all.slice(3, 12);

  return (
    <div className="h-full overflow-y-auto px-4 pt-2 pb-4">
      <div className="mb-3">
        <h1 className="text-2xl font-black text-gradient-ton">Leaderboard</h1>
        <p className="text-xs text-muted-foreground">Season 1 · Top Pixie Hunters</p>
      </div>

      {/* Podium */}
      <div className="relative grid grid-cols-3 items-end gap-2 rounded-3xl bg-gradient-ton-deep p-4 text-white shadow-ton">
        {[top3[1], top3[0], top3[2]].map((p, i) => {
          const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
          const heights = [88, 110, 72];
          return (
            <div key={p?.name ?? i} className="flex flex-col items-center">
              <div className={`relative mb-2 grid place-items-center rounded-full bg-white/10 ${rank === 1 ? "h-16 w-16 animate-float" : "h-12 w-12 animate-float-slow"}`}>
                <PixieIcon className="h-10 w-10 drop-shadow" />
                {rank === 1 && <TrophyOrbIcon className="absolute -top-6 h-8 w-8 animate-bob" />}
              </div>
              <div className="text-[11px] font-extrabold">{p?.name}</div>
              <div className="flex items-center gap-1 text-[10px] font-bold opacity-90">
                <DiamondCoinIcon className="h-3 w-3" /> {p?.tons.toLocaleString()}
              </div>
              <div
                className="mt-2 w-full rounded-t-2xl bg-white/15"
                style={{ height: heights[i] }}
              >
                <div className="pt-2 text-center text-2xl font-black">{rank}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your rank */}
      <div className="mt-3 glass-card flex items-center gap-3 rounded-2xl p-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-ton text-sm font-black text-white">{myRank}</div>
        <div className="flex-1">
          <div className="text-sm font-extrabold">You</div>
          <div className="text-[11px] text-muted-foreground">Keep tapping to climb!</div>
        </div>
        <div className="flex items-center gap-1 text-sm font-extrabold">
          <DiamondCoinIcon className="h-5 w-5" /> {tons.toLocaleString()}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {rest.map((p, i) => {
          const isMe = p.name === "You";
          return (
            <div key={p.name + i} className={`flex items-center gap-3 rounded-2xl p-2.5 ${isMe ? "bg-gradient-ton text-white shadow-ton" : "glass-card"}`}>
              <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${isMe ? "bg-white text-[oklch(0.55_0.21_252)]" : "bg-muted"}`}>
                {i + 4}
              </div>
              <div className="flex-1 text-sm font-extrabold">{p.name}</div>
              <div className="flex items-center gap-1 text-xs font-bold tabular-nums">
                <DiamondCoinIcon className="h-4 w-4" /> {p.tons.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
