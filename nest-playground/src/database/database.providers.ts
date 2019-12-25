import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: 'localhost',
                port: 5050,
                username: 'kizz',
                password: 'kizz',
                database: 'nestPlaygroundDB',
            });
            sequelize.addModels([]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
