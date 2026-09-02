import { create } from 'zustand';
import { ExtendedPrescription, MOCK_PRESCRIPTIONS } from '../data/mockPrescriptions';

const PRESCRIPTIONS_STORAGE_KEY = 'medibook_prescriptions_v1';
const MED_TRACKER_STORAGE_KEY = 'medibook_med_tracker_v1';
const PHARMACY_ORDERS_STORAGE_KEY = 'medibook_pharmacy_orders_v1';

export interface MedicineIntakeStatus {
  // key: "date_prescriptionId_medicineIndex_slot" (e.g. "2026-08-31_rx-2026-001_0_morning")
  [key: string]: boolean;
}

export interface PharmacyOrder {
  id: string;
  prescriptionId: string;
  doctorName: string;
  items: { name: string; dosage: string; price: number; quantity: string }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  status: 'Processing' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  estimatedDelivery: string;
}

interface PrescriptionState {
  prescriptions: ExtendedPrescription[];
  intakeLog: MedicineIntakeStatus;
  pharmacyOrders: PharmacyOrder[];
  activePrescription: ExtendedPrescription | null;
  searchQuery: string;
  selectedSpecialty: string;

  // Actions
  setActivePrescription: (prescription: ExtendedPrescription | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSpecialty: (specialty: string) => void;
  toggleMedicineIntake: (dateStr: string, rxId: string, medIndex: number, slot: 'morning' | 'afternoon' | 'night') => void;
  isMedicineTaken: (dateStr: string, rxId: string, medIndex: number, slot: 'morning' | 'afternoon' | 'night') => boolean;
  createPharmacyOrder: (orderData: Omit<PharmacyOrder, 'id' | 'createdAt' | 'status' | 'estimatedDelivery'>) => PharmacyOrder;
  getPrescriptionById: (id: string) => ExtendedPrescription | undefined;
}

function loadPrescriptions(): ExtendedPrescription[] {
  try {
    const raw = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to parse prescriptions from storage:', err);
  }
  return MOCK_PRESCRIPTIONS;
}

function loadIntakeLog(): MedicineIntakeStatus {
  try {
    const raw = localStorage.getItem(MED_TRACKER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse medication tracker log:', err);
  }
  return {};
}

function loadPharmacyOrders(): PharmacyOrder[] {
  try {
    const raw = localStorage.getItem(PHARMACY_ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse pharmacy orders:', err);
  }
  return [];
}

function persistPrescriptions(list: ExtendedPrescription[]) {
  try {
    localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

function persistIntakeLog(log: MedicineIntakeStatus) {
  try {
    localStorage.setItem(MED_TRACKER_STORAGE_KEY, JSON.stringify(log));
  } catch (e) {
    console.error(e);
  }
}

function persistPharmacyOrders(orders: PharmacyOrder[]) {
  try {
    localStorage.setItem(PHARMACY_ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error(e);
  }
}

export const usePrescriptionStore = create<PrescriptionState>((set, get) => ({
  prescriptions: loadPrescriptions(),
  intakeLog: loadIntakeLog(),
  pharmacyOrders: loadPharmacyOrders(),
  activePrescription: null,
  searchQuery: '',
  selectedSpecialty: 'All',

  setActivePrescription: (rx) => set({ activePrescription: rx }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSpecialty: (selectedSpecialty) => set({ selectedSpecialty }),

  toggleMedicineIntake: (dateStr, rxId, medIndex, slot) => {
    const key = `${dateStr}_${rxId}_${medIndex}_${slot}`;
    const current = get().intakeLog;
    const updated = {
      ...current,
      [key]: !current[key],
    };
    set({ intakeLog: updated });
    persistIntakeLog(updated);
  },

  isMedicineTaken: (dateStr, rxId, medIndex, slot) => {
    const key = `${dateStr}_${rxId}_${medIndex}_${slot}`;
    return !!get().intakeLog[key];
  },

  createPharmacyOrder: (orderData) => {
    const id = `order-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();
    const newOrder: PharmacyOrder = {
      ...orderData,
      id,
      createdAt: now,
      status: 'Processing',
      estimatedDelivery: 'Today, within 2-3 hours (Express Rider Assigned)',
    };
    const updated = [newOrder, ...get().pharmacyOrders];
    set({ pharmacyOrders: updated });
    persistPharmacyOrders(updated);
    return newOrder;
  },

  getPrescriptionById: (id) => {
    return get().prescriptions.find((p) => p.id === id);
  },
}));
