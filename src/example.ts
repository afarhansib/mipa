import { MinecraftBedrockWrapper } from './index';

const wrapper = new MinecraftBedrockWrapper(
    'C:\\Users\\Klee\\Downloads\\Compressed\\bds-1.21.41.01',
    'C:\\Users\\Klee\\Downloads\\Compressed\\bds-1.21.41.01\\worlds\\MimiUniverse\\behavior_packs\\Mimi Alpha'
);

// Start the server
wrapper.startServer();

// Schedule daily restart at 4 AM
wrapper.scheduleTask('*/2 * * * *', 'dailyRestart', 'restart');

// Schedule backup every 6 hours
wrapper.scheduleTask('0 */6 * * *', 'backup', 'save hold');
