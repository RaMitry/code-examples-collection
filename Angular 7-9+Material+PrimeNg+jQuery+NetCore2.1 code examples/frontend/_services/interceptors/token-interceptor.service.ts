import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpSentEvent, HttpInterceptor, HttpEvent,
  HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent} from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { catchError, finalize, filter, take, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';

import { AppState } from '../../_store/reducers';
import { LoginFailure } from '../../_store/actions/auth.actions';
import { AuthService } from '../auth.service';
import { ErrorDialogService } from '../../common/error-dialog/errordialog.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    public auth: AuthService,
    // private confirmationService: ConfirmationService,
    public errorDialogService: ErrorDialogService,
    public toasterService: ToastrService,
    private store: Store<AppState>,
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler):
  Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {

    if (request.url.includes('token') || request.url.includes('login')) {

      return next.handle(this.addTokenToRequest(request, this.auth.getAuthToken()))
      .pipe(
        catchError(err => {

          if (request.url.includes('token')) {
            this.store.dispatch(new LoginFailure({errorCode: 5}));
            this.auth.logout();
          } else {
            if (err.name === 'HttpErrorResponse') {
              switch (err.status) {
                case 0:
                  this.store.dispatch(new LoginFailure({errorCode: 2}));
                  return of(err);
                case 401:
                  this.store.dispatch(new LoginFailure({errorCode: 1}));
                  return of(err);
                case 400:
                  this.store.dispatch(new LoginFailure({errorCode: 4}));
                  return of(err);
                default:
                  this.store.dispatch(new LoginFailure({errorCode: 0}));
                  return of(err);
                }
              // If error status is different than 401
              // we want to skip refresh token
              // So we check that and throw the error if it's the case
            }
          }
        }
      ));

    } else {

      return next.handle(this.addTokenToRequest(request, this.auth.getAuthToken()))
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && Math.floor(event.status / 100) === 2 ) {

            const tokenGotTimeString = localStorage.getItem('tokenGotTime');
            const tokenGotTime = parseInt(tokenGotTimeString, 10);

            if (tokenGotTimeString && ((Date.now() - tokenGotTime) > 20000)) {

              this.auth.refreshToken().subscribe(result => {

                const newToken = result;
                const userData = localStorage.getItem('user');
                let userDataObj = JSON.parse(userData);
                userDataObj = {...userDataObj, token: newToken};

                if (userDataObj && userDataObj.email) {
                  this.setTokenToLocalStorage(newToken, userDataObj)
                }
              });
            }
          }
        }),
        catchError(err => {

          const reason = err && err.message ? err.message
          : (err && err.status && err.statusText ? err.status + ': ' + err.statusText : 'An error occurred');

          if (err.name === 'HttpErrorResponse') {
            switch (err.status) {
              case 0:
                this.store.dispatch(new LoginFailure({errorCode: 2}));
                return of(err);
              case 401:
                return this.handle401Error(request, next);
              case 400:
                this.store.dispatch(new LoginFailure({errorCode: 3}));
                return <any>this.auth.logout();
              default:
                this.store.dispatch(new LoginFailure({errorCode: 0}));
                return of(err);
              }
            // If error status is different than 401
            // we want to skip refresh token
            // So we check that and throw the error if it's the case
          } else {
            this.store.dispatch(new LoginFailure({errorCode: -1, errorString: reason}));

          }
          return of(err);
        }
      ));
    }

  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization',
        'Bearer ' + token)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.

      // Set the refreshTokenSubject to null so that subsequent
      // API calls will wait until the new token has been retrieved
      this.refreshTokenSubject.next(null);

      return this.auth.refreshToken()
        .pipe(
          switchMap((token: string) => {
            if (token) {

              this.refreshTokenSubject.next(token);
              const userData = localStorage.getItem('user');
              let userDataObj = JSON.parse(userData);
              userDataObj = {...userDataObj, token: token};

              if (userDataObj && userDataObj.email) {
                this.setTokenToLocalStorage(token, userDataObj)
                return next.handle(this.addTokenToRequest(request, token));
              } else {
                return <any>this.auth.logout();
              }
              
            }
            return <any>this.auth.logout();
          }),
          catchError(err => {
            return <any>this.auth.logout();
          }),
          finalize(() => {
            this.refreshTokenInProgress = false;
          })
        );

      // If refreshTokenInProgress is not false, we will wait until refreshTokenSubject has a non-null value
      // – which means the new token is ready and we can retry the request again
    } else {
      this.refreshTokenInProgress = false;

      return this.refreshTokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
          return next.handle(this.addTokenToRequest(request, token));
        }));
    }
  }

  private setTokenToLocalStorage(token: string, userDataObj) {
    localStorage.setItem('user', JSON.stringify(userDataObj));
    localStorage.setItem('jwtToken', JSON.stringify(token));

    const tokenDecoded = jwt_decode(token);
    let tokenExpiration = tokenDecoded['exp'];
    const localZeroDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
    tokenExpiration = localZeroDate.setUTCSeconds(tokenExpiration); // getting token expiration in a local time
    
    localStorage.setItem('tokenExpiration', JSON.stringify(tokenExpiration));
    localStorage.setItem('tokenGotTime', JSON.stringify(Date.now()));
  }
}
