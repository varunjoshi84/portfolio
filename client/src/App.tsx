import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import { AuthProvider } from "@/hooks/useAuth";
import LoginModal from "@/components/LoginModal";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <LoginModal />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/admin" component={AdminDashboard} />
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
