import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { auth } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { AccessTokenService } from 'src/access_token/access_token.service';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';
import { Users } from 'src/database/database.types';

@Injectable()
export class AuthService {
    private readonly SALT_ROUND = 10

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly accessTokensService: AccessTokenService,
        private readonly refreshTokensService: RefreshTokensService
    ) {}

    async register(data: auth.RegisterRequest) {
        const { email, password } = data;

        const findUserRes = await this.databaseService.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (findUserRes.rowCount > 0) {
            return {
                status: HttpStatus.CONFLICT,
                errors: ["Email is not available."]
            }
        }

        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);

        const userInsertRes = await this.databaseService.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        )

        if (userInsertRes.rowCount < 0) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: ["Failed to insert user."]
            }
        }

        const user = userInsertRes.rows[0] as Users;

        const accessToken = await this.accessTokensService.generateAccessToken(user.user_id);
        const refreshToken = await this.refreshTokensService.generateRefreshToken(user.user_id);

        return { accessToken, refreshToken };
    }

    async login(data: auth.LoginRequest) {
        const { email, password } = data;

        const findUserRes = await this.databaseService.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (findUserRes.rowCount < 0) {
            return {
                status: HttpStatus.NOT_FOUND,
                errors: ["No user found with those credentials."]
            }
        }

        const user = findUserRes.rows[0] as Users;

        if (await bcrypt.compare(password, user.password))
        {
            return {
                status: HttpStatus.NOT_FOUND,
                errors: ["No user found with those credentials."]
            }
        }

        const accessToken = await this.accessTokensService.generateAccessToken(user.user_id);
        const refreshToken = await this.refreshTokensService.generateRefreshToken(user.user_id);

        return { 
            status: HttpStatus.OK,
            accessToken, 
            refreshToken 
        };
    }

    async refreshAccessToken(data: auth.RefreshRequest) {
        const { refreshToken } = data;

        if (!(await this.refreshTokensService.validateRefreshToken(refreshToken)))
        {
            return {
                status: HttpStatus.CONFLICT,
                errors: ["Unvalid refresh token."]
            }
        }

        const user_id = this.refreshTokensService.decodeRefreshToken(refreshToken).user_id;

        return {
            accessToken: await this.accessTokensService.generateAccessToken(user_id)
        }
    }
}
