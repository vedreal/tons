import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { store, useStore } from "@/lib/store";
import { BoltIcon, CheckBurstIcon, DiamondCoinIcon, FriendsIcon, RocketIcon } from "@/components/icons/TonIcons";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

const TASKS = [
  { id: "join-tg", title: "Join TON Season Channel", reward: 500, Icon: RocketIcon, cta: "Join" },
  { id: "follow-x", title: "Follow on X / Twitter", reward: 300, Icon: BoltIcon, cta: "Follow" },
  { id: "invite-1", title: "Invite 1 Friend", reward: 800, Icon: FriendsIcon, cta: "Invite" },
  { id: "daily", title: "Daily Login Reward", reward: 150, Icon: DiamondCoinIcon, cta: "Claim" },
  { id: "boost", title: "Boost the Channel", reward: 1000, Icon: BoltIcon, cta: "Boost" },
];

export default function TasksPage() {
  const { completedTasks } = useStore();
  const [dir, setDir] = useState<"left" | "right">("right");
  const [index, setIndex] = useState(0);
  const startX = useRef(0);

  const onStart = (e: React.PointerEvent) => { startX.current = e.clientX; };
  const onEnd = (e: React.PointerEvent) => {
    const dx = e.clientX - startX.current;
    if (dx < -50 && index < TASKS.length - 1) { setDir("right"); setIndex(index + 1); }
    if (dx > 50 && index > 0) { setDir("left"); setIndex(index - 1); }
  };

  const featured = TASKS[index];
  const FeaturedIcon = featured.Icon;
  const done = completedTasks.includes(featured.id);

  return (
    <div className="h-full overflow-y-auto px-4 pt-2 pb-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black text-gradient-ton">Quests</h1>
          <p className="text-xs text-muted-foreground">Complete tasks to earn TONS</p>
        </div>
        <div className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold text-muted-foreground">
          {completedTasks.length}/{TASKS.length}
        </div>
      </div>

      {/* Featured swipe card */}
      <div
        className="relative h-44 select-none touch-pan-y"
        onPointerDown={onStart}
        onPointerUp={onEnd}
      >
        <div
          key={featured.id}
          className={`absolute inset-0 flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-ton-deep p-5 text-white shadow-ton shine-overlay ${
            dir === "right" ? "animate-swipe-in-right" : "animate-swipe-in-left"
          }`}
        >
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-white/10 backdrop-blur animate-bob">
            <FeaturedIcon className="h-20 w-20 drop-shadow-2xl" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.85_0.1_232)]">Featured Quest</div>
            <div className="mt-0.5 text-lg font-black leading-tight">{featured.title}</div>
            <div className="mt-1 flex items-center gap-1 text-sm font-extrabold">
              <DiamondCoinIcon className="h-5 w-5" /> +{featured.reward} TONS
            </div>
            <button
              disabled={done}
              onClick={() => store.completeTask(featured.id, featured.reward)}
              className="mt-2 rounded-full bg-white px-4 py-1.5 text-xs font-black text-[oklch(0.55_0.21_252)] shadow disabled:opacity-50"
            >
              {done ? "Completed" : featured.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-2 flex justify-center gap-1.5">
        {TASKS.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-gradient-ton" : "w-1.5 bg-muted"}`} />
        ))}
      </div>

      {/* List */}
      <div className="mt-4 space-y-2">
        {TASKS.map((t) => {
          const Icon = t.Icon;
          const isDone = completedTasks.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => store.completeTask(t.id, t.reward)}
              disabled={isDone}
              className="glass-card flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-ton shadow-ton">
                <Icon className="h-9 w-9" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-extrabold">{t.title}</div>
                <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  <DiamondCoinIcon className="h-4 w-4" /> +{t.reward} TONS
                </div>
              </div>
              <div className={`grid h-9 w-9 place-items-center rounded-full ${isDone ? "bg-gradient-ton" : "bg-muted"}`}>
                <CheckBurstIcon className={`h-7 w-7 ${isDone ? "" : "opacity-40"}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
