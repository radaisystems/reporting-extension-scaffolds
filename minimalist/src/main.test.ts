import { describe, test } from "vitest";

import * as reporting from "@radai/reporting-extensions";

describe("main", () => {
  test("test", async () => {
    // Initialize the SDK
    reporting.mocks.initialize();

    // Import our script
    await import("./main.js");

    // Add your test code here
  });
});
