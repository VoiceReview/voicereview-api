/**
* This file is auto-generated by nestjs-proto-gen-ts
*/

import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export namespace user {
    export interface UserService {
        findOne(
            data: UserByUuid,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<User>;
        findAll(
            data: Observable<UserByUuid>,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<User>;
        createUser(
            data: CreateUserRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<CreateUserResponse>;
        updateUser(
            data: UpdateUserRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<User>;
        deleteUser(
            data: UserByUuid,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<Empty>;
        verifyUser(
            data: VerifyUserRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<User>;
        getUserByCredentials(
            data: UserCredentials,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<User>;
        changeUserRole(
            data: ChangeUserRoleRequest,
            metadata?: Metadata,
            ...rest: any[]
        ): Observable<User>;
    }
    export interface UserByUuid {
        uuid?: string;
    }
    export interface CreateUserResponse {
        sessionToken?: string;
        refreshToken?: string;
        accessToken?: string;
    }
    export interface User {
        uuid?: string;
        email?: string;
        phone?: string;
        password?: string;
        verified?: boolean;
        role?: user.UserRole;
        createdAt?: string;
        updatedAt?: string;
    }
    export enum UserRole {
        ANON = 0,
        ADMIN = 1,
        USER = 2,
        MODERATOR = 3,
    }
    export interface CreateUserRequest {
        email?: string;
        phone?: string;
        password?: string;
        role?: user.UserRole;
    }
    export interface UpdateUserRequest {
        uuid?: string;
        email?: string;
        phone?: string;
        password?: string;
        role?: user.UserRole;
    }
    export interface VerifyUserRequest {
        uuid?: string;
        verified?: boolean;
    }
    export interface UserCredentials {
        email?: string;
        password?: string;
    }
    export interface ChangeUserRoleRequest {
        uuid?: string;
        newRole?: user.UserRole;
    }
    // tslint:disable-next-line:no-empty-interface
    export interface Empty {
    }
}

