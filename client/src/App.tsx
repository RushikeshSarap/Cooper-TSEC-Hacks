import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/error-boundary'
import { Chatbot } from '@/components/chatbot'
import { MessageSquare, X, Sparkles } from 'lucide-react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'
import CreateEventPage from './pages/CreateEventPage'
import JoinEventPage from './pages/JoinEventPage'
import EventDetailPage from './pages/EventDetailPage'
import SettingsPage from './pages/SettingsPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import AddExpenseCategoryPage from './pages/AddExpenseCategoryPage'
import UploadBillPage from './pages/UploadBillPage'
import DepositFundsPage from './pages/DepositFundsPage'
import MakePaymentPage from './pages/MakePaymentPage'
import SettlementSummaryPage from './pages/SettlementSummaryPage'
import EventLedgerPage from './pages/EventLedgerPage'
import AddExpensePage from './pages/AddExpensePage'
import WalletPage from './pages/WalletPage'
import ChatbotPage from './pages/ChatbotPage'

function App() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <ErrorBoundary>
            <div className="relative min-h-screen">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/create" element={<CreateEventPage />} />
                    <Route path="/events/join" element={<JoinEventPage />} />
                    <Route path="/events/:id" element={<EventDetailPage />} />

                    <Route path="/events/:id/bill/upload" element={<UploadBillPage />} />
                    <Route path="/events/:id/expenses/add" element={<AddExpensePage />} />
                    <Route path="/events/:id/settlements" element={<SettlementSummaryPage />} />
                    <Route path="/events/:id/ledger" element={<EventLedgerPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/settings/categories/add" element={<AddExpenseCategoryPage />} />
                    <Route path="/profile/setup" element={<ProfileSetupPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/wallet/deposit" element={<DepositFundsPage />} />
                    <Route path="/wallet/pay" element={<MakePaymentPage />} />
                    <Route path="/chatbot" element={<ChatbotPage />} />
                </Routes>

                {/* Global Chatbot Widget */}
                <div className="fixed bottom-6 right-6 z-50">
                    {isChatOpen ? (
                        <div className="bg-background/95 border border-border/50 rounded-2xl shadow-2xl w-[90vw] max-w-[400px] h-[550px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-md">
                            <div className="p-4 gradient-primary flex items-center justify-between text-white shrink-0">
                                <span className="font-semibold flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    SplitFlow AI Assistant
                                </span>
                                <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden p-4">
                                <Chatbot />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="w-14 h-14 rounded-full gradient-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
                        >
                            <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span className="absolute -top-2 -left-2 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default App
