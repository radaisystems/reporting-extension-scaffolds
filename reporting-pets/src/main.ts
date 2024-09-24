import * as reporting from "@radai/reporting-extensions";

import backgroundBeach from "/background-beach.png";
import backgroundForest from "/background-forest.png";
import akitaIdle from "/akita-idle.gif";
import akitaLie from "/akita-lie.gif";
import akitaRun from "/akita-run.gif";
import blackIdle from "/black-idle.gif";
import blackLie from "/black-lie.gif";
import blackRun from "/black-run.gif";
import redIdle from "/red-idle.gif";
import redLie from "/red-lie.gif";
import redRun from "/red-run.gif";
import whiteIdle from "/white-idle.gif";
import whiteLie from "/white-lie.gif";
import whiteRun from "/white-run.gif";

/******************************************************************************/
/* State */
let idleTimeout: ReturnType<typeof setTimeout>;
let lieTimeout: ReturnType<typeof setTimeout>;
let randomTimeout: ReturnType<typeof setTimeout>;

let previousPosition = 1;
let currentPosition = 1;
const buttonIds = [1, 2, 3, 4, 5, 6] as const;

type Theme = "beach" | "forest";
let theme: Theme = "beach";

const themeToImage = {
  beach: backgroundBeach,
  forest: backgroundForest,
};

type Version = "dog/akita" | "dog/black" | "fox/red" | "fox/white";
let version: Version = "dog/akita";

type Action = "lie" | "idle" | "run";
let action: Action = "lie";

const imageMap = {
  "dog/akita": {
    lie: akitaLie,
    idle: akitaIdle,
    run: akitaRun,
  },
  "dog/black": {
    lie: blackLie,
    idle: blackIdle,
    run: blackRun,
  },
  "fox/red": {
    lie: redLie,
    idle: redIdle,
    run: redRun,
  },
  "fox/white": {
    lie: whiteLie,
    idle: whiteIdle,
    run: whiteRun,
  },
} satisfies Record<Version, Record<Action, string>>;

/******************************************************************************/
/* Callbacks */
function calcTime() {
  switch (version) {
    case "dog/akita": {
      return Math.abs(previousPosition - currentPosition) / buttonIds.length;
    }

    case "dog/black": {
      return (
        (Math.abs(previousPosition - currentPosition) / buttonIds.length) * 2
      );
    }

    case "fox/red": {
      return (
        (Math.abs(previousPosition - currentPosition) / buttonIds.length) * 2
      );
    }

    case "fox/white": {
      return (
        (Math.abs(previousPosition - currentPosition) / buttonIds.length) * 2
      );
    }

    default: {
      return version satisfies never;
    }
  }
}

function render(disabled: boolean) {
  reporting.views.render([
    {
      type: "column",
      style: {
        position: "relative",
        height: "calc(100% + 8px)",
        backgroundImage: `url("${themeToImage[theme]}")`,
        backgroundSize: "cover",
        backgroundPositionY: "bottom",
      },
      children: [
        {
          type: "column",
          style: {
            position: "absolute",
            bottom: "0%",
            left: `${((currentPosition - 1) / buttonIds.length) * 100}%`,
            transition: `left ${calcTime()}s linear 0.1s, transform 0.1s linear`,
            width: `${(1 / buttonIds.length) * 100}%`,
            transform: `scaleX(${previousPosition > currentPosition ? -1 : 1})`,
          },
          children: [
            {
              type: "image",
              src: imageMap[version][action],
              children: "Rad AI",
              style: { width: "100%" },
            },
          ],
        },
        {
          type: "column-container",
          style: { flexWrap: "nowrap", gap: "0", height: "100%" },
          children: buttonIds.map((id) => {
            return {
              type: "column",
              style: { flexGrow: 1 },
              children: [
                {
                  type: "button",
                  id: `${id}`,
                  variant: "outlined",
                  color: "primary",
                  children: "",
                  disabled,
                  style: {
                    height: "100%",
                    width: "100%",
                    opacity: "0",
                  },
                },
              ],
            } as const satisfies reporting.types.ColumnNode;
          }),
        },
        {
          type: "column-container",
          style: {
            position: "absolute",
            top: "0",
            width: "100%",
          },
          children: [
            {
              type: "column",
              children: [
                {
                  type: "button",
                  id: "dog/akita",
                  variant: "contained",
                  color: "primary",
                  children: "Dog / Akita",
                },
              ],
            },
            {
              type: "column",
              children: [
                {
                  type: "button",
                  id: "dog/black",
                  variant: "contained",
                  color: "primary",
                  children: "Dog / Black",
                },
              ],
            },
            {
              type: "column",
              children: [
                {
                  type: "button",
                  id: "fox/red",
                  variant: "contained",
                  color: "primary",
                  children: "Fox / Red",
                },
              ],
            },
            {
              type: "column",
              children: [
                {
                  type: "button",
                  id: "fox/white",
                  variant: "contained",
                  color: "primary",
                  children: "Fox / White",
                },
              ],
            },
            {
              type: "column",
              style: { flexGrow: 1 },
              children: [],
            },
            {
              type: "column",
              children: [
                {
                  type: "button",
                  id: "beach",
                  variant: "contained",
                  color: "primary",
                  children: "Beach",
                },
              ],
            },
            {
              type: "column",
              children: [
                {
                  type: "button",
                  id: "forest",
                  variant: "contained",
                  color: "primary",
                  children: "Forest",
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
}

function animate(newPosition: number) {
  previousPosition = currentPosition;
  currentPosition = newPosition;
  action = "run";

  try {
    clearTimeout(idleTimeout);
    clearTimeout(lieTimeout);
    clearTimeout(randomTimeout);
  } catch {}
  render(true);

  idleTimeout = setTimeout(() => {
    action = "idle";
    render(false);

    lieTimeout = setTimeout(() => {
      action = "lie";
      render(false);

      randomTimeout = setTimeout(
        () => {
          let randomNewPosition =
            buttonIds[Math.round(Math.random() * buttonIds.length)];

          if (randomNewPosition === undefined) return;

          animate(randomNewPosition);
        },
        Math.random() * 5000 + 5000
      );
    }, 3000);
  }, calcTime() * 950);
}

/******************************************************************************/
/* Handlers */
buttonIds.forEach((id) => {
  reporting.views.onButtonClick(`${id}`, () => animate(id));
});

reporting.views.onButtonClick("dog/akita", () => {
  version = "dog/akita";
  render(false);
});

reporting.views.onButtonClick("dog/black", () => {
  version = "dog/black";
  render(false);
});

reporting.views.onButtonClick("fox/red", () => {
  version = "fox/red";
  render(false);
});

reporting.views.onButtonClick("fox/white", () => {
  version = "fox/white";
  render(false);
});

reporting.views.onButtonClick("forest", () => {
  theme = "forest";
  render(false);
});

reporting.views.onButtonClick("beach", () => {
  theme = "beach";
  render(false);
});

/******************************************************************************/
/* Startup */
animate(buttonIds[0]);
