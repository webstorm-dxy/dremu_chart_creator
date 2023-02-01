import React from 'react';

export type HeaderMenuProps = React.PropsWithChildren<{
    // isElectronApp: boolean;
}>;

export interface HeaderMenuState {
    item: string;
}