import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';

// Screens
import Dashboard from './screens/Dashboard.jsx';
import Invoices from './screens/Invoices.jsx';
import NewInvoice from './screens/NewInvoice.jsx';
import Customers from './screens/Customers.jsx';
import TodayFollowups from './screens/TodayFollowups.jsx';
import EscalationLadder from './screens/EscalationLadder.jsx';
import CustomerPayPortal from './screens/CustomerPayPortal.jsx';
import Inbox from './screens/Inbox.jsx';
import Reconciliation from './screens/Reconciliation.jsx';
import CashForecast from './screens/CashForecast.jsx';
import ChaseFirst from './screens/ChaseFirst.jsx';
import Documents from './screens/Documents.jsx';
import InvoiceScanner from './screens/InvoiceScanner.jsx';
import Settings from './screens/Settings.jsx';

// Print Views
import PrintInvoice from './screens/PrintInvoice.jsx';
import PrintDemandLetter from './screens/PrintDemandLetter.jsx';
import PrintEvidencePack from './screens/PrintEvidencePack.jsx';

// Fallback Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-2xl font-bold mb-4">
            !
          </div>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-xs text-slate-400 max-w-md mb-4 font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow"
          >
            Clear Data & Reset Demo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const location = useLocation();
  const { textSize } = useApp();

  const isCustomerPortal = location.pathname.startsWith('/pay/');
  const isPrintView = location.pathname.startsWith('/print/');

  const textSizeClass =
    textSize === 'xl' ? 'text-lg leading-relaxed' : (textSize === 'large' ? 'text-base leading-normal' : 'text-sm');

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans ${textSizeClass}`}>
      {!isCustomerPortal && !isPrintView && <Navbar />}

      <main className={isCustomerPortal || isPrintView ? 'flex-1' : 'flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6'}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/new-invoice" element={<NewInvoice />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/followups" element={<TodayFollowups />} />
          <Route path="/ladder" element={<EscalationLadder />} />
          <Route path="/pay/:token" element={<CustomerPayPortal />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/reconciliation" element={<Reconciliation />} />
          <Route path="/cash-forecast" element={<CashForecast />} />
          <Route path="/chase-first" element={<ChaseFirst />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/scan" element={<InvoiceScanner />} />
          <Route path="/settings" element={<Settings />} />

          {/* Dedicated Clean A4 Print Routes */}
          <Route path="/print/invoice/:id" element={<PrintInvoice />} />
          <Route path="/print/demand-letter/:id" element={<PrintDemandLetter />} />
          <Route path="/print/evidence/:id" element={<PrintEvidencePack />} />

          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>

      {!isCustomerPortal && !isPrintView && (
        <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>Baaki</strong> — The Small Business Invoice Chase & Cash Shortage Defender · Sharma Packaging, Pune
            </div>
            <div className="text-[11px]">
              Strictly Whole Paise Arithmetic · GST Rules 2026 · MSMED Act 2006 Statutory Compliance
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
