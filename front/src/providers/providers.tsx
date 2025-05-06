"use client";

import { AppointmentsProvider } from "@/contexts/appointmentContext";
import { AuthProvider } from "@/contexts/authContext";
import { ServiceProvider } from "@/contexts/serviceContext";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
      <AuthProvider>
        <ServiceProvider>
          <AppointmentsProvider>
            {children}
          </AppointmentsProvider>
        </ServiceProvider>
      </AuthProvider>
  );
}
