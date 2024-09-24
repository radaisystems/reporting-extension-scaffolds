import * as reporting from "@radai/reporting-extensions";

reporting.lifecycle.addEventListener("report-opened", () => {
  reporting.alerts.confirm("Are you sure you want to create a report? 🫣", {
    onConfirm: () => {
      reporting.alerts.confirm("Are you really, really sure?? 😥", {
        onConfirm: () => {
          reporting.alerts.notify("Good idea 🤓", {
            level: "success",
          });
        },
        onCancel: () => {
          reporting.alerts.notify("Make up your mind please 😖", {
            level: "warning",
          });
        },
        confirmText: "Yes please!",
        cancelText: "No way!",
      });
    },
    onCancel: () => {
      reporting.alerts.notify("Missing out, but that's your choice 🫡", {
        level: "error",
      });
    },
  });
});

let totalReports = 0;
let malformedReports = 0;

reporting.lifecycle.addEventListener("report-updated", (event) => {
  const lowerContent = event.shortcuts.reportContent.toLowerCase();
  const requiredContent = "IMPRESSION".toLowerCase();

  const mentionedImpression = lowerContent.includes(requiredContent);

  if (!mentionedImpression) {
    malformedReports++;
  }

  totalReports++;

  reporting.views.render([
    {
      type: "text",
      children: "Report Stats:",
    },
    {
      type: "list",
      children: [
        {
          type: "text",
          children: `Total Reports: ${totalReports.toLocaleString()}`,
        },
        {
          type: "text",
          children: `Malformed Reports: ${malformedReports.toLocaleString()}`,
        },
        {
          type: "text",
          children: `Report Success Rate: ${(((totalReports - malformedReports) / totalReports) * 100).toFixed(1)}%`,
        },
        {
          type: "checkbox",
          checked: mentionedImpression,
          children: "Contains Impression Section",
        },
      ],
    },
  ]);
});
