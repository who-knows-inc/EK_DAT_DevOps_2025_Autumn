import { test, expect } from '@playwright/test';

test('can search', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('textbox', { name: 'Search...' }).click();
  await page.getByRole('textbox', { name: 'Search...' }).fill('What is programming?');
  await page.getByRole('button', { name: 'Search' }).click();
});