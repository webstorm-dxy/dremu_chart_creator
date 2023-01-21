import styles from '@styles/Editor.module.scss';
// import '@fortawesome/fontawesome-svg-core/styles.css';

// import {config} from '@fortawesome/fontawesome-svg-core';
import Head from "next/head";
import Header from '@components/pages/index/header/header';
import Main from '@components/pages/index/main/main';


// config.autoAddCss = false;

export default function Editor() {


    return (
        <>
            <Head>
                <title>Re: AstEdit - Chart Editor for Astaeus - Vestar Team</title>
                <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
                <meta name="description" content="Chart Editor for Astaeus" />
                <meta name="author" content="Vestar Team" />
                <meta name="author" content="Yomli ヨムリ" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className={styles.main}>
                <Header></Header>
                <Main></Main>
            </div>
        </>
    );
}