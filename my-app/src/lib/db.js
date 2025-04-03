import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  ssl: process.env.MYSQL_SSL_ENABLED === 'true' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10, // 根据需求调整
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // 根据证书配置调整
    ca: process.env.MYSQL_CA_CERT // CA 证书内容
  }
});

export default pool;