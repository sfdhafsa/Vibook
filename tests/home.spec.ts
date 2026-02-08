import { test, expect } from "@playwright/test";
import { mockRecentChanges } from "./mocks/openlibrary";

test("Home displays recent changes", async ({ page }) => {
  await mockRecentChanges(page);

  await page.goto("/");

  await expect(page.getByText("Recent changes")).toBeVisible();

  // Check at least one change is visible
  await expect(page.getByText("Updated a record")).toBeVisible();
  await expect(page.getByText("Added a new work")).toBeVisible();
});
