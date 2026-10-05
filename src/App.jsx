import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'

// function About() {
//   return (
//     <div className="about">
//       <h1>About WinterArc</h1>
//       <p>This is the about page.</p>
//     </div>
//   )
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App