import { extendTheme } from "@chakra-ui/react";
import "@fontsource/cairo";

const theme = extendTheme({
  fonts: {
    heading: `'Cairo', sans-serif`,
  },
  themeConfig: {
    initialColorMode: 'dark', // 'dark' | 'light'
    useSystemColorMode: false,
  }
});

export default theme;
