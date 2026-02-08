import type { Page } from "@playwright/test";

/**
 * Mock OpenLibrary search endpoint
 */
export async function mockSearch(page: Page) {
  await page.route("**/search.json**", async (route) => {
    const url = new URL(route.request().url());

    const q = url.searchParams.get("q");
    const author = url.searchParams.get("author");

    // Simulate: author filter returning results
    if (author?.toLowerCase().includes("rowling")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          numFound: 1,
          start: 0,
          docs: [
            {
              key: "/works/OLROWLINGW",
              title: "Harry Potter and the Mocking Stone",
              author_name: ["J. K. Rowling"],
              cover_i: 123,
            },
          ],
        }),
      });
    }

    // Simulate: normal search returning results
    if (q && q.length >= 2) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          numFound: 2,
          start: 0,
          docs: [
            {
              key: "/works/OL1W",
              title: "Mock Book One",
              author_name: ["Mock Author"],
              cover_i: 111,
            },
            {
              key: "/works/OL2W",
              title: "Mock Book Two",
              author_name: ["Another Author"],
              cover_i: 222,
            },
          ],
        }),
      });
    }

    // Simulate: empty results
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        numFound: 0,
        start: 0,
        docs: [],
      }),
    });
  });
}

/**
 * Mock recent changes endpoint
 */
export async function mockRecentChanges(page: Page) {
  await page.route("**/recentchanges.json**", async (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "1",
          kind: "edit",
          timestamp: new Date().toISOString(),
          comment: "Updated a record",
          author: { key: "/people/testuser" },
        },
        {
          id: "2",
          kind: "new",
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          comment: "Added a new work",
          author: { key: "/people/anotheruser" },
        },
      ]),
    });
  });
}

/**
 * Mock work details endpoint
 */
export async function mockWorkDetails(page: Page) {
  await page.route("**/works/OL1W.json", async (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        key: "/works/OL1W",
        title: "Mock Book One",
        description: "This is a mocked description.",
        covers: [111],
        first_publish_date: "1999",
        subjects: ["Fantasy", "Magic"],
        authors: [{ author: { key: "/authors/OLAUTH1A" } }],
      }),
    });
  });

  await page.route("**/authors/OLAUTH1A.json", async (route) => {
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        key: "/authors/OLAUTH1A",
        name: "Mock Author",
        birth_date: "1965",
        bio: "Mock author bio.",
      }),
    });
  });
}
