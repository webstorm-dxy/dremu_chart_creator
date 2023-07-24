import styles from './markdown.module.scss';

import useClassName from '@/hooks/use-class-name';
import { MDXProvider } from '@mdx-js/react';
import { MDXProps } from './markdown.d';
import { PropsWithChildren, ReactElement, useMemo } from 'react';
import useParent from '@/hooks/use-parent';
import { Image } from 'antd';



export const Heading = {
    h1: (props) => <h1 className={styles.h1} {...props}></h1>,
    h2: (props) => <h2 className={styles.h2} {...props}></h2>,
    h3: (props) => <h3 className={styles.h3} {...props}></h3>,
    h4: (props) => <h4 className={styles.h4} {...props}></h4>,
    h5: (props) => <h5 className={styles.h5} {...props}></h5>,
    h6: (props) => <h6 className={styles.h6} {...props}></h6>
};

const Markdown = {
    HTML,
    Body,
    Heading,
    Image,
    P,
    A,
    Code,
    Pre,
    Table,
    Ul,
    Ol,
    Li,
    Hr,
    Th,
    Td,
    Tr,
    Section,
    Sup,
    Sub,
    Span
};

const components = {
    html: Markdown.HTML,
    body: Markdown.Body,
    h1: Markdown.Heading.h1,
    h2: Markdown.Heading.h2,
    h3: Markdown.Heading.h3,
    h4: Markdown.Heading.h4,
    h5: Markdown.Heading.h5,
    h6: Markdown.Heading.h6,
    img: Markdown.Image,
    p: Markdown.P,
    a: Markdown.A,
    code: Markdown.Code,
    pre: Markdown.Pre,
    table: Markdown.Table,
    ul: Markdown.Ul,
    ol: Markdown.Ol,
    li: Markdown.Li,
    hr: Markdown.Hr,
    th: Markdown.Th,
    td: Markdown.Td,
    tr: Markdown.Tr,
    section: Markdown.Section,
    sup: Markdown.Sup,
    sub: Markdown.Sub,
    span: Markdown.Span
};


export function HTML(props) {
    return <html className={styles.html} {...props}></html>;
}

export function Body(props) {
    return <body className={styles.body} {...props}></body>;
}


export function P(props) {
    return <p className={styles.p} {...props}></p>;
}

export function A(props) {
    // eslint-disable-next-line react/prop-types
    return <a {...props} className={styles.a} href={props['data-footnote-ref'] ? '#' : props.href}></a>;
}

export function Code(props) {
    return <code className={styles.code} {...props}></code>;
}

export function Pre(props: PropsWithChildren<unknown>) {
    // return <ol className={useClassName(styles.write, styles.pre, styles['md-fences'], styles['md-end-block'], styles['ty-contain-cm'], styles.modeLoaded, styles['md-focus'])} {...{...props, children: undefined}}>
    //     {Children.map(props.children, (child, i) => <div className={styles['pre-line']}><span>{i}</span><div>{child}</div></div>)}
    // </ol>;

    return <pre className={useClassName(styles.write, styles.pre, styles['md-fences'], styles['md-end-block'], styles['ty-contain-cm'], styles.modeLoaded, styles['md-focus'])} {...props}></pre>;
}

export function Table(props) {
    return <table className={styles.table} {...props}></table>;
}

export function Ul(props) {
    return <ul className={styles.ul} {...props}></ul>;
}

export function Ol(props) {
    return <ol className={styles.ol} {...props}></ol>;
}

export function Li(props) {
    return <li className={styles.li} {...props}></li>;
}

export function Hr(props) {
    return <hr className={styles.hr} {...props}></hr>;
}

export function Th(props) {
    return <th className={styles.th} {...props}></th>;
}

export function Td(props) {
    return <td className={styles.td} {...props}></td>;
}

export function Tr(props) {
    return <tr className={styles.tr} {...props}></tr>;
}

export function Section(props) {

    return <section {...props} className={styles.section}></section>;
}

export function Sup(props) {

    return <sup {...props} className={styles.sup}></sup>;
}

export function Sub(props) {

    return <sub {...props} className={styles.sub}></sub>;
}

export function Span(props) {
    // eslint-disable-next-line react/prop-types
    if (props?.className?.includes('katex-html')) return null;
    return <span {...props}></span>;
}

export function MDX(props: MDXProps) {
    const { children, style, components: pComponents } = props;
    const mdx = useMemo(() => <div className={styles.body} style={style}>
        <table></table>
        <MDXProvider components={{ ...components, ...pComponents }}>
            {children}
        </MDXProvider></div>, [children, components]);
    const layout: ReactElement = props.layout || <></>;

    return useParent(layout, mdx);
}


export default Markdown;