import { test } from '../../src/fixtures/fixtures';

test.describe('User UI flow', () => {
    test('registers a user and manages', async ({ page, appApi, app, guestUser }) => {
        await app.authPage.openRegister();
        await app.authPage.register(guestUser);

        await app.dashboardPage.expectLoaded();
    });
});