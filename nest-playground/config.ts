import { config as configDev } from './config/config.dev';
import { config as configProd } from './config/config.prod';

let config;

if (process.env.NODE_ENV === 'production') {
    config = configProd;
} else {
    config = configDev;
}

export default config;
