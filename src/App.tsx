import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { CaseProvider } from "@/contexts/CaseContext";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CompanyProvider>
              <CaseProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="cases" element={<Cases />} />
                      <Route path="cases/:id" element={<CaseDetail />} />
                      <Route path="documents" element={<div className="p-8 text-center">Documents Module (Coming Soon)</div>} />
                      <Route path="clients" element={<div className="p-8 text-center">Clients Module (Coming Soon)</div>} />
                      <Route path="calendar" element={<div className="p-8 text-center">Calendar Module (Coming Soon)</div>} />
                      <Route path="billing" element={<div className="p-8 text-center">Billing Module (Coming Soon)</div>} />
                      <Route path="companies" element={<div className="p-8 text-center">Companies Module (Coming Soon)</div>} />
                      <Route path="settings" element={<div className="p-8 text-center">Settings Module (Coming Soon)</div>} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </CaseProvider>
            </CompanyProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
