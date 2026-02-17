
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Fintrack from './pages/Fintrack/fintrack';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to="/login" />
}


function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />


      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route path="/fintrack" element={<PrivateRoute>
        <Fintrack />
      </PrivateRoute>} />


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;