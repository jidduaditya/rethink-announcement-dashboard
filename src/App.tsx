import { Routes, Route } from 'react-router-dom'
import PublicBoard from './pages/PublicBoard'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'

function Placeholder({ name }: { name: string }) {
  return (
    <div className="pt-8">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-on-surface-variant text-sm">coming soon</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicBoard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unsubscribe" element={<Placeholder name="unsubscribe" />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Placeholder name="dashboard" />} />
        <Route path="new" element={<Placeholder name="new announcement" />} />
        <Route path="edit/:id" element={<Placeholder name="edit announcement" />} />
        <Route path="subscribers" element={<Placeholder name="subscribers" />} />
      </Route>
    </Routes>
  )
}
