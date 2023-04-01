export interface WindowOptions {
    /**
     * Remote URL or local file path to open.
     *
     * - URL such as `https://github.com/tauri-apps` is opened directly on a Tauri window.
     * - data: URL such as `data:text/html,<html>...` is only supported with the `window-data-url` Cargo feature for the `tauri` dependency.
     * - local file path or route such as `/path/to/page.html` or `/users` is appended to the application URL (the devServer URL on development, or `tauri://localhost/` and `https://tauri.localhost/` on production).
     */
    url?: string;
    /** Show window in the center of the screen.. */
    center?: boolean;
    /** The initial vertical position. Only applies if `y` is also set. */
    x?: number;
    /** The initial horizontal position. Only applies if `x` is also set. */
    y?: number;
    /** The initial width. */
    width?: number;
    /** The initial height. */
    height?: number;
    /** The minimum width. Only applies if `minHeight` is also set. */
    minWidth?: number;
    /** The minimum height. Only applies if `minWidth` is also set. */
    minHeight?: number;
    /** The maximum width. Only applies if `maxHeight` is also set. */
    maxWidth?: number;
    /** The maximum height. Only applies if `maxWidth` is also set. */
    maxHeight?: number;
    /** Whether the window is resizable or not. */
    resizable?: boolean;
    /** Window title. */
    title?: string;
    /** Whether the window is in fullscreen mode or not. */
    fullscreen?: boolean;
    /** Whether the window will be initially focused or not. */
    focus?: boolean;
    /**
     * Whether the window is transparent or not.
     * Note that on `macOS` this requires the `macos-private-api` feature flag, enabled under `tauri.conf.json > tauri > macOSPrivateApi`.
     * WARNING: Using private APIs on `macOS` prevents your application from being accepted to the `App Store`.
     */
    transparent?: boolean;
    /** Whether the window should be maximized upon creation or not. */
    maximized?: boolean;
    /** Whether the window should be immediately visible upon creation or not. */
    visible?: boolean;
    /** Whether the window should have borders and bars or not. */
    decorations?: boolean;
    /** Whether the window should always be on top of other windows or not. */
    alwaysOnTop?: boolean;
    /** Whether or not the window icon should be added to the taskbar. */
    skipTaskbar?: boolean;
    /**
     * Whether the file drop is enabled or not on the webview. By default it is enabled.
     *
     * Disabling it is required to use drag and drop on the frontend on Windows.
     */
    fileDropEnabled?: boolean;
    /**
     * The initial window theme. Defaults to the system theme.
     *
     * Only implemented on Windows and macOS 10.14+.
     */
    theme?: Theme;
    /**
     * The style of the macOS title bar.
     */
    titleBarStyle?: TitleBarStyle;
    /**
     * If `true`, sets the window title to be hidden on macOS.
     */
    hiddenTitle?: boolean;
    /**
     * Whether clicking an inactive window also clicks through to the webview.
     */
    acceptFirstMouse?: boolean;
    /**
     * Defines the window [tabbing identifier](https://developer.apple.com/documentation/appkit/nswindow/1644704-tabbingidentifier) on macOS.
     *
     * Windows with the same tabbing identifier will be grouped together.
     * If the tabbing identifier is not set, automatic tabbing will be disabled.
     */
    tabbingIdentifier?: string;
    /**
     * The user agent for the webview.
     */
    userAgent?: string;
}