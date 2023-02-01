import type { NextApiRequest, NextApiResponse } from 'next';
import FS from '@scripts/utils/file-system/file-system';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const configJson = req.query;

    await FS.writeFile('./resources/config/userConfig.json', configJson, (err) => {
        if (err) {
            res.status(1).json(err);
            return;
        }
        res.status(200).json(configJson);
    });
    res.status(1).json(new Error('unknown error'));
};