import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  ChevronRight,
  HeartHandshake,
  BadgeCheck,
  Stethoscope,
  Activity,
  PhoneCall,
  Video,
  Heart,
  TestTube,
  Radio,
} from "lucide-react";
import { useUIStore } from "../stores/useUIStore";
import { useSearchStore } from "../stores/useSearchStore";
import { useBookingStore } from "../stores/useBookingStore";
import {
  MOCK_DOCTORS,
  SPECIALTIES,
  MOCK_REVIEWS,
  CLINICS,
} from "../data/mockDoctors";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatCurrency } from "../lib/utils";
import { getSpecialtyIcon } from "../utils/specialtyIcons";
import { HealthTipsCarousel } from "../components/home/HealthTipsCarousel";
import { QuickActionsSection } from "../components/home/QuickActionsSection";

export function HomePage() {
  const { navigate } = useUIStore();
  const { setQuery, setSpecialty, setLocation } = useSearchStore();
  const { initBooking } = useBookingStore();

  // Local hero search state
  const [searchDocName, setSearchDocName] = useState("");
  const [selectedSpecialty, setSelectedSpecialtyState] = useState("All");
  const [selectedLocation, setSelectedLocationState] = useState("All");

  const popularDoctors = MOCK_DOCTORS.slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchDocName);
    setSpecialty(selectedSpecialty);
    setLocation(selectedLocation);
    navigate({
      path: "/search",
      query: {
        query: searchDocName,
        specialty: selectedSpecialty,
        location: selectedLocation,
      },
    });
  };

  const handleSelectSpecialtyCard = (specName: string) => {
    setSpecialty(specName);
    navigate({
      path: "/search",
      query: { specialty: specName },
    });
  };

  const handleBookDoctor = (docId: string) => {
    const doc = MOCK_DOCTORS.find((d) => d.id === docId);
    if (doc) {
      initBooking(doc);
      navigate({ path: "/book/:id", id: docId });
    }
  };

  const handleViewProfile = (docId: string) => {
    navigate({ path: "/doctors/:id", id: docId });
  };

  return (

  );
}
