import { test as base } from '@playwright/test';
import { AppApi } from '../api/app-api';
import { requireAccessKey } from '../config/env';

type Fixtures = {
  appApi: AppApi;
};

export const apiTest = base.extend<Fixtures>({
  appApi: async ({ request }, use) => {
    await use(new AppApi(request));
  },

  page: async ({ page }, use) => {
    await page.route('**/api/**', async (route) => {
      const headers = {
        ...route.request().headers(),
        'x-access-key': requireAccessKey(),
      };
      await route.continue({ headers });
    });
    await use(page);
  },
});

export { expect } from '@playwright/test';
