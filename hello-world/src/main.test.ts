import { describe, expect, test, vi } from "vitest";

import * as reporting from "@rad-ai/reporting-extensions";

describe("report-created", () => {
  test("cancel", async () => {
    vi.spyOn(reporting.alerts, "notify");

    // Initialize the SDK
    reporting.mocks.initialize();

    // Import our script
    await import("./main.js");

    // Assert initial state
    expect(reporting.alerts.notify).not.toHaveBeenCalled();

    // Create the report
    reporting.mocks.createReport();

    // Cancel the confirmation
    await vi.waitFor(() =>
      reporting.mocks.respondToLastConfirmation("cancelled")
    );

    // Ensure notification is fired
    await vi.waitFor(() => {
      expect(reporting.alerts.notify).toHaveBeenCalledTimes(1);
      expect(reporting.alerts.notify).toHaveBeenCalledWith(
        "Missing out, but that's your choice 🫡",
        { level: "error" }
      );
    });
  });

  test("confirm then cancel", async () => {
    vi.spyOn(reporting.alerts, "notify");

    // Initialize the SDK
    reporting.mocks.initialize();

    // Import our script
    await import("./main.js");

    // Assert initial state
    expect(reporting.alerts.notify).not.toHaveBeenCalled();

    // Create the report
    reporting.mocks.createReport();

    // Confirm the first request
    await vi.waitFor(() =>
      reporting.mocks.respondToLastConfirmation("confirmed")
    );

    // Cancel the second request
    await vi.waitFor(() =>
      reporting.mocks.respondToLastConfirmation("cancelled")
    );

    // Assert updated state
    await vi.waitFor(() => {
      expect(reporting.alerts.notify).toHaveBeenCalledTimes(1);
      expect(reporting.alerts.notify).toHaveBeenCalledWith(
        "Make up your mind please 😖",
        { level: "warning" }
      );
    });
  });

  test("confirm then confirm", async () => {
    vi.spyOn(reporting.alerts, "notify");

    // Initialize the SDK
    reporting.mocks.initialize();

    // Import our script
    await import("./main.js");

    // Assert initial state
    expect(reporting.alerts.notify).not.toHaveBeenCalled();

    // Create the report
    reporting.mocks.createReport();

    // Confirm the first request
    await vi.waitFor(() =>
      reporting.mocks.respondToLastConfirmation("confirmed")
    );

    // Cancel the second request
    await vi.waitFor(() =>
      reporting.mocks.respondToLastConfirmation("confirmed")
    );

    // Assert updated state
    await vi.waitFor(() => {
      expect(reporting.alerts.notify).toHaveBeenCalledTimes(1);
      expect(reporting.alerts.notify).toHaveBeenCalledWith("Good idea 🤓", {
        level: "success",
      });
    });
  });
});

describe("report-signing", () => {
  test("with impression and without impression", async () => {
    // Both the with and without checks are in the same test
    // We're not able to reset local state between tests in the same file
    // See: https://github.com/vitest-dev/vitest/discussions/1741#discussioncomment-3298647
    const updateTreeViewSpy = vi.spyOn(reporting.views.tree, "updateTreeView");

    // Initialize the SDK
    reporting.mocks.initialize();

    // Import our script
    await import("./main.js");

    // Assert initial state
    expect(reporting.views.tree.updateTreeView).not.toHaveBeenCalled();

    // Sign a report with "impression" in the text
    reporting.mocks.signReport("My report contains an impression");

    // Sign a report without "impression" in the text
    reporting.mocks.signReport("My report contains a finding");

    // Check the tree views
    await vi.waitFor(() => {
      expect(reporting.views.tree.updateTreeView).toHaveBeenCalledTimes(2);

      const firstTreeNodes = JSON.stringify(updateTreeViewSpy.mock.calls[0]);

      expect(firstTreeNodes).toContain("Total Reports: 1");
      expect(firstTreeNodes).toContain("Malformed Reports: 0");
      expect(firstTreeNodes).toContain("Report Success Rate: 100.0%");

      const secondTreeNodes = JSON.stringify(updateTreeViewSpy.mock.calls[1]);

      expect(secondTreeNodes).toContain("Total Reports: 2");
      expect(secondTreeNodes).toContain("Malformed Reports: 1");
      expect(secondTreeNodes).toContain("Report Success Rate: 50.0%");
    });
  });
});
