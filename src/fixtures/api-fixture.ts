import { test as base, Page } from '@playwright/test';
import { AppApi } from '../api/app-api';
import { makeTestUser } from '../utils/test-data';
import {TestUser} from '../models/user-model';
import { requireAccessKey } from '../config/env';

type RegisteredUser = {
  user: TestUser;
  token: string;
};

type Fixtures = {
  appApi: AppApi;
  guestUser: TestUser;
  registeredUser: RegisteredUser;
  unauthenticatedPage: Page;
  authorizedPage: Page;
};

export const appapiTest = base.extend<Fixtures>({
  appApi: async ({ request }, use) => {
    await use(new AppApi(request));
  },

  guestUser: async ({ }, use) => {
    await use(makeTestUser());
  },

  registeredUser: async ({ appApi }, use) => {
    const user = makeTestUser();

    const token = await appApi.createUserAndLogin(user);

    await use({
      user,
      token,
    });
  },

  unauthenticatedPage: async ({ page }, use) => {
    await page.route('**/api/**', async (route) => {
      const headers = {
        ...route.request().headers(),
        'x-access-key': requireAccessKey(),
      };

      await route.continue({ headers });
    });

    await use(page);
  },

  authorizedPage: async ({ page, registeredUser }, use) => {
    await page.route('**/api/**', async (route) => {
      const headers = {
        ...route.request().headers(),
        'x-access-key': requireAccessKey(),
      };

      await route.continue({ headers });
    });

    await page.addInitScript((token) => {
      localStorage.setItem('token', token);
    }, registeredUser.token);

    await use(page);
  },
});

export { expect } from '@playwright/test';
