import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {User} from './user.entity';
import {ConfigService} from '../shared/config/config.service';
import {UserDto} from './dto/user.dto';
import {JwtPayload} from './jwt-auth/jwt-payload.model';
import {sign} from 'jsonwebtoken';
import {UserLoginResponseDto} from './dto/user-login-response.dto';
import { genSalt, hash, compare } from 'bcrypt';
import {UserLoginRequestDto} from './dto/user-login-request.dto';

@Injectable()
export class UsersService {

    private readonly jwtPrivateKey: string;

    constructor(@Inject('UsersRepository') private readonly userRepository: typeof User,
                private readonly configService: ConfigService) {
        this.jwtPrivateKey = configService.jwtConfig.privateKey;
    }

    async findAllUsers(): Promise<UserDto[]> {
        const users = await this.userRepository.findAll<User>();
        return users.map( user => new UserDto(user));
    }

    async getUserById(id: string): Promise<UserDto> {
        const user = await this.userRepository.findByPk<User>(id);
        if (!user) {
            throw new HttpException('User with given id not found', HttpStatus.NOT_FOUND);
        }
        return new UserDto(user);
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    async create(createUserDto: User): Promise<UserLoginResponseDto> {
        try {
            const user = new User( {
                email: createUserDto.email,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
            });

            const salt = await genSalt(10);
            user.password = await hash(createUserDto.password, salt);

            user.save();

            const token = await this.signToken(user);

            return new UserLoginResponseDto(user, token);
        } catch (e) {
            if (e.original.constraint === 'user_email_key') {
                throw new HttpException(
                    `User with email ${createUserDto.email} already exists.`,
                    HttpStatus.CONFLICT);
            }

            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(userLoginReq: UserLoginRequestDto): Promise<UserLoginResponseDto> {
        const email = userLoginReq.email;
        const password = userLoginReq.password;

        const user = await this.userRepository.findOne({  where: { email } });
        if (!user) {
            throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new HttpException('Invalid email or password', HttpStatus.BAD_REQUEST);
        }

        const token = await this.signToken(user);

        return new UserLoginResponseDto(user, token);
    }

    async update(id: string, userUpdate: UserDto): Promise<UserDto> {
        const user = await this.userRepository.findByPk(id);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        user.firstName = userUpdate.firstName || user.firstName;
        user.lastName = userUpdate.lastName || user.lastName;

        try {
            const data = await user.save();
            return new UserDto(user);
        } catch (e) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string): Promise<UserDto> {
        const user = await this.userRepository.findByPk(id);
        await user.destroy();
        return new UserDto(user);
    }

    async signToken(user: User): Promise<string> {
        const payload: JwtPayload = {
            email: user.email,
        };
        return sign(payload, this.jwtPrivateKey, {});
    }
}
