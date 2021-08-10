import { ModuleWithProviders } from '@angular/core';
import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { Router } from '@angular/router';

export class FbError extends Error {

  public static UNSUPPORTED_TYPE: string = "Please provide a 'String', 'Uint8Array' or 'Array'.";

  constructor(public message: string, name?: string, baseError?: any) {
    super(message);
    this.name = name || "UnexpectedInput";
    this.stack = baseError && baseError?.stack ? baseError.stack : (<any>new Error()).stack;
  }

}

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) {
  }

  handleError(error) {

    let router = this.injector.get(Router);
    console.log('URL: ' + router.url);
    console.error('An error occurred:', error.message);
  }
}

@NgModule({

})
export class ErrorHandlingModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: ErrorHandlingModule,
      providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
        // {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true} 
      ]
    };
  }
}