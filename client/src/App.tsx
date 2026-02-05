import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/error-boundary'
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
    return (
        <ErrorBoundary>
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
        </ErrorBoundary>
    )
}

export default App
