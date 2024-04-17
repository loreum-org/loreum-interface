import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // 'dark' | 'light'
    useSystemColorMode: false,
  }
});

export default theme;