import { Truck, Driver, Trip, VehicleStatus, TripStatus } from './types';

export const MOCK_TRUCKS: Truck[] = [
  { id: 't1', plate: 'ABC-1234', model: 'Volvo FH 540', driverId: 'd1', status: VehicleStatus.IN_TRANSIT, lastLocation: 'São Paulo, SP', capacity: '30t' },
  { id: 't2', plate: 'XYZ-9876', model: 'Scania R450', driverId: 'd2', status: VehicleStatus.AVAILABLE, lastLocation: 'Curitiba, PR', capacity: '28t' },
  { id: 't3', plate: 'DEF-5678', model: 'Mercedes Actros', status: VehicleStatus.MAINTENANCE, lastLocation: 'Oficina Central', capacity: '30t' },
  { id: 't4', plate: 'GHI-9012', model: 'DAF XF', driverId: 'd3', status: VehicleStatus.IN_TRANSIT, lastLocation: 'Belo Horizonte, MG', capacity: '32t' },
  { id: 't5', plate: 'JKL-3456', model: 'Volvo VM', status: VehicleStatus.AVAILABLE, lastLocation: 'Porto Alegre, RS', capacity: '15t' },
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Carlos Silva', license: '123456789', phone: '(11) 99999-1111', status: 'Active' },
  { id: 'd2', name: 'Roberto Martins', license: '987654321', phone: '(41) 98888-2222', status: 'Active' },
  { id: 'd3', name: 'Fernando Souza', license: '456123789', phone: '(31) 97777-3333', status: 'Active' },
];

export const MOCK_TRIPS: Trip[] = [
  { id: 'tr1', truckId: 't1', driverId: 'd1', origin: 'São Paulo, SP', destination: 'Rio de Janeiro, RJ', cargoType: 'Eletrônicos', value: 4500, startDate: '2024-05-20', status: TripStatus.IN_PROGRESS },
  { id: 'tr2', truckId: 't4', driverId: 'd3', origin: 'Curitiba, PR', destination: 'Belo Horizonte, MG', cargoType: 'Peças Automotivas', value: 8200, startDate: '2024-05-18', status: TripStatus.DELAYED },
  { id: 'tr3', truckId: 't2', driverId: 'd2', origin: 'Porto Alegre, RS', destination: 'Florianópolis, SC', cargoType: 'Grãos', value: 3100, startDate: '2024-05-15', status: TripStatus.COMPLETED },
];
