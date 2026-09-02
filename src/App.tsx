import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUIStore } from "./stores/useUIStore";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { DoctorProfilePage } from "./pages/DoctorProfilePage";
import { BookingPage } from "./pages/BookingPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { PrescriptionsPage } from "./pages/PrescriptionsPage";
import { EmergencyPage } from "./pages/EmergencyPage";
import { HealthRecordsPage } from "./pages/HealthRecordsPage";
import { LabTestsPage } from "./pages/LabTestsPage";
import { ChamberQueueTrackerPage } from "./pages/ChamberQueueTrackerPage";
import { FamilyProfilesPage } from "./pages/FamilyProfilesPage";
import { InsuranceClaimsPage } from "./pages/InsuranceClaimsPage";
import { TelehealthRoom } from "./components/telehealth/TelehealthRoom";
import { useAppointmentStore } from "./stores/useAppointmentStore";
import { Button } from "./components/ui/Button";
import { Search, Calendar, FileText } from "lucide-react";

export default function App() {
  const { currentRoute, navigate } = useUIStore();
  const { appointments } = useAppointmentStore();

  useEffect(() => {
    if (!window.history.state?.medibookRoute) {
      window.history.replaceState(
        {
          ...window.history.state,
          medibookRoute: currentRoute,
          medibookHistory: [],
        },
        "",
        window.location.href,
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      const route = event.state?.medibookRoute;
      if (!route) return;

      window.scrollTo({ top: 0, behavior: "smooth" });
      useUIStore.setState({
        currentRoute: route,
        routeHistory: event.state.medibookHistory || [],
        isMobileMenuOpen: false,
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentRoute]);

  const renderCurrentPage = () => {
    switch (currentRoute.path) {
      case "/":
        return <HomePage />;

      case "/search":
        return <SearchPage />;

      case "/doctors/:id":
        return <DoctorProfilePage doctorId={currentRoute.id} />;

      case "/book":
      case "/book/:id":
        return (
          <BookingPage
            doctorId={"id" in currentRoute ? currentRoute.id : undefined}
          />
        );

      case "/appointments":
      case "/dashboard/appointments":
        return (
          <AppointmentsPage
            initialTab={
              "tab" in currentRoute && currentRoute.tab
                ? currentRoute.tab
                : "upcoming"
            }
          />
        );

      case "/prescriptions":
      case "/dashboard/prescriptions":
        return <PrescriptionsPage />;

      case "/emergency":
        return <EmergencyPage />;

      case "/health-records":
        return <HealthRecordsPage />;

      case "/lab-tests":
        return <LabTestsPage />;

      case "/chamber-tracker":
        return <ChamberQueueTrackerPage />;

      case "/family-profiles":
        return <FamilyProfilesPage />;

      case "/insurance":
        return <InsuranceClaimsPage />;

      case "/telehealth": {
        const appointmentId =
          "appointmentId" in currentRoute
            ? currentRoute.appointmentId
            : undefined;
        const targetAppointment = appointments.find(
          (a) => a.id === appointmentId,
        );
        return (
          <TelehealthRoom
            appointment={targetAppointment}
            onLeaveCall={() => navigate({ path: "/dashboard/prescriptions" })}
          />
        );
      }

      default:
        // Fallback for any unknown route
        return (
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <div className="rounded-3xl border border-[#C4CFC0] bg-white p-12 shadow-sm">
              <h2 className="font-serif text-3xl font-normal text-[#1C231F]">
                Route: {(currentRoute as { path: string }).path}
              </h2>
              <p className="text-sm text-[#5F6F65] mt-2">
                This page is prepared for the upcoming development phase.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Button
                  variant="primary"
                  onClick={() => navigate({ path: "/" })}
                >
                  Return to Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ path: "/search" })}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={
            currentRoute.path +
            (currentRoute.path === "/doctors/:id"
              ? (currentRoute as any).id
              : "")
          }
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {renderCurrentPage()}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}
