import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  redirect,
} from '@tanstack/react-router';
import Layout from './components/Layout';
import ProfessorOakIntro from './pages/ProfessorOakIntro';
import StarterSelection from './pages/StarterSelection';
import GameHome from './pages/GameHome';
import Battle from './pages/Battle';
import StoryCampaign from './pages/StoryCampaign';
import GymBattles from './pages/GymBattles';
import PokemonRoster from './pages/PokemonRoster';
import TrainerProfile from './pages/TrainerProfile';
import LoginPage from './pages/LoginPage';

// Root route with Layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

// Intro
const introRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/intro',
  component: ProfessorOakIntro,
});

// Starter selection
const starterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/starter-selection',
  component: StarterSelection,
});

// Game home
const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GameHome,
});

// Battle
const battleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/battle',
  component: Battle,
});

// Story campaign
const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story',
  component: StoryCampaign,
});

// Gym battles
const gymsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gyms',
  component: GymBattles,
});

// Pokemon roster
const rosterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/roster',
  component: PokemonRoster,
});

// Trainer profile
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: TrainerProfile,
});

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
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
