import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import GameHome from './pages/GameHome';
import Battle from './pages/Battle';
import StoryCampaign from './pages/StoryCampaign';
import GymBattles from './pages/GymBattles';
import PokemonRoster from './pages/PokemonRoster';
import TrainerProfile from './pages/TrainerProfile';
import ProfessorOakIntro from './pages/ProfessorOakIntro';
import StarterSelection from './pages/StarterSelection';
import GameLore from './pages/GameLore';

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

const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LoginPage });
const introRoute = createRoute({ getParentRoute: () => rootRoute, path: '/intro', component: ProfessorOakIntro });
const starterRoute = createRoute({ getParentRoute: () => rootRoute, path: '/starter-selection', component: StarterSelection });
const gameRoute = createRoute({ getParentRoute: () => rootRoute, path: '/game', component: GameHome });
const battleRoute = createRoute({ getParentRoute: () => rootRoute, path: '/battle', component: Battle });
const storyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/story', component: StoryCampaign });
const gymsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gyms', component: GymBattles });
const rosterRoute = createRoute({ getParentRoute: () => rootRoute, path: '/roster', component: PokemonRoster });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile', component: TrainerProfile });
const loreRoute = createRoute({ getParentRoute: () => rootRoute, path: '/lore', component: GameLore });

const routeTree = rootRoute.addChildren([
  loginRoute,
  introRoute,
  starterRoute,
  gameRoute,
  battleRoute,
  storyRoute,
  gymsRoute,
  rosterRoute,
  profileRoute,
  loreRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
