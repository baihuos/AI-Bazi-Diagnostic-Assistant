// test-db.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.local' });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mysql = require('mysql2/promise');

async function testAccess() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE // 确保这里对应 aibazi
    });

    console.log('✅ 数据库连接成功');
    
    // 测试写入权限
    await conn.query('CREATE TABLE IF NOT EXISTS test (id INT)');
    console.log('✅ 表创建权限正常');
    
    // 测试读取权限
    const [rows] = await conn.query('SELECT * FROM test');
    console.log('✅ 数据读取权限正常', rows);
    
    await conn.end();
  } catch (error) {
    console.error('❌ 错误详情:');
    console.log(`错误代码: ${error.code}`);
    console.log(`错误信息: ${error.message}`);
    
    if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
      console.log('\n可能原因:');
      console.log('1. 用户没有目标数据库的访问权限');
      console.log('2. 数据库名称拼写错误');
      console.log('3. 用户权限未刷新');
    }
  }
}

testAccess();