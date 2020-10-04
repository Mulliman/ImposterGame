export * from './gameApi.service';
import { GameApiService } from './gameApi.service';
export * from './optionGridsApi.service';
import { OptionGridsApiService } from './optionGridsApi.service';
export * from './playerApi.service';
import { PlayerApiService } from './playerApi.service';
export * from './roundApi.service';
import { RoundApiService } from './roundApi.service';
export const APIS = [GameApiService, OptionGridsApiService, PlayerApiService, RoundApiService];
