import useClassName from '@/hooks/use-class-name';
import { PropsWithChildren } from 'react';

export type ILabelProps = PropsWithChildren<{
    disabled?: boolean;
    label?: string;
    className?: string;
}>

export default function Switch(props: ILabelProps) {

    return <span className={useClassName('inline-flex items-center ml-1 mr-1', props.disabled && "text-gray-500", props.className)}>
        <span className='mr-1 whitespace-nowrap'>{props.label}</span>
        {props.children}
    </span>;
}