'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Map as MapIcon,
  Users,
  Bell,
  Shield,
  Phone,
  Globe,
  ArrowRight,
  Activity,
  Package
} from 'lucide-react';

const AIAssistant = dynamic(() => import('@/components/AIAssistant'), {
  ssr: false
});

export default function Home() {
  const [language, setLanguage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'Flood', loc: 'Assam, Sector 4', urgency: 'Critical' },
    { id: 2, type: 'Medical', loc: 'Delhi, Karol Bagh', urgency: 'High' },
    { id: 3, type: 'Food', loc: 'Lucknow, Gomti Nagar', urgency: 'Standard' }
  ]);

  useEffect(() => {
    setMounted(true);
    // Shuffle alerts for "Live" feel
    const interval = setInterval(() => {
      setActiveAlerts(prev => [...prev.slice(1), prev[0]]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const languages = [
    { name: 'English', native: 'English' },
    { name: 'Hindi', native: 'हिन्दी' }
  ];

  if (!mounted) return null;

  if (!language) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emergency/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-safety/10 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg shadow-2xl border-white/5"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-emergency/20 rounded-3xl flex items-center justify-center border border-emergency/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Shield className="w-10 h-10 text-emergency" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white text-center mb-2 tracking-tighter">
            SURAKSHA <span className="text-emergency">SIGNAL</span>
          </h1>
          <p className="text-slate-400 text-center mb-10 text-lg">Select language to proceed</p>

          <div className="grid grid-cols-1 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.name}
                onClick={() => setLanguage(lang.name)}
                className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emergency/50 hover:bg-emergency/5 transition-all outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emergency/20 transition-colors">
                    <Globe className="w-5 h-5 text-slate-400 group-hover:text-emergency transition-colors" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-lg leading-none">{lang.native}</div>
                    <div className="text-slate-500 text-sm group-hover:text-slate-400 transition-colors">{lang.name}</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emergency group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-safety/30">
      <AIAssistant />

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 glass border-b-white/5 px-6 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 outline-none">
            <div className="w-10 h-10 bg-emergency rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline font-black text-xl tracking-tighter italic">SURAKSHA<span className="text-emergency">SIGNAL</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(null)}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium mr-2"
            >
              {language}
            </button>
            <Link href="/victim">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emergency px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2 animate-glow"
              >
                <AlertTriangle className="w-4 h-4" />
                SOS REPORT
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-emergency/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-safety/10 border border-safety/20 text-safety text-xs font-black tracking-widest uppercase mb-6">
              <Activity className="w-3 h-3" />
              Real-time Humanitarian Grid
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
              SECONDS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emergency via-safety to-emergency bg-[length:200%_auto] animate-pulse">SAVE LIVES</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
              Suraksha Signal is a decentralized, high-performance response platform designed to bridge the gap between victims and relief during critical hours.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/victim" className="flex-1 min-w-[200px]">
                <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                  Request Immediate Help
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/ngo" className="flex-1 min-w-[200px]">
                <button className="w-full glass py-4 rounded-2xl font-black text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  Volunteer Portal
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Live Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass rounded-[3rem] p-8 border-white/5 shadow-2xl overflow-hidden relative"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emergency rounded-full animate-ping" />
                <h3 className="font-black text-xl tracking-tight">LIVE STATUS FEED</h3>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Ops</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode='popLayout'>
                {activeAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.id + '-' + i}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.urgency === 'Critical' ? 'bg-emergency/20 text-emergency' :
                          alert.urgency === 'High' ? 'bg-safety/20 text-safety' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                        {alert.type === 'Flood' ? <Activity size={24} /> : alert.type === 'Medical' ? <Shield size={24} /> : <Package size={24} />}
                      </div>
                      <div>
                        <div className="font-bold">{alert.loc}</div>
                        <div className="text-xs text-slate-500 uppercase font-black">{alert.type} Alert</div>
                      </div>
                    </div>
                    <div className={`text-[10px] font-black px-2 py-1 rounded-md border ${alert.urgency === 'Critical' ? 'border-emergency/30 text-emergency' : 'border-slate-700 text-slate-500'
                      }`}>
                      {alert.urgency.toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Mapping */}
          <motion.div
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2.5rem] border-white/5 group transition-all hover:bg-white/[0.07]"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500/30 transition-colors relative">
              <MapIcon className="w-8 h-8 text-blue-500" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl animate-ping" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Real-time Mapping</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Precision geolocation tracking for every request. Visualizes disaster clusters to optimize deployment of first responders.
            </p>
            <div className="h-1 w-20 bg-blue-500/50 rounded-full" />
          </motion.div>

          {/* Card 2: Resources */}
          <motion.div
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2.5rem] border-white/5 group transition-all hover:bg-white/[0.07]"
          >
            <div className="w-16 h-16 bg-safety/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-safety/30 transition-colors">
              <Package className="w-8 h-8 text-safety" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Supply Coordination</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Oxygen Levels</span>
                <span className="text-safety font-bold">88%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-safety h-full w-[88%]" />
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-slate-400">Rations Status</span>
                <span className="text-blue-400 font-bold">Optimal</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Automated inventory management for NGOs to ensure the right supplies reach the right zones without waste.
            </p>
          </motion.div>

          {/* Card 3: Alerts */}
          <motion.div
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[2.5rem] border-white/5 group transition-all hover:bg-white/[0.07]"
          >
            <div className="w-16 h-16 bg-emergency/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emergency/30 transition-colors">
              <Bell className="w-8 h-8 text-emergency" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Community Alerts</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-2 h-2 bg-emergency rounded-full" />
                <span className="text-xs text-slate-300 italic">Heavy rainfall predicted in 2 hrs...</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 opacity-60">
                <div className="w-2 h-2 bg-slate-500 rounded-full" />
                <span className="text-xs text-slate-300 italic">Route 12 now cleared...</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Mass notification system via push, SMS, and USSD. Keeps the community informed during infrastructure blackouts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Persistence Info / SMS Footer */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-emergency/10 border border-emergency/20 p-8 md:p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10"
        >
          <div className="w-24 h-24 bg-emergency rounded-full flex items-center justify-center flex-shrink-0 animate-glow">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black mb-2 leading-tight">OFFLINE EMERGENCY ACCESS</h2>
            <p className="text-slate-400 text-lg mb-6 max-w-2xl">
              Networks fail. We don't. Send distress signals without internet using our direct SMS protocol or dial the USSD emergency code.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-black/50 px-6 py-3 rounded-2xl border border-white/10">
                <span className="text-slate-500 text-xs font-bold block mb-1">SMS FORMAT</span>
                <code className="text-emergency font-black">HELP [NAME] | [LOC]</code>
              </div>
              <div className="bg-black/50 px-6 py-3 rounded-2xl border border-white/10">
                <span className="text-slate-500 text-xs font-bold block mb-1">DESTINATION</span>
                <span className="text-white font-black">112 / +91-XXX-XXX</span>
              </div>
            </div>
          </div>
          <div className="text-5xl font-black text-white/10 hidden xl:block uppercase select-none leading-none">
            FALLBACK<br />ACTIVE
          </div>
        </motion.div>
      </section>

      {/* Quick Access Footer */}
      <footer className="border-t border-white/5 py-10 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm font-medium">
            © 2026 SURAKSHA SIGNAL • Humanitarian Open Source Project
          </div>
          <div className="flex items-center gap-8">
            <Link href="/ngo" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">NGO Admin</Link>
            <Link href="/mirror" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Sign Mirror
            </Link>
          </div>
        </div>
      </footer>

      {/* Emergency Pulser (Invisible anchor for accessibility) */}
      <div className="sr-only">Suraksha Signal System Active</div>
    </main>
  );
}
