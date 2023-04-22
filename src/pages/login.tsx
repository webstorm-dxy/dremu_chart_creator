"use client";

import AppContext from '@/context/app';
import { checkTokenAndLogin } from '@/scripts/utils/check-token';
import styles from '@/styles/Login.module.scss';
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs';

import { Button, Form, Input, Spin } from "antd";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

export default function Login() {
    const appContext = useContext(AppContext);
    const [spinning, setSpinning] = useState<boolean>(true);
    // const token;

    useEffect(() => {
        readTextFile('token', {dir: BaseDirectory.Resource})
            .then(res => {
                if (res) appContext.setAppContext(prev => {
                    prev.token = res;
                    return prev;
                });
                checkTokenAndLogin(appContext.token);
            })
            .catch(() => {
                writeTextFile('token', '', {dir: BaseDirectory.Resource});
            })
            .finally(() => setSpinning(false));
    });
    
    return <>
        <Head>
            <title>Re: Astedit</title>
            <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        </Head>
        <main className={styles.main}>
            <Spin spinning={spinning}>
                <Form layout='vertical'>
                    <Form.Item label='用户名' name='username'>
                        <Input/>
                    </Form.Item>

                    <Form.Item label='密码' name='password'>
                        <Input type='password'/>
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary'>登录</Button>
                    </Form.Item>
                </Form>
            </Spin>
        </main>
    </>;
}