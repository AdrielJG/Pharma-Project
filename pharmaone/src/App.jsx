import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import MedicineList from './components/Inventory/MedicineList';
import MedicineDetails from './components/Inventory/MedicineDetails';
import AddMedicine from './components/Inventory/AddMedicine';
import MedicineGroups from './components/Inventory/MedicineGroups';
import Configuration from './components/Configuration';
import Home from './components/Home';
import Login from './components/Login';
import ComplianceRecords from './components/ComplianceRecords';
import Groups from './components/Groups';
import OngoingOrders from './components/OngoingOrders';
import Notification from './components/Notification';
import DisOrders from './components/DisOrders';
import DispatchedOrders from './components/DispatchedOrders';

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
          <Route path="/disorder" element={<DisOrders />} />
          <Route path="/dispatch" element={<DispatchedOrders />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/inventory/medicinelist" element={<MedicineList />} />
          <Route path="/inventory/medicinegroups" element={<MedicineGroups />} />
          <Route path="/inventory/medicinelist/addmedicine" element={<AddMedicine />} />
          <Route path="/inventory/medicinelist/:id" element={<MedicineDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/compliance" element={<ComplianceRecords />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/orders" element={<OngoingOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
