
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Vehiculos from "./pages/Vehiculos";
import Viajes from "./pages/Viajes";
import Gastos from "./pages/Gastos";
import Combustible from "./pages/Combustible";
import Peajes from "./pages/Peajes";
import Reportes from "./pages/Reportes";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import RecuperarPassword from "./pages/RecuperarPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner position="top-right" />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
            
            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/vehiculos" element={<AppLayout><Vehiculos /></AppLayout>} />
              <Route path="/viajes" element={<AppLayout><Viajes /></AppLayout>} />
              <Route path="/gastos" element={<AppLayout><Gastos /></AppLayout>} />
              <Route path="/combustible" element={<AppLayout><Combustible /></AppLayout>} />
              <Route path="/peajes" element={<AppLayout><Peajes /></AppLayout>} />
              <Route path="/reportes" element={<AppLayout><Reportes /></AppLayout>} />
            </Route>
            
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
