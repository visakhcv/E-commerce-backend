import { App } from './app';
import 'reflect-metadata';

class Index {
  constructor() {
    this.initialize();
  }

  async initialize() {
    const app = new App();
    await app.listen();
  }
}

try {
  new Index();
} catch (e) {
  /* eslint-disable-next-line no-console */
  console.log(e);
}
