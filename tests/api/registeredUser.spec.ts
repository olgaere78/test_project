import { test, expect } from '../../src/fixtures/fixtures';
import {
    validRegistrationApiData,
    invalidRegistrationApiData,
} from '../../src/data/registrationData';

test.describe('Registration API', () => {
    test.describe('Positive scenarios', () => {
        for (const registrationCase of validRegistrationApiData) {
            test(`${registrationCase.testCase} should be able to register`, async ({ appApi }, testInfo) => {
                const user = registrationCase.makeUser(testInfo.workerIndex);

                const response = await appApi.register(user);

                expect(response.status()).toBe(201);

                const body = await response.json();

                expect(body).toMatchObject({
                    message: 'User registered successfully',
                });

                const profile = await appApi.getProfile((await appApi.login(user.email, user.password)).token);
                expect(profile.user).toMatchObject({
                    email: user.email,
                    name: user.name,
                });
            });
        }
    });

    test.describe('Negative scenarios', () => {
        for (const registrationCase of invalidRegistrationApiData) {
            test(`${registrationCase.testCase} should not be able to register`, async ({ appApi }, testInfo) => {
                const user = registrationCase.makeUser(testInfo.workerIndex);
                const response = await appApi.register(user);

                expect(response.ok()).toBeFalsy();
                expect(response.status()).toBeGreaterThanOrEqual(400);

                const body = await response.json();

                expect(body).toBeDefined();
            });
        }
    });
});
