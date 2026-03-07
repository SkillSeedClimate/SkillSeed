import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { MissionDashboard } from "./pages/MissionDashboard";
import { MissionDetail } from "./pages/MissionDetail";
import { ProgressTracker } from "./pages/ProgressTracker";
import { CommunityChallenges } from "./pages/CommunityChallenges";
import { AuthPage } from "./pages/AuthPage";
import { PostProject } from "./pages/PostProject";
import { FundingResources } from "./pages/FundingResources";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "dashboard", Component: MissionDashboard },
      { path: "missions/:id", Component: MissionDetail },
      { path: "progress", Component: ProgressTracker },
      { path: "community", Component: CommunityChallenges },
      { path: "auth", Component: AuthPage },
      { path: "post-project", Component: PostProject },
      { path: "funding", Component: FundingResources },
    ],
  },
]);
