import {BottomNavigation, BottomNavigationAction, Link, Paper} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import userContext from "../../Contexts/UserContext";
import {useNavigate} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

function NavigationMenu() {
    const navigate = useNavigate();
    const user = useContext(userContext);
    const [navigationMenuUser, setNavigationMenuUser] = useState(null);
    const [value, setValue] = useState('');

    function setUser(value) {
        setNavigationMenuUser(value);
        user.current.navigationMenuUser = value;
    }

    useEffect(() => {
        user.current = {...user.current, navigationMenuUser, setNavigationMenuUser: setUser}
    }, [])
    return (
        <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={4}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                {
                    !navigationMenuUser ?
                        [
                            <BottomNavigationAction label="دوره ها" key={1} icon={<DescriptionIcon/>} onClick={
                                () => navigate('/courses')
                            }/>
                            ,
                            <BottomNavigationAction label="آریا" key={2} icon={<HomeIcon/>} onClick={
                                () => navigate('/')
                            }/>
                        ] :
                        [
                            <BottomNavigationAction label="دوره ها" key={1} icon={<DescriptionIcon/>} onClick={
                                () => navigate('/courses')
                            }/>,
                            navigationMenuUser.teacher && (
                                <BottomNavigationAction label="ثبت دوره جدید" key={2} icon={<NoteAddIcon/>} onClick={
                                    () => navigate('/teachers/courses/create')
                                }/>)
                            ,
                            <BottomNavigationAction label="پروفایل من" key={3} icon={<PersonIcon/>} onClick={
                                () => navigate('/edit-profile')
                            }/>,
                        ]
                }
            </BottomNavigation>
        </Paper>
    );
}

export default NavigationMenu;