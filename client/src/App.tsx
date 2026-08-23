import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import Education from "./pages/Education";

// Role-based dashboards
import CEODashboard from "./pages/dashboards/CEODashboard";
import MDDashboard from "./pages/dashboards/MDDashboard";
import HRDashboard from "./pages/dashboards/HRDashboard";
import BoardDashboard from "./pages/dashboards/BoardDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import GuardDashboard from "./pages/dashboards/GuardDashboard";
import SOCDashboard from "./pages/dashboards/SOCDashboard";

// Protected route wrapper
function ProtectedRoute({ component: Component, allowedRoles }: any) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path={"/"} component={isAuthenticated ? SOCDashboard : Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/education"} component={Education} />

      {/* Role-based dashboards */}
      <Route
        path={"/dashboard/ceo"}
        component={() => (
          <ProtectedRoute component={CEODashboard} allowedRoles={["admin"]} />
        )}
      />
      <Route
        path={"/dashboard/md"}
        component={() => (
          <ProtectedRoute component={MDDashboard} allowedRoles={["admin"]} />
        )}
      />
      <Route
        path={"/dashboard/hr"}
        component={() => (
          <ProtectedRoute component={HRDashboard} allowedRoles={["admin"]} />
        )}
      />
      <Route
        path={"/dashboard/board"}
        component={() => (
          <ProtectedRoute component={BoardDashboard} allowedRoles={["admin"]} />
        )}
      />
      <Route
        path={"/dashboard/manager"}
        component={() => (
          <ProtectedRoute
            component={ManagerDashboard}
            allowedRoles={["admin"]}
          />
        )}
      />
      <Route
        path={"/dashboard/guard"}
        component={() => (
          <ProtectedRoute component={GuardDashboard} allowedRoles={["user"]} />
        )}
      />
      <Route
        path={"/dashboard/soc"}
        component={() => (
          <ProtectedRoute component={SOCDashboard} allowedRoles={["admin"]} />
        )}
      />

      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <SpeedInsights />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
