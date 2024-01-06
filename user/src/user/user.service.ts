import { Injectable } from '@nestjs/common';
import { user } from './interfaces/user.interface';
import { DatabaseService } from 'src/database/database.service';
import { QueryResult } from 'pg';
import { Users } from 'src/database/database.types';

@Injectable()
export class UserService {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    findOne(uuid: string) {
        return {
            uuid: 'uuid',
            email: 'email',
            phone: 'phone',
            password: 'password',
            verified: true,
            role: 'ADMIN',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        }
    }

    findAll() {
        return [
            {
                uuid: 'uuid',
                email: 'email',
                phone: 'phone',
                password: 'password',
                verified: true,
                role: 'ADMIN',
                createdAt: 'createdAt',
                updatedAt: 'updatedAt',
            }
        ]
    }

    createOne({ email, phone, password, role }: { email: string, phone: string, password: string, role: user.UserRole }) : Promise<QueryResult<Users>>  {
        return this.databaseService.query(
            'INSERT INTO users (email, phone, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, phone, password, role]
        );
    }
}
