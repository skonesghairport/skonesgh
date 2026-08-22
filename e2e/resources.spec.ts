import { expect, test } from "@playwright/test";

test.describe("security resources hub", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resources");
    await expect(page.getByTestId("resource-count")).toHaveText(
      "Showing 6 of 6 resources"
    );
  });

  test("search narrows resources by title and credential notes", async ({
    page,
  }) => {
    await page.getByTestId("resource-search").fill("certificate");

    await expect(page.getByTestId("resource-count")).toHaveText(
      "Showing 1 of 6 resources"
    );
    await expect(page.getByTestId("resource-card")).toHaveCount(1);
    await expect(page.getByTestId("resource-card")).toContainText(
      "Cybersecurity course catalog"
    );
  });

  test("provider, level, and credential filters combine correctly", async ({
    page,
  }) => {
    await page.getByTestId("provider-filter").selectOption({
      label: "Cisco Skills for All",
    });
    await expect(page.getByTestId("resource-count")).toHaveText(
      "Showing 2 of 6 resources"
    );

    await page.getByTestId("level-filter").selectOption({ label: "Beginner" });
    await expect(page.getByTestId("resource-count")).toHaveText(
      "Showing 2 of 6 resources"
    );

    await page
      .getByTestId("credential-filter")
      .selectOption({ label: "Certification pathway" });
    await expect(page.getByTestId("resource-count")).toHaveText(
      "Showing 1 of 6 resources"
    );
    await expect(page.getByTestId("resource-card")).toContainText(
      "Cybersecurity Essentials"
    );
  });

  test("combined filters show a recoverable empty state and reset", async ({
    page,
  }) => {
    await page.getByTestId("resource-search").fill("certificate");
    await page.getByTestId("provider-filter").selectOption({
      label: "Cisco Skills for All",
    });

    await expect(page.getByTestId("resource-count")).toHaveText(
      "Showing 0 of 6 resources"
    );
    await expect(
      page.getByText("No resources match those filters.")
    ).toBeVisible();

    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByTestId("resource-count")).toHaveText(
      "Showing 6 of 6 resources"
    );
    await expect(page.getByTestId("resource-card")).toHaveCount(6);
  });

  test("airport quick views update the official FlightRadar24 link", async ({
    page,
  }) => {
    await page.getByTestId("flight-quick-view-jfk").click();

    await expect(page.getByTestId("flight-tracker-link")).toHaveAttribute(
      "href",
      "https://www.flightradar24.com/data/airports/jfk"
    );
    await expect(page.getByTestId("flight-tracker-link")).toContainText(
      "Open JFK airport"
    );
  });
});

test.describe("resources visual regression", () => {
  test("default resources hub matches its visual baseline", async ({
    page,
  }) => {
    await page.goto("/resources");
    await expect(page).toHaveScreenshot("resources-hub.png", {
      fullPage: true,
      animations: "disabled",
    });
  });

  test("filtered resources state matches its visual baseline", async ({
    page,
  }) => {
    await page.goto("/resources");
    await page.getByTestId("resource-search").fill("certificate");
    await expect(page).toHaveScreenshot("resources-filtered-certificate.png", {
      fullPage: true,
      animations: "disabled",
    });
  });
});

test("regional airline filter changes airport views and carrier summary", async ({
  page,
}) => {
  await page.goto("/resources");
  await page.getByTestId("airline-region-filter").selectOption("asia-pacific");

  await expect(page.getByTestId("airline-region-summary")).toContainText("ANA");
  await expect(page.locator('[data-testid^="flight-quick-view-"]')).toHaveCount(
    3
  );
  await expect(page.getByTestId("flight-quick-view-hnd")).toBeVisible();
  await expect(page.getByTestId("flight-quick-view-atl")).toHaveCount(0);
});
