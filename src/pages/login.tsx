import login from '@/scripts/user/login';
import styles from '@/styles/Login.module.scss';

import { Button, Form, Input, Spin, message, notification } from "antd";
import { throttle } from 'lodash';
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Login() {
    const [spinning, setSpinning] = useState<boolean>(true);

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // const token;

    useEffect(() => {
        login('token')
            .then(res => {
                if (!res) notification.error({ message: '登录失败', description: 'Token 已失效', placement: 'topLeft', duration: 5 });
            })
            .finally(() => setSpinning(false));
    }, []);

    const onFinishHandler = async () => {
        setSpinning(true);

        if (!await login('password', { username, password })) notification.error({ message: '登录失败', description: '账户或密码错误', placement: 'topLeft', duration: 5 });

        setSpinning(false);
    };

    const onFinishFailedHandler = throttle(() => message.error('用户名或密码不符合要求'), 1000);

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
                        onFinish={onFinishHandler}
                        onFinishFailed={onFinishFailedHandler}>
                        <Form.Item>
                            <h1>登录</h1>
                        </Form.Item>

                        <Form.Item label='用户名' name='username' required rules={[{ pattern: /^[a-z0-9_\-@\p{sc=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]+$/iu, required: true, message: '请正确填写用户名' }]}>
                            <Input type='text' autoComplete='false' maxLength={128} onChange={(ev) => { setUsername(ev.target.value); }} />
                        </Form.Item>

                        <Form.Item label='密码' name='password' required rules={[{ min: 1, required: true, message: '请输入密码' }]}>
                            <Input type='password' maxLength={256} onChange={(ev) => { setPassword(ev.target.value); }} />
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