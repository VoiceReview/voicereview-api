import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AccessTokenService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) {}

    /**
     * Method to create a new access token
     * @param user_id the uuid value of the user
     * @returns a promise that resolve to the row of the newly created access token
     */
    createOne(user_id: string): Promise<any> {
        const created_at = new Date();
        const expires_at = new Date(created_at.getTime() + 15 * 60 * 1000);
        const updated_at = created_at;
        return this.databaseService.query(
            'INSERT INTO access_tokens (user_id, created_at, updated_at, expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, created_at, updated_at, expires_at]
        );
    }

    /**
     * Method to validate an access token
     * @param accessToken the uuid value of the access token
     * @returns a boolean indicating whether the access token is valids
     */
    async validateAccessToken(accessToken: string): Promise<boolean> {
        const queryResult = await this.databaseService.query(
            'SELECT * FROM access_tokens WHERE token = $1',
            [accessToken]
        );
        return queryResult.rowCount > 0;
    }
}
