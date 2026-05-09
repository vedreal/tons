import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { GamepadOrbIcon, CheckBurstIcon, TrophyOrbIcon, FriendsIcon, DiamondCoinIcon } from "./icons/TonIcons";
import { useStore } from "@/lib/store";

const tabs = [
  { to: "/", label: "Game", Icon: GamepadOrbIcon },
  { to: "/tasks", label: "Tasks", Icon: CheckBurstIcon },
  { to: "/leaderboard", label: "Ranks", Icon: TrophyOrbIcon },
  { to: "/friends", label: "Friends", Icon: FriendsIcon },
];

export default function AppShell() {
  const { pathname } = useLocation();
  const { tons } = useStore();

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-gradient-ton opacity-30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[oklch(0.7_0.16_232)] opacity-40 blur-3xl" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-5">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-ton shadow-ton">
            <DiamondCoinIcon className="h-7 w-7 drop-shadow" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">TON Season</div>
            <div className="text-sm font-extrabold text-gradient-ton">Pixie Drop</div>
          </div>
        </div>
        <div className="glass-card flex items-center gap-2 rounded-full px-3 py-1.5">
          <DiamondCoinIcon className="h-5 w-5" />
          <span className="text-sm font-extrabold tabular-nums text-foreground">{tons.toLocaleString()}</span>
          <span className="text-[10px] font-bold text-muted-foreground">TONS</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="relative z-10 px-3 pb-4 pt-2">
        <div className="glass-card flex items-center justify-around rounded-3xl p-2">
          {tabs.map(({ to, label, Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`group relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-2 transition-all ${
                  active ? "bg-gradient-ton shadow-ton" : ""
                }`}
              >
                <Icon className={`h-7 w-7 transition-transform ${active ? "scale-110 drop-shadow" : "opacity-80 group-hover:scale-105"}`} />
                <span className={`text-[10px] font-extrabold tracking-wide ${active ? "text-white" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
