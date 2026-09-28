import React from 'react';
import { Bus, Cpu, Globe2, ShieldCheck, Zap, Radio, Layers, Code } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      
      {/* Hero Intro */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <span>Public Transit Modernization Initiative</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white [text-wrap:balance]">
          Connecting Millions with Real-Time Transit Intelligence
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          RTC LiveTrack transforms state road public transportation into an interconnected, reliable, and passenger-friendly digital ecosystem. Our software engine turns raw AVL GPS pings into reliable arrival predictions.
        </p>
      </div>

      {/* Visual Image Banner with Generated Image */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
        <img
          src="/src/assets/images/rtc_commuter_app_1790616965956.jpg"
          alt="Passenger using RTC LiveTrack"
          referrerPolicy="no-referrer"
          className="h-72 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
          <div className="text-white text-xs">
            <span className="font-bold">Real-time Station Intelligence:</span> Commuters check live countdown ETAs at modern sheltered bus stops.
          </div>
        </div>
      </div>

      {/* 3 Core Technology Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 mb-3">
            <Radio className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sub-3s Telemetry Pipeline</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            High-frequency GPS devices installed on every vehicle stream speed, heading, and door status to ensure zero location lag.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 mb-3">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Electric EV Ready</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Integrated state of charge (SoC) monitoring and green route priority algorithms for zero-emission electric buses.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 mb-3">
            <Globe2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Open GTFS Realtime Spec</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Engineered to adhere to standard General Transit Feed Specification (GTFS-RT) feeds for inter-agency transit integrations.
          </p>
        </div>
      </div>

      {/* Developer API & Architecture Integration Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Architecture & API Backend Integration Guide
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          RTC LiveTrack is designed with clean architectural boundaries. The frontend interacts directly with our modular <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-blue-600">TransitService</code> layer, allowing drop-in replacement with real government REST / WebSocket endpoints.
        </p>

        <div className="rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
          <div className="text-slate-500">// Connect Real GPS Hardware Feed / WebSocket Endpoint:</div>
          <div className="text-emerald-400">const socket = new WebSocket('wss://api.rtc.gov.in/v1/telemetry/stream');</div>
          <div className="text-slate-400">socket.onmessage = (event) =&gt; &#123;</div>
          <div className="text-slate-300 pl-4">const busTelemetry = JSON.parse(event.data);</div>
          <div className="text-slate-300 pl-4">transitService.adminUpdateBus(busTelemetry);</div>
          <div className="text-slate-400">&#125;;</div>
        </div>
      </div>

    </div>
  );
};
