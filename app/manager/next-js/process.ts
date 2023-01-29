import { ChildProcess, ExecException, execFile } from 'child_process';
import { dialog } from 'electron';


export namespace NextJsProcess {
    let nextJsProcess: ChildProcess;
    export function start(dev: boolean = false): void {
        nextJsProcess = execFile('next', dev ? ['dev'] : ['start'], (err: ExecException, stdout: string) => {
            console.log(stdout);
            if (err) {
                console.error(err);
                dialog.showErrorBox('错误', 'Next.Js Process started error\nerror message:\n' + err);
            }
        });
        nextJsProcess.stdout?.on('data', (data) => {
            console.log(data); 
        });
    }
}
export default NextJsProcess;