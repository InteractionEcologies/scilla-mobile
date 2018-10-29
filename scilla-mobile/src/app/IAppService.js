// @flow
import { IAuth, IDataSource } from "../libs/intecojs";

export type AppServiceConfig = {
  disableAuthPersistence?: boolean
}

export interface IAppService {
  initialize(config?: AppServiceConfig): void;
  auth: IAuth;
  ds: IDataSource;
  generatePushID(): string; 
}