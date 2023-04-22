import { NextApiRequest, NextApiResponse } from "next";

// 参数格式
interface IArgs {
    username?: string;
    passwordMd5?: string;
    token?: string;
    macAddressMd5: string;
}

export default function Handler(req: NextApiRequest, res: NextApiResponse<string>) {
    const body = req.body;

    try {
        // 解析校验参数
        const args: IArgs = JSON.parse(body);
        const {username, passwordMd5, macAddressMd5} = args;

        if (!username || !passwordMd5 || !macAddressMd5) {
            res.status(500).send('error in args');
            return;
        }

        // todo 验证用户名和密码

        // todo 生成token, 算法随意, 务必使用需要密钥的算法
        const token = username + passwordMd5 + macAddressMd5;

        // todo 将token写入数据库并覆盖旧token

        res.status(200).send(token);
    } catch (e) { res.status(500).send('error in args'); }
}