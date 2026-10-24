import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { REMINDER_TEMPLATES } from '../data/templates.js';
import {
  GitBranch,
  Bell,
  Clock,
  AlertTriangle,
  PhoneCall,
  FileText,
  ShieldAlert,
  Pause,
  CheckCircle2,
  Languages
} from 'lucide-react';

export default function EscalationLadder() {
  const { t, ladderConfig, language, business } = useApp();
  const [previewLang, setPreviewLang] = useState(language || 'en');

  const stageIcons = {
    heads_up: Bell,
    due_date: Clock,
    firm_reminder: AlertTriangle,
    final_reminder: PhoneCall,
    demand_letter: FileText,
    next_steps: ShieldAlert
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.nav.escalationLadder}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated structured recovery sequence: starts polite, escalates gradually, pauses automatically on dispute or promise
          </p>
        </div>

        {/* Template Language Selector */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl shadow-xs">
          <Languages className="w-4 h-4 text-slate-400 ml-1" />
          <span className="text-xs font-semibold text-slate-500">Preview:</span>
          {['en', 'hi', 'mr'].map(code => (
            <button
              key={code}
              onClick={() => setPreviewLang(code)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                previewLang === code
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {code === 'en' ? 'English' : (code === 'hi' ? 'हिंदी' : 'मराठी')}
            </button>
          ))}
        </div>
      </div>

      {/* Ladder Pipeline Cards */}
      <div className="space-y-4">
        {ladderConfig.map((stage, idx) => {
          const Icon = stageIcons[stage.id] || Bell;
          const tmpl = REMINDER_TEMPLATES[stage.id];
          const langTmpl = tmpl ? (tmpl[previewLang] || tmpl.en) : null;

          return (
            <div
              key={stage.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden"
            >
              {/* Left Color Indicator Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  stage.daysOffset < 0
                    ? 'bg-blue-500'
                    : (stage.daysOffset === 0
                      ? 'bg-emerald-500'
                      : (stage.daysOffset <= 15 ? 'bg-amber-500' : 'bg-rose-500'))
                }`}
              />

              {/* Title & Trigger Day */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                    <Icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        Stage {idx + 1}: {previewLang === 'hi' ? (stage.titleHi || stage.title) : (previewLang === 'mr' ? (stage.titleMr || stage.title) : stage.title)}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {stage.daysOffset < 0 ? `${Math.abs(stage.daysOffset)} Days Before Due` : (stage.daysOffset === 0 ? 'On Due Date' : `+${stage.daysOffset} Days Overdue`)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    stage.channel === 'whatsapp'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : (stage.channel === 'letter'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20')
                  }`}>
                    Channel: {stage.channel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Template Preview */}
              {langTmpl && (
                <div className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {langTmpl.whatsapp || langTmpl.sms}
                </div>
              )}

              {/* Special Stage Notes */}
              {stage.id === 'demand_letter' && (
                <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs text-rose-800 dark:text-rose-300 space-y-1">
                  <div className="font-bold">⚠️ Statutory Notice Distinction:</div>
                  <p>
                    Always titled "Payment Demand Letter" with mandatory disclaimer: <em>"This letter is from {business.name} about money owed for the invoices listed below. It is not a notice from the GST department and not a legal notice from a lawyer."</em>
                  </p>
                  {business.udyamRegistered && (
                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                      ✓ Udyam Registered: Includes MSMED Act Section 15 & 16 late payment clause (compound interest at 3x RBI bank rate with monthly rests).
                    </p>
                  )}
                </div>
              )}

              {stage.id === 'next_steps' && (
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                  <div className="font-bold">45+ Days Overdue Advisory Workflow:</div>
                  <p className="mt-0.5">
                    1. Call customer director/promoter directly · 2. Consult independent commercial advocate · 3. File online claim on <strong>MSME Samadhaan portal</strong> (samadhaan.msme.gov.in) for delayed payments under Section 18 of MSMED Act. The app never sends legal threats automatically.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
