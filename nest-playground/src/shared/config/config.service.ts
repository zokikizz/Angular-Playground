import { Injectable } from '@nestjs/common';
import {SequelizeOrmConfig} from './intefaces/sequelize-orm-config.interfacte';
import config from '../../../config';
import {JwtConfig} from './intefaces/jwt-config.interface';

@Injectable()
export class ConfigService {
    // maybe make static
    get sequelizeOrmConfig(): SequelizeOrmConfig {
        return config.database;
    }

    get jwtConfig(): JwtConfig {
        return {
            privateKey: config.jwtPrivateKey,
        };
    }

}
