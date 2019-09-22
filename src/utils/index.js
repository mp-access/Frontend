const courseServiceUrl = "/api";

const isDevelopment = process.env.NODE_ENV !== 'production';

const canBypassLogin = false;

export default { courseServiceUrl, canBypassLogin, isDevelopment };