import * as reporting from "@rad-ai/reporting-extensions";

function startedShift() {
  // Stop listening to `report-created` events
  reporting.lifecycle.removeEventListener("report-created", startedShift);

  // Code to keep track of shift starting
  const startedShiftLog = `Started shift at ${new Date()}.`;
  reporting.alerts.notify(startedShiftLog, { level: "success" });
}

reporting.lifecycle.addEventListener("report-created", startedShift);
