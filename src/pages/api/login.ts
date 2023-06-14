import { AES as aes } from "crypto-js";
import { NextApiRequest, NextApiResponse } from "next";

// 参数格式
interface IArgs {
    username?: string;
    password?: string;
    token?: string;
    macAddress: string;
}

export default function Handler(req: NextApiRequest, res: NextApiResponse<string>) {
    const body = req.body;

    try {
        // 解析校验参数
        const args: IArgs = JSON.parse(body);
        const {username, password, macAddress, token} = args;

        if (!((username && password) || token) || !macAddress) {
            res.status(500).send('error in args');
            return;
        }

        // if(username !== 'passed') return res.status(200).send('false');

        if(token) {
            // todo 校验token
            res.status(200).send(token);
            return;
        }

        // todo 验证用户名和密码

        // todo 生成token, 算法随意, 务必使用需要密钥的算法
        const newToken = aes.encrypt(username + password + macAddress, 'dev-mode').toString();

        // todo 将token写入数据库并覆盖旧token

        res.status(200).send(newToken);
    } catch (e) { res.status(500).send('error in args'); }
}