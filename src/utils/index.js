const courseServiceUrl = 'http://localhost:8080/api';

const isDevelopment = process.env.NODE_ENV !== 'production';

const canBypassLogin = isDevelopment && true;

export default { courseServiceUrl, canBypassLogin };