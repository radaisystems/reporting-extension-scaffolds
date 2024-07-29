import * as reporting from "@rad-ai/reporting-extensions";
import { describe, expect, test, vi } from "vitest";

describe("report-created", () => {
  test("started shift is logged once", async () => {
    // Spy on the `reporting.alerts.notify` function to make sure it's called
    vi.spyOn(reporting.alerts, "notify");

    // Mock the current date so we can validate the notification content
    const date = new Date(2024, 1, 1);
    vi.setSystemTime(date);

    // Initialize the SDK
    reporting.mocks.initialize();

    // Import our script
    await import("./main.js");

    // Assert initial state
    expect(reporting.alerts.notify).not.toHaveBeenCalled();

    // Create a report and another report immediately after
    reporting.mocks.createReport();
    reporting.mocks.createReport();

    // Ensure only a single notification has been fired
    await vi.waitFor(() => {
      expect(reporting.alerts.notify).toHaveBeenCalledTimes(1);
      expect(reporting.alerts.notify).toHaveBeenCalledWith(
        `Started shift at ${date}.`,
        { level: "success" }
      );
    });
  });
});
