import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      background: {
        main: '#FFFFFF'
      },
      primary: {
        main: '#4E598C', // Customize the primary color
      },
      secondary: {
        main: '#F9C784', // Customize the secondary color
        two: '#FCAF58', // Customize the secondary color
        three: '#FF8C42', // Customize the secondary color
      },
    },
    // Add any other customizations to your theme
  });
  
  export default theme;