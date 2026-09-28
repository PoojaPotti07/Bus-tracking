import React, { useState } from 'react';
import {
  HelpCircle,
  Phone,
  ShieldAlert,
  MapPin,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Send,
} from 'lucide-react';

export const HelpCenterPage: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [reportType, setReportType] = useState<'location' | 'lost' | 'complaint'>('location');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Form states
  const [busNumber, setBusNumber] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const faqs = [
    {
      q: 'How frequently does RTC LiveTrack update GPS positions?',
      a: 'Vehicles transmit automatic vehicle location (AVL) telemetry packets every 3 to 5 seconds. ETA predictions recalculate in real-time according to corridor congestion and stop dwell times.',
    },
    {
      q: 'Can I show digital student and senior concession passes on my phone?',
      a: 'Yes. Conductors on all City Ordinary, Metro Express, and Deluxe Express corridors accept verified digital QR passes directly from your device screen.',
    },
    {
      q: 'What should I do if an RTC bus does not show up on the live map?',
      a: 'If a bus does not appear, it might be undergoing mid-shift depot turnaround or a momentary GPS antenna blind spot. Check the corridor timetable or report the missing unit using our Report form below.',
    },
    {
      q: 'How does the seat occupancy gauge work?',
      a: 'Modern RTC fleet buses are equipped with smart automated passenger counting (APC) sensors above the front and rear doors that tally boarding and alighting in real time.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(
      `Your ticket #RTC-${Date.now().toString().slice(-6)} has been dispatched to depot operations.`
    );
    setBusNumber('');
    setIssueDescription('');
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Help, Passenger Support & Safety Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          24/7 dedicated transit assistance, rapid grievance reporting, Lost & Found desks, and women safety helpline.
        </p>
      </div>

      {/* Emergency Hotlines Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-900 dark:text-blue-200">
              RTC 24x7 Commuter Toll-Free
            </div>
            <div className="text-lg font-extrabold text-blue-700 dark:text-blue-300 font-mono">
              0866-2570005 / 1800-200-4599
            </div>
            <div className="text-[11px] text-blue-800/80 dark:text-blue-300/80">Available round-the-clock</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-rose-900 dark:text-rose-200">
              Women Safety & Emergency SOS
            </div>
            <div className="text-lg font-extrabold text-rose-700 dark:text-rose-300 font-mono">
              1091 / 112 (Instant Dispatch)
            </div>
            <div className="text-[11px] text-rose-800/80 dark:text-rose-300/80">Direct link to Transit Police</div>
          </div>
        </div>
      </div>

      {/* Report Grievance / Lost & Found Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Transit Report & Lost Item Registration
            </h3>
            <p className="text-xs text-slate-400">
              Directly routed to the Central Depot Station Master & Surveillance Cell.
            </p>
          </div>

          {/* Form category tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: 'location', label: 'GPS Offset' },
              { id: 'lost', label: 'Lost & Found' },
              { id: 'complaint', label: 'Route Feedback' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as any)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  reportType === tab.id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {submittedMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bus Number / Route Number
              </label>
              <input
                type="text"
                required
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="e.g. Bus 28 or Route 10K"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98480 XXXXX"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {reportType === 'lost'
                ? 'Description of Lost Property (Item, Seat Position, Date/Time)'
                : reportType === 'location'
                ? 'Location Offset Details (Observed position vs Live Map)'
                : 'Complaint or Route Suggestion Details'}
            </label>
            <textarea
              rows={3}
              required
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Provide specific station names or timings..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = activeAccordion === index;
            return (
              <div key={index} className="py-3">
                <button
                  onClick={() => setActiveAccordion(isOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
