import {createTheme} from "@mui/material/styles";
import {faIR} from "@mui/material/locale";

const RTLTheme = createTheme(
    {
        palette: {
            unImportant: {
                main: '#646464',
                dark: '#4b4b4b',
                light: '#8d8d8d',
                contrastText: '#eeeeee',

            },
            onPrimary: {
                main: '#fafafa',
                dark: '#e3e3e3',
                light: '#ffffff',
                contrastText: '#0058be',
            }
        },
        typography: {
            fontFamily: [
                "'Vazirmatn', sans-serif"
            ]
        },
        direction: 'rtl',

    },
    faIR
);
export default RTLTheme;