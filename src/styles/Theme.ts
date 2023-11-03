import type { StyleFunctionProps } from "@chakra-ui/react";
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import { accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

// Get rid of accordion border so that it look better in the sidebar
const baseStyle = definePartsStyle({
  container: {
    borderStyle: "none",
  },
});

const accordionTheme = defineMultiStyleConfig({ baseStyle });

//NOTE: Create palettes here: https://hihayk.github.io/scale/#4/6/50/80/-51/67/20/14/1D9A6C/29/154/108/white

const palette = {
  100: "#88FFD5", //outline for tables and dividers in light mode
  200: "#66FFE7", //Button bg and icon color in dark mode
  300: "#44FFFF",
  400: "#22D8FF",
  500: "#00A0FF", //button bg in light mode, some headings
  600: "#005CDF", // Icons, buttons and menu text in light mode, only icons in dark mode
  700: "#0023BF", // Outline for tables and dividers dark mode
  800: "#00009F",
  900: "#170080",
};

export const theme = extendTheme(
  {
    config: {
      initialColorMode: "dark",
      useSystemColorMode: true,
    },
    colors: {
      brand: palette,
      hyperlink: "#007cc1",
    },
    components: {
      Accordion: accordionTheme,

      Button: {
        variants: {},
        defaultProps: {},
      },
    },

    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          fontFamily: "body",

          bg: mode("white", "gray.800")(props),
          lineHeight: "base",
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" }),
);
