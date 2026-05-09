import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import AppShell from "@/components/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-8 text-center">
        <h1 className="text-5xl font-black text-gradient-ton">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-6 text-center">
        <h1 className="text-lg font-extrabold">Something went wrong</h1>
        <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 rounded-full bg-gradient-ton px-4 py-2 text-sm font-extrabold text-white shadow-ton"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
      { title: "TON Season — Pixie Drop Airdrop Game" },
      { name: "description", content: "Tap, swipe & combo to earn TONS in the TON Season mini-game. Invite friends, complete tasks, climb the leaderboard." },
      { name: "theme-color", content: "#0098EA" },
      { property: "og:title", content: "TON Season — Pixie Drop" },
      { property: "og:description", content: "Airdrop game on Telegram. Earn TONS by tapping & swiping." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [{ src: "https://telegram.org/js/telegram-web-app.js", defer: true }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}

// AppShell renders <Outlet /> internally
export { Outlet };
