import {useContext, useEffect, useState} from "react";
import userContext from "../../Contexts/UserContext";
import {useNavigate} from "react-router-dom";
import getCookie from "../../GetCookie/GetCookie";
import Api from "../../Api/Api";

function AlreadyLogin({children}) {
    const [checked, setChecked] = useState(false);
    const user = useContext(userContext);
    const navigate = useNavigate();

    async function fetchUser() {
        const cookie = getCookie('AriaLang2');
        if (cookie) {
            try {
                const response = await Api.get('/user');
                if (response.status === 200) {
                    if (response.data.status === 200) {
                        navigate('/courses');
                        user.current.setNavigationMenuUser(response.data.data);
                        user.current.setAppBarUser(response.data.data);
                    }
                }
            } catch (e) {
                user.current.setNavigationMenuUser(null);
                user.current.setAppBarUser(null);

                setChecked(true);
            }
        } else {
            user.current.setNavigationMenuUser(null);
            user.current.setAppBarUser(null);
            setChecked(true);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            {
                checked ? children : ''
            }
        </>
    )
}

export default AlreadyLogin;