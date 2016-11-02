/// <reference path="../../../node_modules/@types/adal/index.d.ts" />

import { Injectable } from '@angular/core';
import 'expose?AuthenticationContext!../../../node_modules/adal-angular/lib/adal.js';
import { AuthContext } from './authentication.context';
import { Observable, AsyncSubject, BehaviorSubject } from 'rxjs';
let createRawAuthContext: adal.AuthenticationContextStatic = AuthenticationContext;
declare let Logging: adal.Logging;

@Injectable()
export class AuthProvider {

    private _context: AuthContext = null;
    constructor() {
        console.log('Constructing AuthProvider...');
    }

    getContext(): AuthContext {
        console.log('getContext...');

        if (this._context != null) return this._context;

        let config = this.getConfig();
        let rawContext = new createRawAuthContext(config);
        this.enableRawLogging();
        this._context = <AuthContext>this.extend(rawContext);
        return this._context;
    }

    private getConfig(): adal.Config {
        let config: adal.Config = {
            tenant: 'hneu70532.onmicrosoft.com',
            clientId: '61bdbb45-a004-48e3-98d9-e4f1740661c8', //hannes@hneu70532.onmicrosoft.com
            postLogoutRedirectUri: window.location.origin + '/',
            redirectUri: window.location.origin + '/'
        };
        return config;
    }

    private extend(context: adal.AuthenticationContext): any {

        (<any>context).isLoggedIn = function () {
            return context.getCachedUser() != null;
        };
        (<any>context).processAdRedirect = function (): void {

            console.log('processing ad redirect...');
            if (context.isCallback(location.hash)) {
                let requestInfo = context.getRequestInfo(location.hash);
                context.saveTokenFromHash(requestInfo);
            }
        };
        return context;
    }

    private enableRawLogging(): void {
        Logging.level = 3;
        Logging.log = this.log;
    }

    private log(message: string): void {
        console.log('adal logging...');
        console.log(message);
    }

}


