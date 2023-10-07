import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText, styled,
    useTheme
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import userContext from "../../Contexts/UserContext";
import SchoolIcon from "@mui/icons-material/School";
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default function MiniDrawer({isOpen, onChange, isTeacher}) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    const handleDrawerClose = () => {
        onChange(false);
    };

    return (
        <Box sx={{display: 'flex',}}>
            <Drawer
                onClose={handleDrawerClose}
                open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>

                <Divider/>
                <List sx={{
                    width: drawerWidth
                }}>
                    <ListItem disablePadding sx={{display: 'block'}}>
                        <Link
                            onClick={handleDrawerClose}
                            to={'/user/courses'}
                            style={{
                                textDecoration: 'none ',
                                color: "inherit"
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'inherit',
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AutoStoriesIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'دروس ثبت نام شده'} sx={{
                                    opacity: open ? 1 : 0,
                                    color: 'inherit'
                                }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    {
                        isTeacher &&
                        <ListItem disablePadding sx={{display: 'block'}}>
                            <Link
                                onClick={handleDrawerClose}
                                to={'/teachers/courses'}
                                style={{
                                    textDecoration: 'none ',
                                    color: "inherit"
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: 'inherit',
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}>
                                        <CastForEducationIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={'دروس درحال تدریس'} sx={{
                                        opacity: open ? 1 : 0,
                                        color: 'inherit'
                                    }}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    }
                    <ListItem disablePadding sx={{display: 'block'}}>
                        <Link
                            onClick={handleDrawerClose}
                            to={'/teachers'}
                            style={{
                                textDecoration: 'none ',
                                color: "inherit"
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: 'inherit',
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}>
                                    <SchoolIcon/>
                                </ListItemIcon>

                                <ListItemText primary={'مدرس ها'} sx={{
                                    opacity: open ? 1 : 0,
                                    color: 'inherit'
                                }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>

                </List>
                <Divider/>
            </Drawer>
        </Box>
    );
}