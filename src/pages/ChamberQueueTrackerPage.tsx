import { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  MapPin,
  QrCode,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Building,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useChamberQueueStore } from '../stores/useChamberQueueStore';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useUIStore } from '../stores/useUIStore';
import { ChamberQueue } from '../types/phase10';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function ChamberQueueTrackerPage() {
  const {
    queues,
    activeAppointmentId,
    setActiveAppointmentId,
    advanceQueue,
    setDoctorStatus,
    resetQueue,
    audioAlertEnabled,
    setAudioAlertEnabled,
  } = useChamberQueueStore();

  const { navigate } = useUIStore();
  const activeQueue = queues.find((q) => q.appointmentId === activeAppointmentId) || queues[0];

  const patientsAhead = Math.max(0, activeQueue.patientSerial - activeQueue.currentServingSerial);
  const estimatedWaitMinutes = patientsAhead * activeQueue.avgMinutesPerPatient;
  const isYourTurn = activeQueue.currentServingSerial === activeQueue.patientSerial;
  const isApproaching = patientsAhead <= 2 && patientsAhead > 0;

  const [alertChimePlayed, setAlertChimePlayed] = useState(false);

  // Play audio chime simulation when turn approaches
  useEffect(() => {
    if (isApproaching && audioAlertEnabled && !alertChimePlayed) {
      setAlertChimePlayed(true);
      // In web environment, we can trigger Web Audio API chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        // audio context suppressed
      }
    }
  }, [isApproaching, audioAlertEnabled, alertChimePlayed]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8DF] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                Live OPD Serial Sync
              </span>
              <span className="text-xs text-[#5F6F65]">Synced with Chamber Front-Desk Queue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C231F] mt-1.5">
              Live Chamber Serial & Queue Tracker
            </h1>
            <p className="text-sm text-[#5F6F65] mt-1">
              Track doctor chamber progress in real time, monitor patients ahead of you, and receive instant arrival alerts without waiting in crowded clinic lobbies.
            </p>
          </div>

          {/* Quick Select Chamber Queue */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase text-[#808D7C]">Active Serial:</label>
            <select
              value={activeQueue.appointmentId}
              onChange={(e) => setActiveAppointmentId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#C4CFC0] bg-white text-xs font-bold text-[#1C231F]"
            >
              {queues.map((q) => (
                <option key={q.appointmentId} value={q.appointmentId}>
                  {q.doctorName.split(' ')[2] || q.doctorName} (Serial #{q.patientSerial})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Turn Approaching / Your Turn Alert Banner */}
        {isYourTurn ? (
          <div className="p-5 rounded-3xl bg-emerald-600 text-white flex items-center justify-between shadow-lg animate-pulse">
            <div className="flex items-center gap-3">
              <BellRing className="h-7 w-7 text-white shrink-0" />
              <div>
                <h3 className="text-base font-bold">IT IS YOUR TURN NOW — PLEASE ENTER CHAMBER</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Doctor is calling Serial #{activeQueue.patientSerial}. Proceed to {activeQueue.chamberRoom}.
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-white text-emerald-900 font-bold text-xs">
              Active Call
            </span>
          </div>
        ) : isApproaching ? (
          <div className="p-5 rounded-3xl bg-amber-500 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-white animate-bounce shrink-0" />
              <div>
                <h3 className="text-sm font-bold">You are next in line! Only {patientsAhead} patient(s) ahead.</h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Please report to the floor reception at {activeQueue.chamberRoom}.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-black/20 text-white font-bold text-xs">
              ~{estimatedWaitMinutes} Mins Left
            </span>
          </div>
        ) : null}

        {/* Main Live Queue Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Queue Status & Serial Counter */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-time Serial Card */}
            <div className="bg-white rounded-3xl border border-[#C4CFC0] p-6 shadow-sm space-y-6">
              {/* Doctor Details Bar */}
              <div className="flex items-start justify-between gap-4 border-b border-[#E2E8DF] pb-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeQueue.doctorAvatarUrl}
                    alt={activeQueue.doctorName}
                    className="h-14 w-14 rounded-2xl object-cover border border-[#C4CFC0]"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#1C231F]">{activeQueue.doctorName}</h3>
                    <p className="text-xs text-[#5F6F65] font-medium">{activeQueue.doctorSpecialty}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#808D7C] mt-1">
                      <Building className="h-3.5 w-3.5 text-[#5F6F65]" />
                      <span>{activeQueue.chamberName}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Status Badge */}
                <div className="text-right">
                  <Badge
                    variant={
                      activeQueue.doctorStatus === 'in_chamber'
                        ? 'success'
                        : activeQueue.doctorStatus === 'delayed_15m'
                        ? 'warning'
                        : 'outline'
                    }
                    className="text-xs font-bold uppercase"
                  >
                    {activeQueue.doctorStatus.replace('_', ' ')}
                  </Badge>
                  <span className="text-[10px] text-[#808D7C] block mt-1">Updated {activeQueue.lastUpdated}</span>
                </div>
              </div>

              {/* Big Serial Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                {/* Currently Serving */}
                <div className="bg-[#F0F4ED] rounded-3xl p-5 border border-[#C4CFC0] flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#808D7C]">Currently In Chamber</span>
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-[#1C231F] mt-1">
                    #{activeQueue.currentServingSerial}
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold mt-1">
                    Consulting Now
                  </span>
                </div>

                {/* Your Serial */}
                <div className="bg-[#1C231F] text-white rounded-3xl p-5 border border-[#1C231F] flex flex-col justify-center shadow-md">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Your Serial Number</span>
                  <span className="text-4xl sm:text-5xl font-serif font-bold text-white mt-1">
                    #{activeQueue.patientSerial}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold mt-1">
                    {isYourTurn ? 'Calling Now' : `Token: ${activeQueue.gatePassToken}`}
                  </span>
                </div>

                {/* Estimated Wait Time */}
                <div className="col-span-2 sm:col-span-1 bg-[#FBFBFA] rounded-3xl p-5 border border-[#E2E8DF] flex flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#808D7C]">Estimated Wait</span>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#5F6F65] mt-1">
                    {patientsAhead === 0 ? '0' : `~${estimatedWaitMinutes}`} <span className="text-sm font-sans font-normal">mins</span>
                  </span>
                  <span className="text-[11px] text-[#808D7C] mt-1">
                    {patientsAhead} patient(s) ahead
                  </span>
                </div>
              </div>

              {/* Visual Serial Queue Progression */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#808D7C] mb-2 font-semibold">
                  <span>Queue Serial Progress</span>
                  <span>
                    Serial {activeQueue.currentServingSerial} of {activeQueue.totalSerialsBooked} booked
                  </span>
                </div>
                <div className="h-3 w-full bg-[#E2E8DF] rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#1C231F] h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${(activeQueue.currentServingSerial / activeQueue.totalSerialsBooked) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#808D7C] mt-1.5">
                  <span>Serial #1</span>
                  <span className="font-bold text-[#1C231F]">You: #{activeQueue.patientSerial}</span>
                  <span>Serial #{activeQueue.totalSerialsBooked}</span>
                </div>
              </div>

              {/* Chamber Address & Navigation */}
              <div className="p-4 rounded-2xl bg-[#F0F4ED]/60 border border-[#E2E8DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-[#1C231F] block">{activeQueue.chamberRoom}</strong>
                  <span className="text-[#5F6F65]">{activeQueue.chamberAddress}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Opening Google Maps direction to ${activeQueue.chamberName}`)}
                  className="inline-flex items-center gap-1 font-bold text-[#1C231F] hover:underline cursor-pointer"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#808D7C]" />
                  Directions <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Interactive Clinic Queue Simulator for Testing */}
            <div className="bg-[#F0F4ED] rounded-3xl border border-[#C4CFC0] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C231F]">
                    Live Queue Front-Desk Simulator (Demo Controls)
                  </h4>
                </div>
                <span className="text-[11px] text-[#5F6F65]">Interactive testing</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  type="button"
                  id="advance-queue-btn"
                  variant="primary"
                  size="sm"
                  onClick={() => advanceQueue(activeQueue.appointmentId)}
                  leftIcon={<Play className="h-3.5 w-3.5" />}
                  className="text-xs"
                >
                  Call Next Serial (+1)
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setDoctorStatus(
                      activeQueue.appointmentId,
                      activeQueue.doctorStatus === 'in_chamber' ? 'delayed_15m' : 'in_chamber'
                    )
                  }
                  className="text-xs"
                >
                  Toggle Doctor Status
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioAlertEnabled(!audioAlertEnabled)}
                  leftIcon={audioAlertEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                  className="text-xs"
                >
                  {audioAlertEnabled ? 'Chime ON' : 'Chime Muted'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => resetQueue(activeQueue.appointmentId)}
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                  className="text-xs"
                >
                  Reset to Serial #1
                </Button>
              </div>
            </div>
          </div>

          {/* Right Col: Digital Chamber Entry Gate Pass */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#C4CFC0] p-6 shadow-sm space-y-5 text-center relative overflow-hidden">
              <div className="bg-[#1C231F] text-white py-2 px-4 -mx-6 -mt-6 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Official Clinic Gate Pass</span>
              </div>

              {/* QR Code */}
              <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-[#E2E8DF] inline-block mx-auto">
                <QrCode className="h-32 w-32 text-[#1C231F] mx-auto" />
                <span className="text-[10px] font-mono font-bold text-[#808D7C] block mt-2">
                  {activeQueue.gatePassToken}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-left">
                <div className="flex justify-between py-1 border-b border-[#E2E8DF]">
                  <span className="text-[#808D7C]">Serial Number</span>
                  <strong className="text-[#1C231F] text-sm">#{activeQueue.patientSerial}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8DF]">
                  <span className="text-[#808D7C]">Room / Floor</span>
                  <strong className="text-[#1C231F]">{activeQueue.chamberRoom}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8DF]">
                  <span className="text-[#808D7C]">Shift</span>
                  <strong className="text-[#1C231F]">{activeQueue.shift} OPD</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#808D7C]">Verification</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Barcode Active
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#808D7C] leading-relaxed text-left bg-[#F0F4ED] p-3 rounded-2xl">
                Show this barcode to the floor assistant when entering the consulting room. No physical paper token needed.
              </p>
            </div>

            {/* Health Tips while waiting */}
            <div className="bg-[#E7EFE3]/50 rounded-3xl border border-[#C4CFC0] p-5 space-y-2">
              <h4 className="text-xs font-bold text-[#1C231F] flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-[#5F6F65]" />
                Preparing for Your Consultation
              </h4>
              <ul className="text-xs text-[#5F6F65] space-y-1 list-disc list-inside">
                <li>Keep your previous prescriptions and test reports handy.</li>
                <li>Write down your current medications and dosage.</li>
                <li>Note specific symptoms, duration, and pain triggers.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
