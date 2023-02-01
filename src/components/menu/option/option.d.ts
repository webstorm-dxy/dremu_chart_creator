export type OptionProps = React.PropsWithChildren<{
    onClickHandler?: React.MouseEventHandler | ((ev: React.MouseEvent, checked?: boolean|undefined) => void);
    checked?: undefined|boolean;
    disabled?: boolean;
}>;

export interface OptionState {
    checked: boolean;
    disabled: boolean;
}