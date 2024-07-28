import * as reporting from "@rad-ai/reporting-extensions";

reporting.lifecycle.addEventListener("report-created", () => {
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

reporting.lifecycle.addEventListener("report-signing", (event) => {
  const lowerContent = event.contentStr.toLowerCase();
  const requiredContent = "IMPRESSION".toLowerCase();

  const mentionedImpression = lowerContent.includes(requiredContent);

  if (!mentionedImpression) {
    malformedReports++;
  }

  totalReports++;

  reporting.views.tree.updateTreeView([
    {
      type: "text",
      value: "Report Stats:",
      children: [
        {
          type: "list",
          children: [
            {
              type: "text",
              value: `Total Reports: ${totalReports.toLocaleString()}`,
            },
            {
              type: "text",
              value: `Malformed Reports: ${malformedReports.toLocaleString()}`,
            },
            {
              type: "text",
              value: `Report Success Rate: ${(((totalReports - malformedReports) / totalReports) * 100).toFixed(1)}%`,
            },
            {
              type: "checkbox",
              checked: mentionedImpression,
              value: "Contains Impression Section",
            },
          ],
        },
      ],
    },
  ]);
});
