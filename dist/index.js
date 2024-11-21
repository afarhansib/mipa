"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinecraftBedrockWrapper = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const child_process_1 = require("child_process");
const node_cron_1 = __importDefault(require("node-cron"));
class MinecraftBedrockWrapper {
    constructor(serverPath, addonPath) {
        this.tasks = new Map();
        this.serverPath = serverPath;
        this.addonPath = addonPath;
    }
    startServer() {
        this.serverProcess = (0, child_process_1.spawn)('./bedrock_server', [], {
            cwd: this.serverPath,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        this.serverProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        this.setupAddonWatcher();
    }
    setupAddonWatcher() {
        const watcher = chokidar_1.default.watch(this.addonPath, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        watcher.on('change', (path) => {
            console.log(`Addon file changed: ${path}`);
            this.reloadAddons();
        });
    }
    sendCommand(command) {
        if (this.serverProcess) {
            this.serverProcess.stdin.write(command + '\n');
        }
    }
    reloadAddons() {
        this.sendCommand('reload');
    }
    scheduleTask(cronExpression, taskName, command) {
        const task = node_cron_1.default.schedule(cronExpression, () => {
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
exports.MinecraftBedrockWrapper = MinecraftBedrockWrapper;
