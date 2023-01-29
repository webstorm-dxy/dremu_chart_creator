"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWindow = void 0;
var electron_1 = require("electron");
var windowConfigs = require('../config/window');
// 所有窗口
var windows = {};
function createWindow(key, configs) {
    if (configs === void 0) { configs = {}; }
    windows[key] = new electron_1.BrowserWindow(__assign(__assign(__assign({}, windowConfigs.default), (windowConfigs[key] || {})), configs));
    return windows[key];
}
exports.createWindow = createWindow;
//# sourceMappingURL=window.js.map