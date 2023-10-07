import Api from "./Api";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import userContext from "../Contexts/UserContext";

function Logout() {
    const navigate = useNavigate()
    const user = useContext(userContext)

    async function logout() {
        await Api.get('/logout');
        user.current.setNavigationMenuUser(null);
        navigate('/login');
    }

    useEffect(() => {
        logout();
    });

}

export default Logout;