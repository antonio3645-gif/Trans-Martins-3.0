import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Trucks from './pages/Trucks';
import Trips from './pages/Trips';
import AIAssistant from './pages/AIAssistant';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
            <div className="font-bold text-slate-900 text-lg">Trans Martins</div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </header>

          {/* Main Content Scrollable Area */}
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/trucks" element={<Trucks />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
