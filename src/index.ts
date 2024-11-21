import chokidar from 'chokidar';
import { spawn } from 'child_process';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';

export class MinecraftBedrockWrapper {
    private serverProcess: any;
    private addonPath: string;
    private serverPath: string;
    private tasks: Map<string, any> = new Map();

    constructor(serverPath: string, addonPath: string) {
        this.serverPath = serverPath;
        this.addonPath = addonPath;
    }

    startServer() {
        this.serverProcess = spawn('./bedrock_server', [], {
            cwd: this.serverPath,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        this.serverProcess.stdout.on('data', (data: Buffer) => {
            console.log(data.toString());
        });

        this.setupAddonWatcher();
    }

    private setupAddonWatcher() {
        const watcher = chokidar.watch(this.addonPath, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });

        watcher.on('change', (path) => {
            console.log(`Addon file changed: ${path}`);
            this.reloadAddons();
        });
    }

    sendCommand(command: string) {
        if (this.serverProcess) {
            this.serverProcess.stdin.write(command + '\n');
        }
    }

    reloadAddons() {
        this.sendCommand('reload');
    }

    scheduleTask(cronExpression: string, taskName: string, command: string) {
        const task = cron.schedule(cronExpression, () => {
            switch (command) {
                case 'restart':
                    this.gracefulRestart();
                    break;
                case 'stop':
                    this.stop();
                    break;
                default:
                    this.sendCommand(command);
            }
        });
        this.tasks.set(taskName, task);
    }

    gracefulRestart() {
        if (this.serverProcess) {
            this.sendCommand('say Server will restart in 10 seconds');
            setTimeout(() => {
                this.sendCommand('stop');
                // Wait for server to fully stop
                this.serverProcess.on('exit', () => {
                    console.log('Server stopped, starting again...');
                    // Start the server again
                    this.startServer();
                });
            }, 10000);
        }
    }

    stop() {
        if (this.serverProcess) {
            this.sendCommand('stop');
        }
    }
}
