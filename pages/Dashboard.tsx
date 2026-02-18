import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { DollarSign, Truck, Calendar, AlertTriangle } from 'lucide-react';
import { MOCK_TRIPS, MOCK_TRUCKS } from '../constants';
import { VehicleStatus, TripStatus } from '../types';

const Dashboard: React.FC = () => {
  // Calculate KPIs
  const totalRevenue = MOCK_TRIPS.reduce((acc, trip) => acc + trip.value, 0);
  const activeTrips = MOCK_TRIPS.filter(t => t.status === TripStatus.IN_PROGRESS).length;
  const availableTrucks = MOCK_TRUCKS.filter(t => t.status === VehicleStatus.AVAILABLE).length;
  const delayedTrips = MOCK_TRIPS.filter(t => t.status === TripStatus.DELAYED).length;

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', value: 12000 },
    { name: 'Fev', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Abr', value: 22000 },
    { name: 'Mai', value: totalRevenue }, // Use current month logical proxy
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Geral</h1>
          <p className="text-slate-500">Visão geral das operações da Trans Martins</p>
        </div>
        <div className="mt-2 sm:mt-0 text-sm text-slate-500 bg-white px-3 py-1 rounded-md shadow-sm border border-slate-200">
          Última atualização: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Receita Total" 
          value={`R$ ${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="blue"
        />
        <KpiCard 
          title="Em Trânsito" 
          value={activeTrips.toString()} 
          icon={Truck} 
          color="indigo"
        />
        <KpiCard 
          title="Caminhões Livres" 
          value={availableTrucks.toString()} 
          icon={Calendar} 
          color="emerald"
        />
        <KpiCard 
          title="Atrasos" 
          value={delayedTrips.toString()} 
          icon={AlertTriangle} 
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Receita Mensal (2024)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Eficiência de Entregas</h3>
          <div className="h-64 flex items-center justify-center">
             {/* A simplified placeholder chart for variety */}
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Viagens Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">Origem</th>
                <th className="px-6 py-3">Destino</th>
                <th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRIPS.slice(0, 3).map((trip) => (
                <tr key={trip.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{trip.origin}</td>
                  <td className="px-6 py-4 text-slate-600">{trip.destination}</td>
                  <td className="px-6 py-4 text-slate-600">R$ {trip.value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${trip.status === TripStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                        trip.status === TripStatus.DELAYED ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => {
  const colorClasses: {[key: string]: string} = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Dashboard;
