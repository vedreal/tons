import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { BoltIcon, FriendsIcon, RocketIcon } from "@/components/icons/TonIcons";

export const Route = createFileRoute("/friends")({ component: FriendsPage });

export default function FriendsPage() {
  const { refCode, friends } = useStore();
  const [copied, setCopied] = useState(false);
  const link = `https://t.me/TonSeasonBot/app?startapp=${refCode}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const share = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Join TON Season — earn ENERGY with me!")}`);
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}`, "_blank");
    }
  };

  const fakeFriends = [
    { name: "alex_ton",   earned: 12 },
    { name: "moon_pixie", earned: 9  },
    { name: "blu3wolf",   earned: 6  },
  ].slice(0, friends);

  return (
    <div className="h-full overflow-y-auto px-4 pt-2 pb-4">
      <h1 className="text-2xl font-black text-gradient-ton">Invite Friends</h1>
      <p className="text-xs text-muted-foreground">Earn ENERGY for every friend who joins</p>

      <div className="relative mt-3 overflow-hidden rounded-3xl bg-gradient-ton-deep p-5 text-white shadow-ton shine-overlay">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 animate-float">
            <RocketIcon className="h-12 w-12 drop-shadow" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">Your bonus</div>
            <div className="text-2xl font-black">+3 ENERGY</div>
            <div className="text-[11px] opacity-80">per friend who joins</div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white/10 p-2 backdrop-blur">
          <div className="text-[10px] uppercase tracking-wider opacity-70">Your code</div>
          <div className="font-mono text-lg font-black">{refCode}</div>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={share} className="flex-1 rounded-full bg-white py-2.5 text-sm font-black text-[oklch(0.55_0.21_252)] shadow active:scale-95">
            Share to Telegram
          </button>
          <button onClick={copy} className="rounded-full bg-white/15 px-4 py-2.5 text-sm font-extrabold backdrop-blur active:scale-95">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="glass-card flex items-center gap-2 rounded-2xl p-3">
          <FriendsIcon className="h-9 w-9" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Friends</div>
            <div className="text-lg font-black">{friends}</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-2 rounded-2xl p-3">
          <BoltIcon className="h-9 w-9" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Earned</div>
            <div className="text-lg font-black">{friends * 3} ENERGY</div>
          </div>
        </div>
      </div>

      <h2 className="mt-5 mb-2 text-sm font-extrabold text-muted-foreground">Your crew</h2>
      <div className="space-y-2">
        {fakeFriends.map((f) => (
          <div key={f.name} className="glass-card flex items-center gap-3 rounded-2xl p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-ton text-sm font-black text-white">
              {f.name[0].toUpperCase()}
            </div>
            <div className="flex-1 text-sm font-extrabold">@{f.name}</div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <BoltIcon className="h-4 w-4" /> +{f.earned} ENERGY
            </div>
          </div>
        ))}
        {fakeFriends.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No friends yet. Share your code!
          </div>
        )}
      </div>
    </div>
  );
}
