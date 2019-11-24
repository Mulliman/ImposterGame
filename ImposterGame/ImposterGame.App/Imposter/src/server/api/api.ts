export * from './gameApi.service';
import { GameApiService } from './gameApi.service';
export * from './playerApi.service';
import { PlayerApiService } from './playerApi.service';
export const APIS = [GameApiService, PlayerApiService];
