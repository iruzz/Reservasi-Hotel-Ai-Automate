import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { BookingProvider } from './contexts/BookingContext';
import BookingServicesPage from './pages/BookingServicesPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import BookingSuccessPage from './pages/BookingSuccessPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* ✅ WRAP ROUTES WITH BOOKINGPROVIDER */}
        <BookingProvider>
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />
            
            {/* Booking Flow Routes */}
            <Route path="/booking/services" element={<BookingServicesPage />} />
            <Route path="/booking/checkout" element={<BookingCheckoutPage />} />
            <Route path="/booking/success/:bookingCode" element={<BookingSuccessPage />} />
            
            {/* 404 - MUST BE LAST */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BookingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;