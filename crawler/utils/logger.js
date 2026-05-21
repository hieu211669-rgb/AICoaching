const colors = { reset: "\x1b[0m", green: "\x1b[32m", yellow: "\x1b[33m", red: "\x1b[31m", cyan: "\x1b[36m" };

function timestamp() {
  return new Date().toISOString().slice(11, 19);
}

export const logger = {
  info: (msg) => console.log(`${colors.green}[${timestamp()}] INFO${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[${timestamp()}] WARN${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[${timestamp()}] ERROR${colors.reset} ${msg}`),
  progress: (current, total, url) =>
    console.log(`${colors.cyan}[${timestamp()}] [${current}/${total}]${colors.reset} ${url}`),
};
