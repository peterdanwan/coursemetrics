// styles/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  breakpoints: {
    sm: '480px',
    md: '820px',
    lg: '1200px',
  },
});

export default theme;
