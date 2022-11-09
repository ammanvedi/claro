import {ExecException, exec} from "child_process";

export const runCmd = (cmd: string): Promise<{
    stdout: string,
    stderr: string
}> => {
    return new Promise((res, rej) => {
        exec(cmd, (error, stdout, stderr) => {

            if(error) {
                rej(error)
                return;
            }

            res({
                stdout, stderr
            })
        })
    })
}

enum LogLevel {
    Info = 'INFO',
    Warn = 'WARN',
    Err = 'ERR',
    Succ = 'Succ'
}

const createLogger = (level: LogLevel) => (message: string) => {
    console.log(`${level}: ${message}`)
}

export const logger = {
    info: createLogger(LogLevel.Info),
    warn: createLogger(LogLevel.Warn),
    err: createLogger(LogLevel.Err),
    succ: createLogger(LogLevel.Succ),
}