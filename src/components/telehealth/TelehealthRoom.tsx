import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  Maximize2,
  Minimize2,
  MessageSquare,
  Activity,
  FileText,
  ShieldCheck,
  Sparkles,
  Send,
  Plus,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Heart,
  Pill,
  Download,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { Doctor, Appointment } from '../../types';
import { useUIStore } from '../../stores/useUIStore';
import { useHealthRecordsStore } from '../../stores/useHealthRecordsStore';
import { usePrescriptionStore } from '../../stores/usePrescriptionStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';

interface TelehealthRoomProps {
  appointment?: Appointment | null;
  doctor?: Doctor | null;
  onLeaveCall: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: string;
  };
}

export function TelehealthRoom({
  appointment,
  doctor,
  onLeaveCall,
}: TelehealthRoomProps) {
  const { addToast } = useUIStore();
  const { vitals, addVitalReading } = useHealthRecordsStore();
  const { prescriptions } = usePrescriptionStore();

  // Video and Audio States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(145); // seconds (starts 02:25)
  const [sidebarTab, setSidebarTab] = useState<'chat' | 'vitals' | 'rx'>('chat');
  const [showCallSummary, setShowCallSummary] = useState(false);

  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'doctor',
      text: 'Hello Mr. Tanvir! I have reviewed your latest ECG and lipid profile. How are you feeling today?',
      timestamp: '10:02 AM',
    },
    {
      id: 'm-2',
      sender: 'patient',
      text: 'Hello Doctor. My blood pressure has been slightly elevated in the evening (around 135/88). No chest discomfort.',
      timestamp: '10:03 AM',
    },
    {
      id: 'm-3',
      sender: 'doctor',
      text: 'That is manageable. We will make a slight adjustment to the morning Losartan dosage and keep monitoring.',
      timestamp: '10:04 AM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Doctor Info fallback
  const doctorName = appointment?.doctorName || doctor?.name || 'Prof. Dr. M. A. Rashid';
  const doctorSpecialty = appointment?.doctorSpecialty || doctor?.specialty || 'Cardiology';
  const doctorAvatar = appointment?.doctorAvatar || doctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face';

  // Live Consultation Prescribed Rx simulation
  const [livePrescriptionItems, setLivePrescriptionItems] = useState([
    { name: 'Tab. Losartan Potassium', dosage: '50mg', frequency: '1 + 0 + 0 (Morning After Breakfast)', duration: '30 Days' },
    { name: 'Tab. Rosuvastatin', dosage: '10mg', frequency: '0 + 0 + 1 (Night After Dinner)', duration: '30 Days' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');

  // Call timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate doctor quick reply
    setTimeout(() => {
      const doctorReplies = [
        'Noted. I have updated your digital clinical notes.',
        'Please continue light 30-minute brisk walking daily.',
        'Drink adequate water and keep salt intake minimal.',
      ];
      const replyText = doctorReplies[Math.floor(Math.random() * doctorReplies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-doc-${Date.now()}`,
          sender: 'doctor',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 2000);
  };

  const handleAddLiveMedicine = () => {
    if (!newMedName) return;
    setLivePrescriptionItems((prev) => [
      ...prev,
      {
        name: newMedName,
        dosage: newMedDosage || '10mg',
        frequency: '1 + 0 + 1 (After Meals)',
        duration: '14 Days',
      },
    ]);
    setNewMedName('');
    setNewMedDosage('');
    addToast({
      type: 'success',
      title: 'Prescription Item Added',
      message: `${newMedName} added to live e-Rx.`,
    });
  };

  const handleEndCall = () => {
    setShowCallSummary(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111813] text-white select-none">
      {/* Top Header Bar */}
      <header className="flex h-14 items-center justify-between border-b border-[#2A3B30] bg-[#16221A] px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5F6F65] text-white shadow-xs">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#E2E8DF] leading-tight">
                {doctorName}
              </h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40 bg-emerald-950/40">
                Encrypted HD
              </Badge>
            </div>
            <p className="text-[11px] text-[#A0AFA2]">
              {doctorSpecialty} • Telehealth Live Consultation
            </p>
          </div>
        </div>

        {/* Live Call Duration & Connection */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-black/40 border border-[#2A3B30] px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
            <Clock className="h-3 w-3 text-emerald-400 animate-spin" />
            <span>{formatDuration(callDuration)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#A0AFA2]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>BMDC Verified Doctor</span>
          </div>
        </div>
      </header>

      {/* Main Content: Video Stage + Side Drawer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Canvas Stage */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-black/90 p-4 sm:p-6 overflow-hidden">
          {/* Doctor Primary Stream Simulation */}
          <div className="relative h-full w-full max-h-[78vh] max-w-5xl rounded-3xl overflow-hidden bg-radial from-[#1F2D24] to-[#0D140F] border border-[#2A3B30] flex items-center justify-center shadow-2xl">
            {/* Animated Doctor Video Stream Simulator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={doctorAvatar}
                alt={doctorName}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-90 filter contrast-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Doctor Live Overlay Watermark */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 rounded-2xl bg-black/60 backdrop-blur-md px-3.5 py-2 border border-white/10">
              <div className="flex h-3 w-3 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">{doctorName}</p>
                <p className="text-[10px] text-[#A0AFA2]">Audio: Active • 1080p 60fps</p>
              </div>
            </div>

            {/* Floating Patient Self-View (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 z-20 h-32 w-44 sm:h-40 sm:w-56 rounded-2xl overflow-hidden border-2 border-white/20 bg-[#16221A] shadow-2xl transition-all hover:scale-105">
              {isVideoOff ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#1A251E] text-zinc-400 p-2 text-center">
                  <User className="h-8 w-8 text-[#A0AFA2] mb-1" />
                  <span className="text-[10px]">Camera Paused</span>
                </div>
              ) : (
                <div className="relative h-full w-full bg-[#1e2920] flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face"
                    alt="Patient Stream"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white">
                    You (Tanvir Hossain)
                  </div>
                  {isMuted && (
                    <div className="absolute top-1.5 right-2 rounded-full bg-red-600 p-1 text-white shadow-xs">
                      <MicOff className="h-2.5 w-2.5" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Screen sharing banner if on */}
            {isScreenSharing && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-xl bg-blue-600/80 backdrop-blur-md px-3 py-1.5 text-xs text-white border border-blue-400/40">
                <Share2 className="h-3.5 w-3.5 animate-pulse" />
                <span>You are sharing your Diagnostic Screen</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Drawer Panel: Chat / Vitals / Live Prescription */}
        <div className="hidden md:flex w-96 flex-col border-l border-[#2A3B30] bg-[#16221A]">
          {/* Tabs */}
          <div className="flex border-b border-[#2A3B30] p-1 bg-[#111813]">
            <button
              type="button"
              onClick={() => setSidebarTab('chat')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                sidebarTab === 'chat'
                  ? 'bg-[#5F6F65] text-white font-bold'
                  : 'text-[#A0AFA2] hover:bg-[#1A251E] hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat</span>
              <span className="rounded-full bg-emerald-500/20 px-1 text-[10px] text-emerald-300">
                {messages.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSidebarTab('vitals')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                sidebarTab === 'vitals'
                  ? 'bg-[#5F6F65] text-white font-bold'
                  : 'text-[#A0AFA2] hover:bg-[#1A251E] hover:text-white'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Vitals HUD</span>
            </button>

            <button
              type="button"
              onClick={() => setSidebarTab('rx')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                sidebarTab === 'rx'
                  ? 'bg-[#5F6F65] text-white font-bold'
                  : 'text-[#A0AFA2] hover:bg-[#1A251E] hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Live e-Rx</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

          {/* Drawer Body: Chat */}
          {sidebarTab === 'chat' && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'patient' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-[10px] text-[#808D7C] mb-0.5">
                      {msg.sender === 'patient' ? 'You' : doctorName} • {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'patient'
                          ? 'bg-[#5F6F65] text-white rounded-tr-none'
                          : 'bg-[#213025] text-[#E2E8DF] border border-[#2E4133] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#2A3B30] bg-[#111813] flex gap-2">
                <input
                  type="text"
                  placeholder="Type symptoms or questions..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 rounded-xl bg-[#1D2920] border border-[#2E4133] px-3 py-2 text-xs text-white placeholder:text-[#6C7E70] focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#5F6F65] p-2 text-white hover:bg-[#4E5C53] transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Drawer Body: Vitals HUD */}
          {sidebarTab === 'vitals' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="rounded-2xl bg-[#1A251E] border border-[#2E4133] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#A0AFA2]">
                  <span>Connected Patient Metrics</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Live Synced
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-[#111813] p-2.5 border border-[#253629]">
                    <span className="text-[10px] text-[#808D7C] block">Blood Pressure</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">120/80</span>
                    <span className="text-[10px] text-[#A0AFA2] ml-1">mmHg</span>
                  </div>

                  <div className="rounded-xl bg-[#111813] p-2.5 border border-[#253629]">
                    <span className="text-[10px] text-[#808D7C] block">Pulse Rate</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">72</span>
                    <span className="text-[10px] text-[#A0AFA2] ml-1">bpm</span>
                  </div>

                  <div className="rounded-xl bg-[#111813] p-2.5 border border-[#253629]">
                    <span className="text-[10px] text-[#808D7C] block">Blood Oxygen (SpO₂)</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">99%</span>
                  </div>

                  <div className="rounded-xl bg-[#111813] p-2.5 border border-[#253629]">
                    <span className="text-[10px] text-[#808D7C] block">Fasting Glucose</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">5.8</span>
                    <span className="text-[10px] text-[#A0AFA2] ml-1">mmol/L</span>
                  </div>
                </div>
              </div>

              {/* Quick Vital Reading Injection */}
              <div className="rounded-2xl bg-[#1A251E] border border-[#2E4133] p-3.5 space-y-2 text-xs">
                <span className="font-bold text-[#E2E8DF] block">Record Current SpO₂ / BP to Doctor:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addVitalReading({
                      type: 'bp',
                      value: '120/80',
                      numericValue: 120,
                      unit: 'mmHg',
                      status: 'optimal',
                      notes: 'Logged during video consultation with ' + doctorName,
                    });
                    addToast({
                      type: 'success',
                      title: 'Vitals Logged to Doctor',
                      message: 'Blood pressure 120/80 mmHg synced to consultation notes.',
                    });
                  }}
                  className="w-full text-xs border-[#2E4133] bg-[#111813] text-[#E2E8DF] hover:bg-[#213025]"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-400 mr-1.5" />
                  Log BP (120/80) to Doctor Chart
                </Button>
              </div>
            </div>
          )}

          {/* Drawer Body: Live e-Prescription */}
          {sidebarTab === 'rx' && (
            <div className="flex flex-1 flex-col overflow-hidden p-4 space-y-4">
              <div className="rounded-2xl bg-[#1A251E] border border-[#2E4133] p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2E4133] pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">Live Consultation e-Prescription</h4>
                    <p className="text-[10px] text-[#A0AFA2]">Doctor's real-time medicine directives</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Auto-Signed
                  </Badge>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {livePrescriptionItems.map((item, idx) => (
                    <div key={idx} className="rounded-xl bg-[#111813] p-2.5 border border-[#253629] text-xs">
                      <div className="font-bold text-[#E2E8DF] flex items-center justify-between">
                        <span>{item.name} ({item.dosage})</span>
                        <span className="text-[10px] text-emerald-400">{item.duration}</span>
                      </div>
                      <p className="text-[11px] text-[#A0AFA2] mt-0.5">{item.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Medicine Directives */}
              <div className="rounded-2xl bg-[#1A251E] border border-[#2E4133] p-3.5 space-y-2 text-xs">
                <span className="font-bold text-[#E2E8DF] block">Add Medicine Instruction:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine (e.g. Napa Extra)"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    className="rounded-lg bg-[#111813] border border-[#2E4133] px-2 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (500mg)"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    className="rounded-lg bg-[#111813] border border-[#2E4133] px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddLiveMedicine}
                  className="w-full text-xs border-[#2E4133] bg-[#111813] text-[#E2E8DF] hover:bg-[#213025]"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add to e-Rx
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Call Control Bar */}
      <div className="flex h-20 items-center justify-center gap-3 sm:gap-4 border-t border-[#2A3B30] bg-[#16221A] px-4">
        {/* Mic Toggle */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all cursor-pointer ${
            isMuted
              ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400/40'
              : 'bg-[#2A3B30] text-white hover:bg-[#394E40]'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Video Toggle */}
        <button
          type="button"
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all cursor-pointer ${
            isVideoOff
              ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400/40'
              : 'bg-[#2A3B30] text-white hover:bg-[#394E40]'
          }`}
          title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </button>

        {/* Screen Share */}
        <button
          type="button"
          onClick={() => {
            setIsScreenSharing(!isScreenSharing);
            addToast({
              type: 'info',
              title: isScreenSharing ? 'Screen Share Ended' : 'Screen Share Active',
              message: isScreenSharing
                ? 'Returned to camera feed.'
                : 'Doctor can now see your uploaded lab test view.',
            });
          }}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-all cursor-pointer ${
            isScreenSharing
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-[#2A3B30] text-white hover:bg-[#394E40]'
          }`}
          title="Share Screen / Reports"
        >
          <Share2 className="h-5 w-5" />
        </button>

        {/* Mobile Sidebar Toggle */}
        <button
          type="button"
          onClick={() => setSidebarTab(sidebarTab === 'chat' ? 'vitals' : 'chat')}
          className="md:hidden flex h-12 w-12 items-center justify-center rounded-full bg-[#2A3B30] text-white hover:bg-[#394E40] cursor-pointer"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* End Call Button (Big Red) */}
        <button
          type="button"
          onClick={handleEndCall}
          className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-xl hover:bg-red-700 transition-all cursor-pointer"
        >
          <PhoneOff className="h-5 w-5" />
          <span>End Consultation</span>
        </button>
      </div>

      {/* Call Summary Modal */}
      {showCallSummary && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white text-[#1C231F] p-6 sm:p-8 space-y-6 shadow-2xl border border-[#C4CFC0]">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C231F]">
                Consultation Completed
              </h3>
              <p className="text-xs text-[#5F6F65]">
                Duration: {formatDuration(callDuration)} with <strong>{doctorName}</strong>
              </p>
            </div>

            {/* Prescribed Medicine Directives Preview */}
            <div className="rounded-2xl bg-[#F8FAF7] border border-[#E2E8DF] p-4 text-xs space-y-2">
              <div className="font-bold text-[#5F6F65] uppercase text-[10px] tracking-wider">
                Digital Prescription Generated ({livePrescriptionItems.length} Medicines)
              </div>
              {livePrescriptionItems.map((med, i) => (
                <div key={i} className="flex justify-between text-[#2B352F] pt-1">
                  <span>{med.name} ({med.dosage})</span>
                  <span className="text-[#5F6F65]">{med.duration}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Prescription PDF Downloaded',
                    message: 'Downloaded digital signed e-Rx for fulfillment.',
                  });
                }}
                className="gap-1.5 text-xs"
              >
                <Download className="h-4 w-4" />
                <span>Download e-Rx</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onLeaveCall();
                }}
                className="gap-1.5 text-xs"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Order Medicines & Exit</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
