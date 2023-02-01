import fs from 'fs';
import Path from 'path';

import FsItf from '@interfaces/util/file-system';


namespace FileSystem {
    export async function writeFile(
        path: FsItf.Path,
        data: FsItf.FileData,
        options?: fs.WriteFileOptions|fs.NoParamCallback,
        callback?: fs.NoParamCallback
    ) {
        if (!callback && options instanceof Function) {
            callback = options;
            options = undefined;
        }
        await exists(path);
        fs.writeFile(path, data, options as fs.WriteFileOptions, callback);
    }

    export async function exists(path: string, createDir: boolean = false) {
        return new Promise<boolean>((resolve) => {
            fs.stat(path, async (err) => {
                if (err) {
                    if (createDir) {
                        const parentDir = Path.parse(path).dir;
                        if (await exists(parentDir)) {
                            fs.mkdir(parentDir, (err) => {
                                if (err) {
                                    resolve(false);
                                } else {
                                    resolve(true);
                                }
                            });
                        }
                    }
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

export default FileSystem;