import { mergeTests, expect } from '@playwright/test';
import { appapiTest } from '../fixtures/api-fixture';
import { uiTest } from '../fixtures/app-fixture';

export const test = mergeTests( appapiTest, uiTest);
export { expect };