export function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function randomDelay(min = 1000, max = 3000) {
  return delay(Math.floor(Math.random() * (max - min) + min));
}
