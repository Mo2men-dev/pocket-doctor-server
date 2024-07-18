const ENV = process.env.ENV;
export const allowedOrigins =
  ENV === 'prod'
    ? [`${process.env.CLIENT_URL}`, `${process.env.DASHBOARD_URL}`]
    : ['http://localhost:5173', 'http://localhost:5174'];
