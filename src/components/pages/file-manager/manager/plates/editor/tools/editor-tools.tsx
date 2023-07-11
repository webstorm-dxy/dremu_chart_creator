import Icon from '@components/icon/icon';
import Tool from '../../../tools/tool/tool';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { BaseDirectory, createDir, exists, writeFile } from '@tauri-apps/api/fs';
import ChartData, { createNewChart, createAecFile } from '@scripts/chart-data/chart-data';
import { bpmMeasurement } from '@/scripts/utils/bpm-measurement';
import Bpm from '@/scripts/chart-data/bpm/bpm';
import Fraction from 'fraction.js';


interface Props {
    readCharts: Function;
    path: string[];
}

export default function EditorTools({readCharts, path}: Props) {


    return <><Tool onClick={() => {
        let name: string;
        Modal.info({
            title: '创建文件夹',
            okText: '创建',
            cancelText: '取消',
            closable: true,
            okCancel: true,
            async onOk() {
                if (name) {
                    const _path = 'chart/' + path.join('/') + '/' + name;
                    const has = await exists(_path, { dir: BaseDirectory.Resource });
                    if (has) {
                        message.error(`创建失败，文件夹已存在`);
                        return false;
                    }
                    await createDir(
                        _path,
                        { dir: BaseDirectory.Resource }
                    ).then(readCharts());
                    message.success(`创建成功`);
                    return true;
                }
                message.error(`创建失败`);
            },
            content: <Form>
                <Form.Item
                    label='文件夹名'
                    name='dir-name'
                    rules={[{
                        required: true,
                        whitespace: true,
                        message: '请输入文件夹名',
                        max: 255
                    }, { pattern: /^[^/\\?<>:*|]+$/, message: "文件名不合法" }]}>
                    <Input onChange={(ev) => {
                        name = ev.target.value;
                    }} />
                </Form.Item>
            </Form>,
        });
    }}><Icon icon='folder' />新建文件夹</Tool>
        <Tool onClick={() => {
            let chart: ChartData;
            let value: string = '';
            let musicFile: File | Blob | ArrayBuffer;
            Modal.info({
                title: '新谱面',
                okText: '确定',
                cancelText: '取消',
                closable: true,
                okCancel: true,
                async onOk() {
                    if (chart && value && musicFile) {
                        const _path = 'chart/' + path.join('/') + '/' + value + ".aec";
                        const has = await exists(_path, { dir: BaseDirectory.Resource });
                        chart.setMeta('name', value);
                        if (has) {
                            message.error(`创建失败，文件已存在`);
                            return false;
                        }

                        const aecFile = await createAecFile(chart, musicFile);
                        await writeFile(
                            _path,
                            aecFile.exportAec(),
                            { dir: BaseDirectory.Resource }
                        ).then(readCharts());
                        message.success(`创建成功`);
                        return true;
                    }
                    message.error(`创建失败`);
                },
                content: <Form>
                    <Form.Item
                        label='文件名'
                        name='file-name'
                        rules={[{
                            required: true,
                            whitespace: true,
                            message: '请输入文件名',
                            max: 255
                        }, { pattern: /^[^/\\?<>:*|]+$/, message: "文件名不合法" }]}>
                        <Input onChange={(ev) => {
                            value = ev.target.value;
                        }} />
                    </Form.Item>
                    <Form.Item
                        label='音乐'
                        name='music'
                        rules={[{ required: true }]}>
                        <Upload maxCount={1} accept='audio/ogg' beforeUpload={(file) => {
                            if (file.type === 'audio/ogg') {
                                return true;
                            }
                            message.error('不支持的文件');
                            return false;
                        }} onChange={async(info) => {
                            if (info.file.status === 'done') {
                                if (info.file.type !== 'audio/ogg') return false;
                                musicFile = info.file.originFileObj;

                                const bpm = await bpmMeasurement(musicFile) || 120;
                                message.info('音频 BPM: '+bpm);

                                chart = createNewChart(value, new Bpm([{beat: new Fraction(0), bpm: bpm || 120}]));
                            }
                        }}>
                            <Button>上传</Button>
                        </Upload>
                    </Form.Item>
                </Form>,
            });
        }}>
            <Icon icon='plus' />新建</Tool>
    </>;
}