import { mergeTests, expect } from '@playwright/test';
import { apiTest } from '../fixtures/api-fixture';
import { uiTest } from '../fixtures/app-fixture';

export const test = mergeTests( apiTest, uiTest);
export { expect };