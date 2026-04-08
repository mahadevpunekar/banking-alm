import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthProvider } from '@/context/AuthProvider'
import { DashboardPage } from '@/pages/DashboardPage'
import { DataIntegrationPage } from '@/pages/DataIntegrationPage'
import { IrrbbPage } from '@/pages/IrrbbPage'
import { LiquidityRiskPage } from '@/pages/LiquidityRiskPage'
import { LoginPage } from '@/pages/LoginPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { StressTestingPage } from '@/pages/StressTestingPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/liquidity" element={<LiquidityRiskPage />} />
            <Route path="/irrbb" element={<IrrbbPage />} />
            <Route path="/stress" element={<StressTestingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/data-integration" element={<DataIntegrationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
