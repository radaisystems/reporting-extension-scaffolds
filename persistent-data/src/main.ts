import * as reporting from "@radai/reporting-extensions";

/******************************************************************************/
/* Callbacks */
function render() {
  const reportsOpened = reporting.cache.get("reportsOpened", 0);

  reporting.views.render([
    {
      type: "header",
      size: "large",
      children: [
        {
          type: "text",
          children: `Reports Opened: ${reportsOpened}`,
        },
      ],
    },
  ]);
}

/******************************************************************************/
/* Handlers */
reporting.lifecycle.addEventListener("report-opened", () => {
  const reportsOpened = reporting.cache.get("reportsOpened", 0);

  reporting.cache.set("reportsOpened", reportsOpened + 1);

  render();
});

render();
