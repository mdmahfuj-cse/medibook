import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  Truck,
  ShieldCheck,
  MapPin,
  CreditCard,
  Wallet,
  Pill,
  ArrowRight,
  Phone,
  Building2,
  Clock,
} from 'lucide-react';
import { ExtendedPrescription } from '../../data/mockPrescriptions';
import { usePrescriptionStore } from '../../stores/usePrescriptionStore';
import { useUIStore } from '../../stores/useUIStore';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';

interface OrderMedicineModalProps {
  prescription: ExtendedPrescription | null;
  onClose: () => void;
}

export function OrderMedicineModal({ prescription, onClose }: OrderMedicineModalProps) {
  const { createPharmacyOrder } = usePrescriptionStore();
  const { addToast } = useUIStore();

  const [deliveryAddress, setDeliveryAddress] = useState('House 42, Road 7, Sector 3, Uttara, Dhaka 1230');
  const [patientPhone, setPatientPhone] = useState('01712-345678');
  const [selectedPharmacy, setSelectedPharmacy] = useState('Arogga / Lazz Pharma Hub (Dhaka)');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('bkash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');

  if (!prescription) return null;

  // Mock reasonable medicine pricing in Bangladeshi Taka (৳)
  const items = prescription.medicines.map((med, idx) => {
    const basePrices = [180, 240, 95, 320, 150];
    const price = basePrices[idx % basePrices.length];
    return {
      name: med.name,
      dosage: med.dosage,
      quantity: med.duration || '30 Days Pack',
      price: price,
    };
  });

  const subtotal = items.reduce((acc, curr) => acc + curr.price, 0);
  const deliveryFee = subtotal > 500 ? 0 : 60;
  const promoDiscount = 50; // Welcome discount
  const grandTotal = Math.max(0, subtotal + deliveryFee - promoDiscount);

  const handleSubmitOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order = createPharmacyOrder({
        prescriptionId: prescription.id,
        doctorName: prescription.doctorName,
        items,
        subtotal,
        deliveryFee,
        discount: promoDiscount,
        total: grandTotal,
        deliveryAddress,
        paymentMethod,
      });

      setIsSubmitting(false);
      setCompletedOrderId(order.id);
      setOrderComplete(true);

      addToast({
        type: 'success',
        title: 'Pharmacy Order Placed!',
        message: `Order ${order.id} confirmed for express doorstep delivery.`,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-[#C4CFC0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8DF] bg-[#F8FAF7] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans text-base font-bold text-[#1C231F]">
                Order Prescribed Medicines
              </h2>
              <p className="text-xs text-[#5F6F65]">
                100% Genuine Pharmacy Fulfillment • Express Home Delivery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#808D7C] hover:bg-[#E2E8DF] hover:text-[#1C231F] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {orderComplete ? (
          /* Order Confirmation Screen */
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#1C231F]">
                Order Confirmed!
              </h3>
              <p className="text-xs font-mono font-bold text-[#5F6F65]">
                Order ID: {completedOrderId}
              </p>
              <p className="text-sm text-[#5F6F65] max-w-md mx-auto pt-2">
                Your prescription from <strong>{prescription.doctorName}</strong> is verified by licensed pharmacists. An express courier has been assigned.
              </p>
            </div>

            <div className="mx-auto max-w-sm rounded-2xl bg-[#F0F4ED] border border-[#D8E2D4] p-4 text-left text-xs space-y-2 text-[#2B352F]">
              <div className="flex items-center gap-2 text-[#5F6F65] font-semibold">
                <Truck className="h-4 w-4" />
                <span>Estimated Delivery: Today, within 2-3 hours</span>
              </div>
              <div className="flex items-start gap-2 text-[#5F6F65]">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{deliveryAddress}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#D8E2D4] font-bold text-sm text-[#1C231F]">
                <span>Total Amount:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button variant="primary" onClick={onClose} className="px-8">
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Prescribed Items Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#808D7C]">
                <span>Items from Rx ({prescription.id})</span>
                <span>Verified Stock</span>
              </div>

              <div className="divide-y divide-[#E2E8DF] rounded-2xl border border-[#D8E2D4] bg-[#FAFCF9] p-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Pill className="h-4 w-4 text-[#5F6F65] shrink-0" />
                      <div>
                        <span className="font-bold text-[#1C231F]">{item.name}</span>
                        <div className="text-[11px] text-[#5F6F65]">
                          {item.dosage} • {item.quantity}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#1C231F]">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Contact */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#5F6F65]" />
                Delivery Address (Bangladesh)
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[#C4CFC0] p-3 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
                placeholder="Enter complete apartment, road, area, and district..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#5F6F65] block mb-1">
                    Contact Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2 text-xs text-[#1C231F]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#5F6F65] block mb-1">
                    Fulfillment Partner:
                  </label>
                  <select
                    value={selectedPharmacy}
                    onChange={(e) => setSelectedPharmacy(e.target.value)}
                    className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2 text-xs text-[#1C231F] bg-white"
                  >
                    <option value="Arogga / Lazz Pharma Hub (Dhaka)">Arogga Express (Dhaka Hub)</option>
                    <option value="Lazz Pharma Dhanmondi">Lazz Pharma (Dhanmondi / Panthapath)</option>
                    <option value="Popular Pharmacy Hub">Popular Diagnostic In-house Pharmacy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-[#5F6F65]" />
                Select Payment Mode
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`rounded-xl border p-3 text-center transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20 font-bold'
                      : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#1C231F] block">bKash</span>
                  <span className="text-[10px] text-[#5F6F65]">Instant Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`rounded-xl border p-3 text-center transition-all cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20 font-bold'
                      : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#1C231F] block">Nagad</span>
                  <span className="text-[10px] text-[#5F6F65]">Mobile Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-xl border p-3 text-center transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20 font-bold'
                      : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#1C231F] block">Cash on Delivery</span>
                  <span className="text-[10px] text-[#5F6F65]">Pay at doorstep</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`rounded-xl border p-3 text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20 font-bold'
                      : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                  }`}
                >
                  <span className="text-xs font-bold text-[#1C231F] block">Visa / Master</span>
                  <span className="text-[10px] text-[#5F6F65]">SSLCommerz</span>
                </button>
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className="rounded-2xl bg-[#F8FAF7] border border-[#E2E8DF] p-4 text-xs space-y-2">
              <div className="flex justify-between text-[#5F6F65]">
                <span>Medicines Subtotal:</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5F6F65]">
                <span>Home Delivery Fee:</span>
                <span className="font-mono">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE (Orders &gt; ৳500)</span> : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>MediBook Health Voucher:</span>
                <span className="font-mono">-{formatCurrency(promoDiscount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E2E8DF] text-sm font-bold text-[#1C231F]">
                <span>Payable Total:</span>
                <span className="font-mono text-base text-[#5F6F65]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {!orderComplete && (
          <div className="flex items-center justify-between border-t border-[#E2E8DF] bg-white px-6 py-4">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              onClick={handleSubmitOrder}
              className="gap-2 text-xs px-6"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{isSubmitting ? 'Verifying with Pharmacy...' : `Confirm & Order (${formatCurrency(grandTotal)})`}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
