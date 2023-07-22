import styles from './bpm.module.scss';

import Icon from "@/components/icon/icon";
import { Button, Form, List, message, Upload, UploadFile, UploadProps } from "antd";
import { useState } from "react";

const bpmMeasurement = (await import('@/scripts/utils/bpm-measurement')).bpmMeasurement;

type File = UploadFile & { bpm?: number | string };


export default function BPM() {
    const [fileList, setFileList] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const uploadProps: UploadProps = {
        name: 'audio-files',
        multiple: true,
        accept: 'audio/*',
        maxCount: 32,
        customRequest: (options) => {
            options.onSuccess(options.file);
        },
        beforeUpload(file) {
            if (!file.type.includes('audio/')) {
                message.error(`${file.name} 不是一个受支持的音频文件`);
                return Upload.LIST_IGNORE;
            }
        },
        onChange(info) {
            setFileList(info.fileList.filter(file => (file.type.includes('audio/') && file.status === 'done')));
        },
    };

    async function measurement() {
        const newFileList: File[] = [];

        setLoading(true);

        for await (const file of fileList) {
            const bpm = await bpmMeasurement(file.originFileObj) || '错误';
            newFileList.push({ ...file, bpm });
        }

        setFileList(newFileList);
        setLoading(false);
    }

    return <Form layout="vertical">
        <Form.Item label={<h3>文件:</h3>}>
            <Form.Item>
                <Upload {...uploadProps} className={styles.upload}>
                    <p>
                        <Icon icon='upload' />
                    </p>
                    <p>点击此处上传</p>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" disabled={!fileList.length} onClick={measurement} loading={loading}>开始测量</Button>
            </Form.Item>
        </Form.Item>
        <Form.Item label={<h3>结果:</h3>}>
            <List bordered
                dataSource={fileList}
                renderItem={(file, index) => <List.Item key={index}>
                    <List.Item.Meta title={file.name} />
                    <div>BPM: {file.bpm ?? '未测'}</div>
                </List.Item>
                }>
            </List>
        </Form.Item>
    </Form>;
}