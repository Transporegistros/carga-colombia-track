
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Vehiculos from "./pages/Vehiculos";
import Viajes from "./pages/Viajes";
import Gastos from "./pages/Gastos";
import Combustible from "./pages/Combustible";
import Peajes from "./pages/Peajes";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/vehiculos" element={<AppLayout><Vehiculos /></AppLayout>} />
          <Route path="/viajes" element={<AppLayout><Viajes /></AppLayout>} />
          <Route path="/gastos" element={<AppLayout><Gastos /></AppLayout>} />
          <Route path="/combustible" element={<AppLayout><Combustible /></AppLayout>} />
          <Route path="/peajes" element={<AppLayout><Peajes /></AppLayout>} />
          <Route path="/reportes" element={<AppLayout><Reportes /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
