import { Routes, Route } from 'react-router-dom'
import PublicBoard from './pages/PublicBoard'

function Placeholder({ name }: { name: string }) {
  return <div className="min-h-screen bg-background p-8 pt-24 text-on-surface-variant">{name} -- coming soon</div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicBoard />} />
      <Route path="/login" element={<Placeholder name="login" />} />
      <Route path="/admin" element={<Placeholder name="dashboard" />} />
      <Route path="/admin/new" element={<Placeholder name="new announcement" />} />
      <Route path="/admin/edit/:id" element={<Placeholder name="edit announcement" />} />
      <Route path="/admin/subscribers" element={<Placeholder name="subscribers" />} />
      <Route path="/unsubscribe" element={<Placeholder name="unsubscribe" />} />
    </Routes>
  )
}
