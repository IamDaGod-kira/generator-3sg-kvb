// app.config.js
import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      VITE_APIKEY: process.env.VITE_APIKEY,
      VITE_APPID: process.env.VITE_APPID,
      VITE_AUTHDOMAIN: process.env.VITE_AUTHDOMAIN,
      VITE_MEASUREMENTID: process.env.VITE_MEASUREMENTID,
      VITE_MESSAGINGSENDERID: process.env.VITE_MESSAGINGSENDERID,
      VITE_PROJECTID: process.env.VITE_PROJECTID,
      VITE_STORAGEBUCKET: process.env.VITE_STORAGEBUCKET,
    },
  };
};
