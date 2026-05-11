import './App.css'
import CallForm from './components/CallForm'
import VobizOverview from './components/VobizOverview'
import AIChat from './components/AIChat'
import { Landing } from './pages/Landing'
import SupportCenter from './pages/SupportCenter'
import SupportHub from './components/Support/SupportHub'
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<VobizOverview />} />
          <Route path="/call" element={<CallForm />} />
          <Route path="/ai" element={<AIChat />} />
          <Route path="/support-center" element={<SupportCenter />} />
        </Routes>
        <SupportHub />
      </BrowserRouter>
    </>
  )
}

export default App
