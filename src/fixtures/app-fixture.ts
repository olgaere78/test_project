import { test as base } from '@playwright/test';
import { App } from '../pages/page-manager';

type Fixtures = {
  app: App;
};

export const uiTest = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    const app = new App(page);
    await use(app);
  },
});

export { expect } from '@playwright/test';