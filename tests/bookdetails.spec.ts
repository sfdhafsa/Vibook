import { test, expect } from "@playwright/test";
import { mockWorkDetails } from "./mocks/openlibrary";

test("Book details page displays work + author", async ({ page }) => {
  await mockWorkDetails(page);

  // Your route seems: /book/:id
  await page.goto("/book/OL1W");

  await expect(page.getByRole("heading", { name: "Mock Book One" })).toBeVisible();

  await expect(page.getByText("Mock Author")).toBeVisible();

  await expect(page.getByText("This is a mocked description.")).toBeVisible();

  await expect(page.getByText("Fantasy")).toBeVisible();
});
