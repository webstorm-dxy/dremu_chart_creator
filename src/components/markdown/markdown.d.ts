import { PropsWithChildren, ReactElement, StyleHTMLAttributes } from "react";
import {MDXComponents} from '@mdx-js/react';

export type MDXProps = PropsWithChildren<{
    layout?: ReactElement;
    components?: MDXComponents;
    style?: StyleHTMLAttributes;
}>;