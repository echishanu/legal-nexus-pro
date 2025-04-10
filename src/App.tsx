
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { CaseProvider } from "@/contexts/CaseContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { ClientProvider } from "@/contexts/ClientContext";
import { BillingProvider } from "@/contexts/BillingContext";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import Documents from "./pages/Documents";
import Clients from "./pages/Clients";
import Billing from "./pages/Billing";
import Companies from "./pages/Companies";
import Settings from "./pages/Settings";

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
                <DocumentProvider>
                  <ClientProvider>
                    <BillingProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter>
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/" element={<MainLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="cases" element={<Cases />} />
                            <Route path="cases/:id" element={<CaseDetail />} />
                            <Route path="documents" element={<Documents />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="billing" element={<Billing />} />
                            <Route path="calendar" element={<div className="p-8 text-center">Calendar Module (Coming Soon)</div>} />
                            <Route path="companies" element={<Companies />} />
                            <Route path="settings" element={<Settings />} />
                          </Route>
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </BillingProvider>
                  </ClientProvider>
                </DocumentProvider>
              </CaseProvider>
            </CompanyProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
