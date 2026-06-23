import { TestUser } from '../models/user-model';
import { makeTestUser, uniqueStamp } from '../utils/test-data';

export interface RegistrationData {
    testCase: string;
    makeUser: (workerIndex: number) => TestUser;
    expectedResult: string;
    expectedStatus?: number;
}

export interface InvalidRegistrationData {
    testCase: string;
    name: string;
    email: string;
    password: string;
    expectedResult: string;
    gender: '0' | '1';
}

export interface RequiredRegistrationFieldData {
    testCase: string;
    field: 'name' | 'email' | 'password';
}

type RegistrationCase = {
    testCase: string;
    makeUser: (workerIndex: number) => TestUser;
};

export const validRegistrationApiData: RegistrationCase[] = [
    {
        testCase: 'Valid registration',
        makeUser: (workerIndex) => makeTestUser(workerIndex, { name: 'TestUser', gender: '1' }),
    },
];

export const validRegistrationUiData: RegistrationData[] = [
    {
        testCase: 'Valid registration',
        makeUser: (workerIndex) => makeTestUser(workerIndex, { name: 'TestUser', gender: '1' }),
        expectedResult: 'success',
    },
    {
        testCase: 'Min name length',
        makeUser: (workerIndex) => makeTestUser(workerIndex, { name: 'A', gender: '1' }),
        expectedResult: 'success',
    },
    {
        testCase: 'Email with subdomain',
        makeUser: (workerIndex) => {
            const stamp = uniqueStamp(workerIndex);
            return makeTestUser(workerIndex, {
                name: 'TestUser',
                email: `qa-user-${stamp}@mail.example.com`,
                gender: '1',
            });
        },
        expectedResult: 'success',
    },
    {
        testCase: 'Email with plus sign',
        makeUser: (workerIndex) => {
            const stamp = uniqueStamp(workerIndex);
            return makeTestUser(workerIndex, {
                name: 'TestUser',
                email: `qa-user+${stamp}@example.test`,
                gender: '1',
            });
        },
        expectedResult: 'success',
    },
    {
        testCase: 'Boundary email length 254 chars',
        makeUser: (workerIndex) => {
            const stamp = uniqueStamp(workerIndex).replace(/-/g, '');
            const label = (prefix: string, length: number, fill: string) =>
                `${prefix}${stamp}`.slice(0, length).padEnd(length, fill);

            return makeTestUser(workerIndex, {
                name: 'TestUser',
                email: `${label('qa', 64, 'a')}@${label('mail', 63, 'b')}.${label('qa', 63, 'c')}.${label('e2e', 57, 'd')}.com`,
                gender: '1',
            });
        },
        expectedResult: 'success',
    },
];

export const invalidRegistrationApiData: RegistrationCase[] = [
    {
        testCase: 'Empty name',
        makeUser: (workerIndex) => makeTestUser(workerIndex, { name: '', gender: '1' }),
    },
    {
        testCase: 'Empty email',
        makeUser: (workerIndex) => makeTestUser(workerIndex, { email: '', gender: '0' }),
    },
    {
        testCase: 'Name longer than 255 chars',
        makeUser: (workerIndex) => makeTestUser(workerIndex, { name: 'A'.repeat(256), gender: '0' }),
    },
];

export const invalidEmailUiData: InvalidRegistrationData[] = [
    {
        testCase: 'Email without local part',
        name: 'TestUser',
        email: '@example.com',
        password: 'Password123!',
        gender: '1',
        expectedResult: 'validation-error',
    },
    {
        testCase: 'Email with double @',
        name: 'TestUser',
        email: 'test@@example.com',
        password: 'Password123!',
        gender: '1',
        expectedResult: 'validation-error',
    },
    {
        testCase: 'Email with spaces',
        name: 'TestUser',
        email: 'test user@example.com',
        password: 'Password123!',
        gender: '1',
        expectedResult: 'validation-error',
    },
    {
        testCase: 'Missing domain name',
        name: 'TestUser',
        email: 'test@.com',
        password: 'Password123!',
        gender: '1',
        expectedResult: 'validation-error',
    },
    {
        testCase: 'Domain starts with hyphen',
        name: 'TestUser',
        email: 'test@-example.com',
        password: 'Password123!',
        gender: '1',
        expectedResult: 'validation-error',
    },
    {
        testCase: 'Domain ends with hyphen',
        name: 'TestUser',
        email: 'test@example-.com',
        password: 'Password123!',
        gender: '1',
        expectedResult: 'validation-error',
    },
    {
        testCase: 'Email longer than 254 chars',
        name: 'TestUser',
        email: `${'a'.repeat(65)}@${'b'.repeat(190)}.com`,
        password: 'Password123!',
        gender: '1',
        expectedResult: 'validation-error',
    },
];

export const requiredRegistrationFieldUiData: RequiredRegistrationFieldData[] = [
    {
        testCase: 'Empty name',
        field: 'name',
    },
    {
        testCase: 'Empty email',
        field: 'email',
    },
    {
        testCase: 'Empty password',
        field: 'password',
    },
];
