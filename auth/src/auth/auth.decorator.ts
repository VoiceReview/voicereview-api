import { SetMetadata } from '@nestjs/common';

export const Auth = (...args: string[]) => SetMetadata('isAuth', {
    isAuth: true,
    args
});
