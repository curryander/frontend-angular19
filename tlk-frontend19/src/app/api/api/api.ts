export * from './dokumentenstapel.service';
import { DokumentenstapelService } from './dokumentenstapel.service';
export * from './pages.service';
import { PagesService } from './pages.service';
export * from './vorgaenge.service';
import { VorgaengeService } from './vorgaenge.service';
export const APIS = [DokumentenstapelService, PagesService, VorgaengeService];
