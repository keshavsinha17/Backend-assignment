import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = join(__dirname, '..', 'logs', 'stock_monitor.log');

async function checkLogs() {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      console.log('No log file found');
      return;
    }

    const logs = fs.readFileSync(LOG_FILE, 'utf-8');
    console.log('Stock monitor logs:');
    console.log(logs);
  } catch (error) {
    console.error('Error reading logs:', error);
  }
}

checkLogs();
