// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import './styles/global.css';
import TransactionManagement from './pages/admin/TransactionManagement';
import SupportHelp from './pages/admin/SupportHelp';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Wrapped in AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="transactions" element={<TransactionManagement />} />
          <Route path="support" element={<SupportHelp />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
// src/App.tsx - VERSION ĐƠN GIẢN ĐỂ TEST
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<div style={{ padding: '40px', textAlign: 'center' }}>
//           <h1>🐾 Pet Store Test</h1>
//           <p>Website đang chạy!</p>
//           <a href="/login">Login</a>
//         </div>} />
        
//         <Route path="/login" element={<div style={{ padding: '40px', textAlign: 'center' }}>
//           <h1>Login Page</h1>
//         </div>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
