import {Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserDto} from './dto/user.dto';
import {User} from './user.entity';
import {UserLoginRequestDto} from './dto/user-login-request.dto';
import {UserLoginResponseDto} from './dto/user-login-response.dto';
import {AuthGuard} from '@nestjs/passport';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    // @ApiOkResponse check this
    @Post('register')
    register(@Body() createUserDto: { email, firstName, lastName, password }): Promise<UserDto> {
        return this.userService.create(createUserDto as User);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() userLoginDto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
        return this.userService.login(userLoginDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(): Promise<UserDto[]> {
        return this.userService.findAllUsers();
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getUser(@Req() request): Promise<UserDto> {
        return this.userService.getUserById(request.user.id);
    }

    @Put('me')
    @UseGuards(AuthGuard('jwt'))
    updateUser(@Req() request, @Body() userDto: UserDto): Promise<UserDto> {
        return this.userService.update(request.user.id, userDto);
    }

    @Delete('me')
    @UseGuards(AuthGuard('jwt'))
    delete(@Req() request): Promise<UserDto> {
        return this.userService.delete(request.user.id);
    }
}
