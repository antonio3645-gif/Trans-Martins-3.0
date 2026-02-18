import React from 'react';
import { LayoutDashboard, Truck, Map, BrainCircuit, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Frota', path: '/trucks', icon: Truck },
    { name: 'Viagens', path: '/trips', icon: Map },
    { name: 'IA Logistics', path: '/ai-assistant', icon: BrainCircuit },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Trans Martins</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.path) 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-sm font-bold text-slate-300">TM</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-500">Gestor de Frota</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
