/**
* This file is auto-generated by nestjs-proto-gen-ts
*/

import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export namespace auth {
    export interface AuthService {
        login(
            data: LoginRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<LoginResponse>;
        register(
            data: RegisterRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<RegisterResponse>;
        refresh(
            data: RefreshRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<RefreshResponse>;
        logout(
            data: LogoutRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<LogoutResponse>;
    }
    export interface LoginRequest {
        email?: string;
        password?: string;
    }
    export interface LoginResponse {
        refreshToken?: string;
        accessToken?: string;
    }
    export interface RegisterRequest {
        email?: string;
        phone?: string;
        password?: string;
    }
    export interface RegisterResponse {
        refreshToken?: string;
        accessToken?: string;
    }
    export interface RefreshRequest {
        refreshToken?: string;
    }
    export interface RefreshResponse {
        accessToken?: string;
    }
    export interface LogoutRequest {
        accessToken?: string;
    }
    export interface LogoutResponse {
        success?: boolean;
    }
}

