"use client";

import AppContext from '@/context/app';
import { checkTokenAndLogin, login } from '@/scripts/utils/check-token';
import styles from '@/styles/Login.module.scss';
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

import { Button, Form, Input, Spin } from "antd";
import { MD5 } from 'crypto-js';
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

export default function Login() {
    const appContext = useContext(AppContext);
    const [spinning, setSpinning] = useState<boolean>(true);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // const token;

    useEffect(() => {
        readTextFile('token', { dir: BaseDirectory.Resource })
            .then(res => {
                if (res) appContext.setAppContext(prev => {
                    prev.token = res;
                    return prev;
                });
                checkTokenAndLogin(appContext.token);
            })
            .catch(() => {
                writeTextFile('token', '', { dir: BaseDirectory.Resource });
            })
            .finally(() => setSpinning(false));
    });

    const onFinishHandler = async () => {
        const res = await fetch('/api/login', {
            mode: 'cors',
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify({
                username, 
                password: MD5(password).toString(), 
                macAddress: MD5(appContext.macAddress).toString()
            })
        }).then(v => v.text());
        
        if (res) login();
    };

    return <>
        <Head>
            <title>Re: Astedit</title>
            <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        </Head>
        <main className={styles.main}>
            {/* <div className={styles.title}><h1>登录</h1></div> */}
            <div className={styles['login-box']}>
                <Spin spinning={spinning}>
                    <Form layout='vertical' 
                        onFinish={onFinishHandler}>
                        <Form.Item>
                            <h1>登录</h1>
                        </Form.Item>

                        <Form.Item label='用户名' name='username' required rules={[{pattern: /^[a-z0-9_]+$/i, required: true, message: '请填写用户名'}]}>
                            <Input onChange={(ev) => { setUsername(ev.target.value); }}/>
                        </Form.Item>

                        <Form.Item label='密码' name='password' required rules={[{min: 1, required: true, message: '请输入密码'}]}>
                            <Input type='password' onChange={(ev)=> { setPassword(ev.target.value); }} />
                        </Form.Item>

                        <Form.Item>
                            <Button type='primary' htmlType='submit'>登录</Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </main>
    </>;
}