import { Injectable } from '@nestjs/common';
import { user } from './interfaces/user.interface';
import { DatabaseService } from 'src/database/database.service';
import { QueryResult } from 'pg';
import { Users } from 'src/database/database.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    SALT_ROUNDS = 10;

    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    findOne(emailOrPhone: string) : Promise<QueryResult<Users>> {
        return this.databaseService.query(
            'SELECT * FROM users WHERE email = $1 OR phone = $1',
            [emailOrPhone]
        );
    }

    findOneByEmail(email: string) : Promise<QueryResult<Users>> {
        return this.databaseService.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
    }

    comparePassword(password: string, hash: string) : Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    hashPassword(password: string) : Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    async createOne({ email, phone, password, role }: { email: string, phone: string, password: string, role: user.UserRole }) : Promise<QueryResult<Users>>  {
        password = await this.hashPassword(password);
        return this.databaseService.query(
            'INSERT INTO users (email, phone, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, phone, password, role]
        );
    }
}
