import { IsNotEmpty, IsString } from "class-validator";

export class RefreshRequest {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}