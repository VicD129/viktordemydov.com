import { statSync } from 'node:fs';

export default () => ({
  cssVersion: Math.floor(statSync('css/style.css').mtimeMs)
});
