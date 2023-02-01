export type Tool = 'mouse'|'edit'|'info';

export interface ToolBarProps {
    tool?: Tool;
}

export interface ToolBarState {
    tool: Tool;
}