// Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { menuItems } from './menuItems';

const Sidebar = () => {
  return (
    <div className='Sidebar w-[270px] bg-[#283342] h-screen overflow-y-scroll'>
      <div className='Logo w-full text-white flex items-center pl-6 bg-[#1D242E] gap-2 h-16'>
        <img src={logo} alt="Logo" className='w-12' />
        <h1 className='text-xl font-semibold'>PharmaChain</h1>
      </div>

      <div className='w-full py-4 text-white'>
        <div className='Profile w-full px-5 py-3'>
          <div className='flex items-center gap-3 p-1'>
            <img src="" alt="Profile" />
            <div className='flex items-center justify-between w-full'>
              <div className='flex flex-col'>
                <h4>Subash</h4>
                <h5 className='text-xs text-[#FED600]'>Distributor</h5>
              </div>
              <div className='w-3 h-6 bg-green-400'></div>
            </div>
          </div>
        </div>
        <div className='Nav w-full'>
          <ul className='flex flex-col '>
            {menuItems.map((item) => (
              <li key={item.label} className='text-sm'>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? 'py-3 px-5 flex gap-3 bg-[#009099]'
                      : 'py-3 px-5 flex gap-3 hover:bg-[#009099]'
                  }
                >
                  <img src={item.icon} alt={item.label} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
