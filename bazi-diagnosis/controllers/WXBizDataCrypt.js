const crypto = require('crypto');

class WXBizDataCrypt {
    constructor(appId, sessionKey) {
        this.appId = appId;
        this.sessionKey = sessionKey;
    }

    decryptData(encryptedData, iv) {
        // base64 解码
        const sessionKey = Buffer.from(this.sessionKey, 'base64');
        const encryptedDataBuffer = Buffer.from(encryptedData, 'base64');
        const ivBuffer = Buffer.from(iv, 'base64');

        try {
            // 解密
            const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, ivBuffer);
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true);
            let decoded = decipher.update(encryptedDataBuffer, 'binary', 'utf8');
            decoded += decipher.final('utf8');

            // 解析解密后的数据
            decoded = JSON.parse(decoded);

            // 验证 appId
            if (decoded.watermark.appid !== this.appId) {
                throw new Error('Illegal Buffer');
            }

            return decoded;
        } catch (error) {
            throw new Error('解密失败: ' + error.message);
        }
    }
}

module.exports = WXBizDataCrypt;