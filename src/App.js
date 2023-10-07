import React, {useRef, useState} from 'react';
import RTL from "./Theme/RTL";
import {Alert, Box, CssBaseline, IconButton, Snackbar, ThemeProvider} from "@mui/material";
import RTLTheme from "./Theme/RTL-theme";
import {Outlet, useNavigate} from "react-router-dom";
import UserContext from "./Contexts/UserContext";
import NavigationMenu from "./Components/NavigationMenu/NavigationMenu";
import MenuAppBar from "./Components/Header/Appbar";

function App() {
    const [snackbarStatus, setSnackbarStatus] = useState({
        open: false,
        message: '',
        type: 'error',
    });
    const user = useRef({
        navigationMenuUser: undefined, setNavigationMenuUser: () => {
        }
    });

    function handleSnackBarClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarStatus({
            ...snackbarStatus, open: false
        });
    }

    return (
        <RTL>
            <ThemeProvider theme={RTLTheme}>
                <CssBaseline/>
                <UserContext.Provider value={user}>
                    <MenuAppBar/>
                    <Box pb={8} pt={2}>
                        <Outlet context={[snackbarStatus, setSnackbarStatus]}>
                        </Outlet>
                    </Box>
                    <NavigationMenu/>
                </UserContext.Provider>
                <Snackbar
                    open={snackbarStatus.open}
                    autoHideDuration={6000}
                    onClose={handleSnackBarClose}>
                    <Alert severity={snackbarStatus.type} sx={{width: '100%'}}>
                        {snackbarStatus.message}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </RTL>
    );
}

export default App;
