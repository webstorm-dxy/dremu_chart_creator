import { ReactNode } from "react";


export interface IToolPage {
    name: string;
    icon?: ReactNode;
    showName: string|ReactNode;
    page: ReactNode;
}