import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import NinjaBattle from "./pages/Battle";
import DojoChallenge from "./pages/DojoChallenge";
import GameHome from "./pages/GameHome";
import HowToPlay from "./pages/HowToPlay";
import LoginPage from "./pages/LoginPage";
import NinjaProfile from "./pages/NinjaProfile";
import StoryMode from "./pages/StoryMode";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});
const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/game",
  component: GameHome,
});
const battleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/battle",
  component: NinjaBattle,
});
const dojoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dojo",
  component: DojoChallenge,
});
const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story",
  component: StoryMode,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: NinjaProfile,
});
const howToPlayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/how-to-play",
  component: HowToPlay,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  gameRoute,
  battleRoute,
  dojoRoute,
  storyRoute,
  profileRoute,
  howToPlayRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
