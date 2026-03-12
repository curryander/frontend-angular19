export * from './api.service';
import { ApiService } from './api.service';
export * from './databaseHealthController.service';
import { DatabaseHealthControllerService } from './databaseHealthController.service';
export const APIS = [ApiService, DatabaseHealthControllerService];
