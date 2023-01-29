"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextJsProcess = void 0;
var child_process_1 = require("child_process");
var electron_1 = require("electron");
var NextJsProcess;
(function (NextJsProcess) {
    var nextJsProcess;
    function start(dev) {
        var _a;
        if (dev === void 0) { dev = false; }
        nextJsProcess = (0, child_process_1.execFile)('next', dev ? ['dev'] : ['start'], function (err, stdout) {
            console.log(stdout);
            if (err) {
                console.error(err);
                electron_1.dialog.showErrorBox('错误', 'Next.Js Process started error\nerror message:\n' + err);
            }
        });
        (_a = nextJsProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
            console.log(data);
        });
    }
    NextJsProcess.start = start;
})(NextJsProcess = exports.NextJsProcess || (exports.NextJsProcess = {}));
exports.default = NextJsProcess;
//# sourceMappingURL=process.js.map