import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Package, User, Navigation, Truck, CircleDot } from 'lucide-react';
import { MOCK_TRIPS, MOCK_TRUCKS } from '../constants';
import { TripStatus, Trip, Truck as TruckType } from '../types';

// Coordenadas simuladas para o mapa esquemático (0-100%)
const LOCATIONS: Record<string, { x: number; y: number }> = {
  'São Paulo, SP': { x: 35, y: 65 },
  'Rio de Janeiro, RJ': { x: 65, y: 55 },
  'Curitiba, PR': { x: 25, y: 80 },
  'Belo Horizonte, MG': { x: 55, y: 30 },
  'Porto Alegre, RS': { x: 15, y: 90 },
  'Florianópolis, SC': { x: 30, y: 85 },
  'Brasília, DF': { x: 45, y: 15 },
};

const Trips: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Viagens</h1>
          <p className="text-slate-500">Monitoramento em tempo real e histórico de entregas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg border border-slate-200 flex">
            <button 
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'map' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Mapa Ao Vivo
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Lista
            </button>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
            <Package className="w-4 h-4 mr-2" />
            Nova Viagem
          </button>
        </div>
      </div>

      {viewMode === 'map' && (
        <LiveTrackingMap />
      )}

      {viewMode === 'list' && (
        <TripsTable />
      )}
      
      {/* Se estiver no modo mapa, mostramos a lista resumida abaixo também */}
      {viewMode === 'map' && (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Detalhamento das Viagens</h3>
            <TripsTable />
        </div>
      )}
    </div>
  );
};

// --- Componentes Auxiliares ---

const LiveTrackingMap: React.FC = () => {
  const activeTrips = useMemo(() => MOCK_TRIPS.filter(t => t.status === TripStatus.IN_PROGRESS), []);
  
  // Estado para controlar o progresso da animação (0 a 100%)
  // Key é o ID da viagem, Value é o progresso (0.0 a 1.0)
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    // Inicializa posições aleatórias para simular que já estão em caminho
    const initialProgress: Record<string, number> = {};
    activeTrips.forEach(trip => {
      initialProgress[trip.id] = Math.random() * 0.8; // Começa em algum lugar entre 0% e 80%
    });
    setProgressMap(initialProgress);

    // Loop de animação
    const interval = setInterval(() => {
      setProgressMap(prev => {
        const next = { ...prev };
        activeTrips.forEach(trip => {
          // Incrementa progresso. Se chegar a 1, volta para 0 (loop infinito para demo)
          if (next[trip.id] >= 1) {
             next[trip.id] = 0; 
          } else {
             next[trip.id] += 0.002; // Velocidade do movimento
          }
        });
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeTrips]);

  const getCoordinates = (locationName: string) => {
    return LOCATIONS[locationName] || { x: 50, y: 50 }; // Fallback para o centro
  };

  return (
    <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200">
      <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
        
        {/* Grid Background para Efeito Técnico */}
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* Mapa SVG das Rotas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activeTrips.map(trip => {
            const start = getCoordinates(trip.origin);
            const end = getCoordinates(trip.destination);
            return (
              <g key={`route-${trip.id}`}>
                {/* Linha da Rota */}
                <line 
                  x1={`${start.x}%`} y1={`${start.y}%`} 
                  x2={`${end.x}%`} y2={`${end.y}%`} 
                  stroke="#94a3b8" 
                  strokeWidth="2" 
                  strokeDasharray="4 4" 
                  opacity="0.6"
                />
                {/* Ponto de Origem */}
                <circle cx={`${start.x}%`} cy={`${start.y}%`} r="3" fill="#64748b" />
                {/* Ponto de Destino */}
                <circle cx={`${end.x}%`} cy={`${end.y}%`} r="3" fill="#ef4444" />
              </g>
            );
          })}
        </svg>

        {/* Camada de Caminhões (Elementos HTML absolutos) */}
        {activeTrips.map(trip => {
          const start = getCoordinates(trip.origin);
          const end = getCoordinates(trip.destination);
          const progress = progressMap[trip.id] || 0;
          
          // Interpolação Linear para Posição Atual
          const currentX = start.x + (end.x - start.x) * progress;
          const currentY = start.y + (end.y - start.y) * progress;
          
          const truck = MOCK_TRUCKS.find(t => t.id === trip.truckId);

          return (
            <div 
              key={trip.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10 transition-transform will-change-transform"
              style={{ left: `${currentX}%`, top: `${currentY}%` }}
            >
              {/* Ícone do Caminhão */}
              <div className="relative">
                <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-ping"></div>
                <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white relative z-10">
                  <Truck size={16} />
                </div>
                
                {/* Tooltip ao passar o mouse */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-20">
                  <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl">
                    <p className="font-bold mb-1">{truck?.plate || 'Desconhecido'}</p>
                    <p className="text-slate-300 flex items-center gap-1">
                        <Navigation size={10} />
                        {Math.round(progress * 100)}% concluído
                    </p>
                    <p className="text-slate-400 mt-1 truncate">
                        {trip.origin} ➝ {trip.destination}
                    </p>
                  </div>
                  {/* Seta do tooltip */}
                  <div className="w-2 h-2 bg-slate-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Legenda do Mapa */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 text-xs shadow-sm">
           <div className="font-semibold text-slate-800 mb-2">Monitoramento Ao Vivo</div>
           <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-slate-500"></div>
              <span className="text-slate-600">Origem</span>
           </div>
           <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-slate-600">Destino</span>
           </div>
           <div className="flex items-center gap-2">
              <CircleDot size={8} className="text-blue-600" />
              <span className="text-slate-600">Em Trânsito</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const TripsTable: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID / Data</th>
                <th className="px-6 py-4">Rota</th>
                <th className="px-6 py-4">Caminhão / Motorista</th>
                <th className="px-6 py-4">Carga</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TRIPS.map((trip) => {
                const truck = MOCK_TRUCKS.find(t => t.id === trip.truckId);
                return (
                  <tr key={trip.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">#{trip.id.toUpperCase()}</div>
                      <div className="flex items-center text-slate-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(trip.startDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-slate-900">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                          {trip.origin}
                        </div>
                        <div className="border-l border-slate-300 h-3 ml-[3px]"></div>
                        <div className="flex items-center text-slate-900">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          {trip.destination}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{truck?.plate || 'N/A'}</div>
                      <div className="flex items-center text-slate-500 mt-1 text-xs">
                         <User className="w-3 h-3 mr-1" />
                         Motorista {trip.driverId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{trip.cargoType}</div>
                      <div className="text-slate-500 text-xs">R$ {trip.value.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                       <StatusChip status={trip.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
}

const StatusChip: React.FC<{ status: TripStatus }> = ({ status }) => {
  const styles = {
    [TripStatus.PENDING]: 'bg-slate-100 text-slate-700',
    [TripStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
    [TripStatus.COMPLETED]: 'bg-green-100 text-green-700',
    [TripStatus.DELAYED]: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Trips;
