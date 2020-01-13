import {Sequelize} from 'sequelize-typescript';
import {ConfigService} from '../shared/config/config.service';
import {User} from '../users/user.entity';
export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: 'localhost',
                port: 5050,
                username: 'kizz',
                password: 'kizz',
                database: 'nestPlaygroundDB',
                logging: false,
            });
            sequelize.addModels([User]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ ConfigService ],
    },
];
