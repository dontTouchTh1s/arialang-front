import {useContext, useEffect, useState} from "react";
import Api from "../../Api/Api";
import {Navigate, useLoaderData, useNavigate, useOutletContext} from "react-router-dom";
import userContext from "../../Contexts/UserContext";
import getCookie from "../../GetCookie/GetCookie";

export async function loader() {
    const cookie = getCookie('AriaLang2');
    let currentUser = null;
    if (cookie) {
        try {
            const response = await Api.get('/user');
            currentUser = response.data.data
        } catch (e) {
            currentUser = null;
        }
    } else {
        currentUser = null;
    }
    return {currentUser};
}

function ProtectedRoute({children, isProtected = true, teacherRoute = false}) {
    const user = useContext(userContext);
    const navigate = useNavigate();
    const {currentUser} = useLoaderData();
    const setSnackbarStatus = useOutletContext()[1];
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        user.current.setNavigationMenuUser(currentUser);
        user.current.setAppBarUser(currentUser);

        if (isProtected) {
            if (currentUser) {
                if (teacherRoute) {
                    if (currentUser.teacher) {
                        setAuth(true);
                    } else {
                        setSnackbarStatus({
                            open: true,
                            message: 'برای دسترسی به این صفحه باید به عنوان مدرس ثبت نام کنید.',
                            type: 'error'
                        });
                        navigate('/s/register');
                    }
                } else {
                    setAuth(true);
                }
            } else {
                setSnackbarStatus({
                    open: true,
                    message: 'برای دسترسی به این صفحه، ابتدا وارد شوید.',
                    type: 'error'
                });
                navigate('/login');
            }
        } else {
            setAuth(true);
        }
    }, []);
    return (
        <>
            {
                auth && (children)
            }
        </>
    );
}

export default ProtectedRoute;