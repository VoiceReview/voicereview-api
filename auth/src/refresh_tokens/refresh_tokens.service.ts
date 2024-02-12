import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { DatabaseService } from 'src/database/database.service';
import { RefreshTokens, Users } from 'src/database/database.types';
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class RefreshTokensService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwt: JwtService
    ) { }
    
    async generateRefreshToken(user_id: string) {
        const alreadyExistingTokens = await this.databaseService.query(
            "SELECT * FROM refresh_tokens WHERE user_id = $1",
            [user_id]
        )
        
        if (alreadyExistingTokens.rowCount > 0)
        {
            return this.signRefreshToken(alreadyExistingTokens);
        }

        const refreshTokenInsertRes = await this.createRefreshToken(user_id);
        return this.signRefreshToken(refreshTokenInsertRes);        
    }

    private createRefreshToken(user_id) : Promise<QueryResult<RefreshTokens>> {
        const created_at = new Date();
        const expires_at = new Date(created_at.getTime() + 30 * 24 * 60 * 60 * 1000);

        return this.databaseService.query(
            "INSERT INTO refresh_tokens (user_id, created_at, expires_at) VALUES ($1, $2, $3) RETURNING *",
            [user_id, created_at, expires_at]
        )
    }

    private signRefreshToken(refresh_token_insert_res: QueryResult<RefreshTokens>) {
        if (refresh_token_insert_res.rowCount === 0) {
            throw new Error('Failed to create refresh token');
        }

        const refresh_token = refresh_token_insert_res.rows[0] as RefreshTokens;
        const refresh_token_jwt = this.jwt.sign(refresh_token);

        return refresh_token_jwt;
    }

    decodeRefreshToken(token: string) : Omit<Users, "password"> {
        return this.jwt.decode(token);
    }

    async validateRefreshToken(token: string): Promise<boolean> {
        const res = await this.databaseService.query(
            "SELECT * FROM refresh_tokens WHERE token = $1",
            [token]
        );
        return res.rowCount > 0;
    }
}
