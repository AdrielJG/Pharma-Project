import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Regulators/Layout';
import Dashboard from './components/Regulators/Dashboard';
import Reports from './components/Regulators/Reports';
import Configuration from './components/Regulators/Configuration';
import Home from './components/Regulators/Home';
import Login from './components/Regulators/Login';
import ComplianceRecords from './components/Regulators/ComplianceRecords';
import Groups from './components/Regulators/Groups';
import Notification from './components/Regulators/Notification';
import ContactUs from './components/Regulators/ContactUs';
import Registration2 from './components/Registration/Registration2';
import Profile from './components/Regulators/ProfilePage';
import SalesReport from './components/Regulators/SalesReport';
import QReport from './components/Regulators/QualityReport';
import QualityRec from './components/Regulators/QualityRecords';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Route for login page */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* Routes for the rest of the application */}
        <Route path="/" element={<Layout />}>
          <Route path="/notifications" element={<Notification />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/compliance" element={<ComplianceRecords />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/sales" element={<SalesReport />} />
          <Route path="/qsales" element={<QReport />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/qualityrec" element={<QualityRec />} />
          <Route path="/registration2" element={<Registration2 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
