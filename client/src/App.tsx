import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import League from './pages/League'
import Login from './pages/Login'
import Match from './pages/Match'
import Register from './pages/Register'
import Team from './pages/Team'
import { DEFAULT_LEAGUE_ID } from './utils/leagues'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/league" element={<Navigate to={`/league/${DEFAULT_LEAGUE_ID}`} replace />} />
      <Route path="/league/:id" element={<League />} />
      <Route path="/match/:id" element={<Match />} />
      <Route path="/team/:id" element={<Team />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Everything inside needs a login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
