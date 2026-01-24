
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'; 
import Fintrack from './pages/Fintrack/fintrack';
import Api from './pages/Home/Api';

function App() {
  return (
    <Routes>
  
      <Route path="/" element={<Home />} />

  
      <Route path="/fintrack" element={<Fintrack />} />
    </Routes>
  );
}

export default App;