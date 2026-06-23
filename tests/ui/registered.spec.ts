import { expect, test } from '../../src/fixtures/fixtures';
import {
    invalidEmailUiData,
    requiredRegistrationFieldUiData,
    validRegistrationUiData,
} from '../../src/data/registrationData';
import { makeTestUser } from '../../src/utils/test-data';

test.describe('Registration UI - Positive scenarios', () => {
    for (const registrationCase of validRegistrationUiData) {
        test(`${registrationCase.testCase} should register successfully`, async ({ app, unauthenticatedPage }, testInfo) => {
            const user = registrationCase.makeUser(testInfo.workerIndex);

            await unauthenticatedPage.goto('/');
            await app.authPage.openRegister();
            await app.authPage.register(user);

            await app.dashboardPage.expectLoaded();
            await app.profilePage.open();
            await app.profilePage.expectProfileData(user.name, user.email);
        });
    }
});

test.describe('Registration UI - Negative scenarios', () => {
    for (const registrationCase of invalidEmailUiData) {
        test(`${registrationCase.testCase} should show email validation`, async ({ app }) => {
            await app.authPage.openRegister();
            await app.authPage.fillRegistrationForm(registrationCase);

            await expect(app.authPage.locators.registerEmailInput).toHaveJSProperty('validity.valid', false);
            expect(await app.authPage.getRegisterEmailValidationMessage()).toBeTruthy();
            await expect(app.authPage.locators.registerSubmitButton).toBeVisible();
        });
    }

    for (const registrationCase of requiredRegistrationFieldUiData) {
        test(`${registrationCase.testCase} should be required`, async ({ app }, testInfo) => {
            const user = makeTestUser(testInfo.workerIndex, { gender: '1' });
            user[registrationCase.field] = '';

            await app.authPage.openRegister();
            await app.authPage.register(user);

            expect(await app.authPage.getRegisterRequiredFieldValidationMessage(registrationCase.field)).toBeTruthy();
            await expect(app.authPage.locators.registerSubmitButton).toBeVisible();
        });
    }
});
