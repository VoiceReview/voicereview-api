import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { QueryResult } from 'pg';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AccessTokenService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwt: JwtService
    ) {}

    async generateAccessToken(user_id: string) {
        const alreadyExistingTokens = await this.databaseService.query(
            "SELECT * FROM access_tokens WHERE user_id = $1",
            [user_id]
        )
        
        if (alreadyExistingTokens.rowCount > 0)
        {
            return this.signAccessToken(alreadyExistingTokens);
        }

        const accessTokenInsertRes = await this.createAccessToken(user_id);
        return this.signAccessToken(accessTokenInsertRes);        
    }

    private createAccessToken(user_id: string): Promise<any> {
        const created_at = new Date();
        const expires_at = new Date(created_at.getTime() + 15 * 60 * 1000);

        return this.databaseService.query(
            'INSERT INTO access_tokens (user_id, created_at, expires_at) VALUES ($1, $2, $3) RETURNING *',
            [user_id, created_at, expires_at]
        );
    }

    private signAccessToken(access_token_insert_res: QueryResult<any>) {
        if (access_token_insert_res.rowCount === 0) {
            throw new Error('Failed to create access token');
        }

        const access_token = access_token_insert_res.rows[0];
        const access_token_jwt = this.jwt.sign(access_token);

        return access_token_jwt;
    }

    async validateAccessToken(jwtAccessToken: string): Promise<boolean> {
        const accessToken = this.jwt.decode(jwtAccessToken);
    
        const accessTokenUuid = accessToken.token;

        const queryResult = await this.databaseService.query(
            'SELECT * FROM access_tokens WHERE token = $1',
            [accessTokenUuid]
        );
        
        return queryResult.rowCount > 0;
    }
}
