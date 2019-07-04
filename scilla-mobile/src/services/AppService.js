/**
 * A singleton for globally-accessible services 
 */
// @flow
import { IAppService } from "./IAppService";
import { AppServiceImplWithFirebaseNative} from "./AppServiceImplWithFirebaseNative"

/* An AppService factory that returns an AppServiceImpl 
 * (i.e., AppServiceImplementation). This allows us to 
 * easily swap different app service implementations. 
 */
export default class AppService {
  static instance: IAppService;

  constructor() {
    if(AppService.instance) {
      return AppService.instance
    }

    // AppService.instance = new AppServiceImplWithFirebaseWeb();
    AppService.instance = new AppServiceImplWithFirebaseNative();
    return AppService.instance;
  }
}