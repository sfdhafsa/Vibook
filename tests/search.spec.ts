import { test, expect } from '@playwright/test';
import { mockSearch } from './mocks/openlibrary';

test('Filters work: author filter shows Rowling book', async ({ page }) => {
  await mockSearch(page);

  await page.goto('/search?q=test');

  // Fill author filter input
  await page.getByPlaceholder('Author').fill('J.K Rowling');

  // Click Apply
  await page.getByRole('button', { name: 'Apply' }).click();

  await expect(page.getByText('Harry Potter and the Mocking Stone')).toBeVisible();
});
