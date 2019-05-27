const courseServiceUrl = 'http://localhost:8080/api';

const isDevelopment = process.env.NODE_ENV !== 'production';

const canBypassLogin = true;

export default { courseServiceUrl, canBypassLogin };