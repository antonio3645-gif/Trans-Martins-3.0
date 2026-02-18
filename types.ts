export enum VehicleStatus {
  AVAILABLE = 'Disponível',
  IN_TRANSIT = 'Em Trânsito',
  MAINTENANCE = 'Manutenção',
}

export enum TripStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Progresso',
  COMPLETED = 'Concluído',
  DELAYED = 'Atrasado',
}

export interface Truck {
  id: string;
  plate: string;
  model: string;
  driverId?: string;
  status: VehicleStatus;
  lastLocation: string;
  capacity: string;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  status: 'Active' | 'On Leave';
}

export interface Trip {
  id: string;
  truckId: string;
  driverId: string;
  origin: string;
  destination: string;
  cargoType: string;
  value: number;
  startDate: string;
  status: TripStatus;
}

export interface KPI {
  totalRevenue: number;
  activeTrips: number;
  availableTrucks: number;
  delayedTrips: number;
}