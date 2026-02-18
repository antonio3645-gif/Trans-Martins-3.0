import React, { useState } from 'react';
import { Truck as TruckIcon, MapPin, AlertCircle, CheckCircle2, Search, X, Droplets, Wrench, Shield, DollarSign, FileText } from 'lucide-react';
import { MOCK_TRUCKS } from '../constants';
import { Truck, VehicleStatus } from '../types';

const Trucks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);

  const filteredTrucks = MOCK_TRUCKS.filter(truck => 
    truck.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Frota de Caminhões</h1>
          <p className="text-slate-500">Gerencie os veículos e seus status</p>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Buscar placa ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrucks.map((truck) => (
          <div key={truck.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <TruckIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{truck.plate}</h3>
                    <p className="text-sm text-slate-500">{truck.model}</p>
                  </div>
                </div>
                <StatusBadge status={truck.status} />
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  <span>{truck.lastLocation}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <div className="w-4 h-4 mr-2 flex items-center justify-center">
                    <span className="text-[10px] font-bold border border-slate-400 rounded px-0.5">KG</span>
                  </div>
                  <span>Capacidade: {truck.capacity}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
              <button 
                onClick={() => setSelectedTruck(truck)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver Detalhes
              </button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700">Histórico</button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTrucks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">Nenhum veículo encontrado.</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedTruck && (
        <TruckDetailsModal 
          truck={selectedTruck} 
          onClose={() => setSelectedTruck(null)} 
        />
      )}
    </div>
  );
};

// --- Subcomponents ---

const StatusBadge: React.FC<{ status: VehicleStatus }> = ({ status }) => {
  const styles = {
    [VehicleStatus.AVAILABLE]: 'bg-emerald-100 text-emerald-700',
    [VehicleStatus.IN_TRANSIT]: 'bg-blue-100 text-blue-700',
    [VehicleStatus.MAINTENANCE]: 'bg-amber-100 text-amber-700',
  };

  const Icon = {
    [VehicleStatus.AVAILABLE]: CheckCircle2,
    [VehicleStatus.IN_TRANSIT]: TruckIcon,
    [VehicleStatus.MAINTENANCE]: AlertCircle,
  }[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
};

interface TruckDetailsModalProps {
  truck: Truck;
  onClose: () => void;
}

const TruckDetailsModal: React.FC<TruckDetailsModalProps> = ({ truck, onClose }) => {
  // Generate mock costs based on truck ID to be consistent but varied
  const seed = truck.id.charCodeAt(truck.id.length - 1);
  const fuelCost = 8500 + (seed * 50);
  const maintenanceCost = 1200 + (seed * 20);
  const insuranceCost = 450;
  const totalCost = fuelCost + maintenanceCost + insuranceCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{truck.plate}</h2>
              <p className="text-sm text-slate-500">{truck.model}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Status Section */}
          <div className="mb-8 flex flex-wrap gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Atual</span>
              <div className="mt-1">
                <StatusBadge status={truck.status} />
              </div>
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Localização</span>
              <div className="mt-1 flex items-center text-slate-900 font-medium">
                <MapPin className="w-4 h-4 mr-1 text-slate-500" />
                {truck.lastLocation}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Motorista</span>
              <div className="mt-1 text-slate-900 font-medium">
                {truck.driverId ? `Motorista ${truck.driverId}` : 'Não atribuído'}
              </div>
            </div>
          </div>

          {/* Costs Section */}
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-slate-600" />
            Resumo de Custos (Mês Atual)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <CostCard 
              title="Combustível" 
              value={`R$ ${fuelCost.toLocaleString()}`} 
              icon={Droplets} 
              color="blue"
              trend="+2.5%"
            />
            <CostCard 
              title="Manutenção" 
              value={`R$ ${maintenanceCost.toLocaleString()}`} 
              icon={Wrench} 
              color="amber"
              trend="-1.2%"
            />
            <CostCard 
              title="Seguro / Documentos" 
              value={`R$ ${insuranceCost.toLocaleString()}`} 
              icon={Shield} 
              color="emerald"
            />
            <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-slate-300 text-sm font-medium">Custo Total</span>
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <span className="text-2xl font-bold">R$ {totalCost.toLocaleString()}</span>
                <p className="text-xs text-slate-400 mt-1">Acumulado em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</p>
              </div>
            </div>
          </div>

          {/* Maintenance Logs Placeholder */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Últimas Manutenções
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <Wrench size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Troca de Óleo e Filtros</p>
                      <p className="text-xs text-slate-500">15 de Maio, 2024</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700">R$ 850,00</span>
               </div>
               <div className="p-4 flex justify-between items-center hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Revisão de Freios</p>
                      <p className="text-xs text-slate-500">02 de Abril, 2024</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700">R$ 1.200,00</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CostCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: 'blue' | 'amber' | 'emerald';
  trend?: string;
}

const CostCard: React.FC<CostCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };

  const iconStyles = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className={`p-4 rounded-xl border border-slate-100 ${styles[color]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-semibold opacity-80">{title}</span>
        <div className={`p-1.5 rounded-lg ${iconStyles[color]}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold">{value}</span>
        {trend && (
           <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-red-500' : 'text-green-600'}`}>
             {trend}
           </span>
        )}
      </div>
    </div>
  );
}

export default Trucks;
