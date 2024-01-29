import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * @description DTO for creating a user
 */
export class RegisterRequest {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}