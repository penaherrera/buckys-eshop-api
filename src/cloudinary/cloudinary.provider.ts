import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';
import { ConfigType } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinary.config';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (config: ConfigType<typeof cloudinaryConfig>) => {
    v2.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
    return v2;
  },
  inject: [cloudinaryConfig.KEY],
};
