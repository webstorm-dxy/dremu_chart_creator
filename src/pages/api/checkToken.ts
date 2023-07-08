import { NextApiRequest, NextApiResponse } from "next";

// 参数格式
interface IArgs {
    username?: string;
    password?: string;
    token?: string;
    macAddress: string;
}

export default function Handler(req: NextApiRequest, res: NextApiResponse<string>) {
    res.status(200)
        // .send('false');
        .send('true');
}