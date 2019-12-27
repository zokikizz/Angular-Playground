import {UserDto} from './user.dto';
import {User} from '../user.entity';

export class UserLoginResponseDto extends UserDto {
    token: string;

    constructor(user: User, token?: string) {
        super(user);
        this.token = token;
    }
}
