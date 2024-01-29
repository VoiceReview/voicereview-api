import { Sha256 } from '@aws-crypto/sha256-js';
import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { DatabaseService } from 'src/database/database.service';
import { RefreshTokens } from 'src/database/database.types';

@Injectable()
export class RefreshTokensService {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }
    
    /**
     * Method to create a new refresh token
     * @param user_id the uuid value of the user
     * @returns a promise that resolve to the row of the newly created refresh token
     */
    createOne(user_id) : Promise<QueryResult<RefreshTokens>> {
        const created_at = new Date();
        const expires_at = new Date(created_at.getTime() + 30 * 24 * 60 * 60 * 1000);
        const updated_at = created_at;
        const revoked = false;

        return this.databaseService.query(
            "INSERT INTO refresh_tokens (user_id, created_at, updated_at, expires_at, revoked) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, created_at, updated_at, expires_at, revoked]
        )
    }
}
