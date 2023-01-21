import './menu.scss';

import React from 'react';


export type MenuProps = React.PropsWithChildren<{
    onBlurHandler?: React.FormEventHandler;
}>;