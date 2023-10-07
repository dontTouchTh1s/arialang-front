import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import userContext from "../../Contexts/UserContext";
import {Button, Stack} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import MiniDrawer from "../Drawer/Drawer";

function MenuAppBar() {
    const navigate = useNavigate();
    const user = useContext(userContext);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [appBarUser, setAppBarUser] = useState(null);

    function setUser(value) {
        setAppBarUser(value);
        user.current.appBarUser = value;
    }

    useEffect(() => {
        user.current = {...user.current, appBarUser, setAppBarUser: setUser}
    }, [user]);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleNavigate(path) {
        navigate(path);
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        color={'onPrimary'}
                        sx={{mr: 2}}
                        onClick={() => setDrawerOpen(!drawerOpen)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <IconButton
                        color={'onPrimary'}
                        onClick={() => {
                            navigate(-1)
                        }}
                        aria-label={'back'}>
                        <ArrowForwardIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        aria language
                    </Typography>

                    <Stack spacing={{xs: 1, md: 2}} direction={'row'}>
                        {
                            appBarUser ?
                                <>
                                    <Box sx={{alignItems: 'center', display: {xs: 'none', sm: 'flex'},}}>
                                        <Typography component={'span'} variant={"body1"}>
                                            {appBarUser.fName + ' ' + appBarUser.lName}
                                        </Typography>
                                    </Box>
                                    <div>
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    display: {xs: 'flex', sm: 'none'},
                                                }}>
                                                <Typography component={'span'} variant={"body1"}>
                                                    {appBarUser.fName + ' ' + appBarUser.lName}
                                                </Typography>
                                            </Box>
                                            <MenuItem onClick={() => {
                                                handleClose()
                                                handleNavigate('/edit-profile')
                                            }}>
                                                پروفایل من
                                            </MenuItem>
                                            {
                                                !appBarUser.teacher && (
                                                    <MenuItem onClick={() => {
                                                        handleClose()
                                                        handleNavigate('/teachers/register')
                                                    }}>
                                                        ثبت نام به عنوان مدرس
                                                    </MenuItem>)
                                            }
                                            <MenuItem onClick={() => {
                                                handleClose()
                                                handleNavigate('/logout')
                                            }}>
                                                خروج
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </> :
                                <>
                                    <Link to={'/login'}>
                                        <Button
                                            sx={{height: '100%'}}
                                            color={'onPrimary'}
                                            variant={'text'}>
                                            {'ورود'}
                                        </Button>
                                    </Link>
                                    <Link to={'/register'}>
                                        <Button
                                            sx={{height: '100%'}}
                                            color={'onPrimary'}
                                            variant={'outlined'}>
                                            {'ثبت نام'}
                                        </Button>
                                    </Link>
                                </>
                        }

                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>
            {
                appBarUser &&
                <MiniDrawer
                    isTeacher={appBarUser.teacher}
                    onChange={(value) => setDrawerOpen(value)}
                    isOpen={drawerOpen}/>
            }
        </Box>
    );
}

export default MenuAppBar;