import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { user } from '../interfaces/user.interface';

/**
 * @description DTO for creating a user
 */
export class CreateUserRequest {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    role: user.UserRole;
}