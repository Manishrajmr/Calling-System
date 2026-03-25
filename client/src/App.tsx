import './App.css'
import CallForm from './components/CallForm'
import VobizOverview from './components/VobizOverview'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/call" element={<CallForm />} />
        <Route path="/" element={<VobizOverview />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
