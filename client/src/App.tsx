import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import League from './pages/League'
import { DEFAULT_LEAGUE_ID } from './utils/leagues'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/league" element={<Navigate to={`/league/${DEFAULT_LEAGUE_ID}`} replace />} />
      <Route path="/league/:id" element={<League />} />
    </Routes>
  )
}

export default App
