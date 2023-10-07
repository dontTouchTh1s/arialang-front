import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Courses, {loader as allCoursesLoader} from "./Pages/Courses/ShowAllCourses";
import ErrorPage from "./ErrorPage";
import CreateCourse from "./Pages/CreateCourse/CreateCourse";
import Home, {loader as homeLoader} from "./Pages/Home/Home";
import CreateTeacher from "./Pages/CreateTeacher/CreateTeahcer";
import EditProfile from "./Pages/EditProfile/EditProfile";
import ProtectedRoute, {loader as protectedRouteLoader} from "./Components/ProtectedRoute/ProtectedRoute";
import Logout from "./Api/Logout";
import AlreadyLogin from "./Components/AlreadyLogin/AlreadyLogin";
import TakeCourse, {loader as courseLoader} from "./Pages/TakeCourse/TakeCourse";
import RegisteredCourses, {loader as registeredCoursesLoader} from "./Pages/RegisteredCourses/RegisteredCourses";
import ShowTeachers, {loader as showTeacherLoader} from "./Pages/ShowTeachers/ShowTeachers";
import CurrentTeacherCourses, {
    loader as currentTeacherCoursesLoader
} from "./Pages/TeacherCourses/CurrentTeacherCourses";


const browserRouter = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                errorElement: <ErrorPage/>,
                children: [
                    {
                        path: '/login',
                        element: <AlreadyLogin><Login/></AlreadyLogin>
                    },
                    {
                        path: '/register',
                        element: <AlreadyLogin><Register/></AlreadyLogin>
                    },
                    {
                        path: '/logout',
                        element: <Logout/>
                    },
                    {
                        path: '/courses',
                        element: <ProtectedRoute isProtected={false}><Courses/></ProtectedRoute>,
                        loader: async ({request}) => {
                            const protectedResult = await protectedRouteLoader();
                            const courseResult = await allCoursesLoader({request})
                            return {...protectedResult, ...courseResult};
                        }
                    },
                    {
                        path: '/courses/:id',
                        element: <ProtectedRoute isProtected={false}><TakeCourse/></ProtectedRoute>,
                        loader: async ({params}) => {
                            const protectedResult = await protectedRouteLoader();
                            const courseResult = await courseLoader({params})
                            return {...protectedResult, ...courseResult};
                        }
                    },
                    {
                        path: '/teachers/courses/create',
                        element: <ProtectedRoute teacherRoute={true}><CreateCourse/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers/register',
                        element: <ProtectedRoute><CreateTeacher/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/teachers',
                        element: <ProtectedRoute><ShowTeachers/></ProtectedRoute>,
                        loader: async () => {
                            const protectedResult = await protectedRouteLoader();
                            const showTeacherResult = await showTeacherLoader()
                            return {...protectedResult, ...showTeacherResult};
                        }
                    },
                    {
                        path: '/teachers/courses',
                        element: <ProtectedRoute><CurrentTeacherCourses/></ProtectedRoute>,
                        loader: async () => {
                            const protectedResult = await protectedRouteLoader();
                            const createdCoursesResult = await currentTeacherCoursesLoader()
                            return {...protectedResult, ...createdCoursesResult};
                        }
                    },
                    {
                        path: '/edit-profile',
                        element: <ProtectedRoute><EditProfile/></ProtectedRoute>,
                        loader: protectedRouteLoader
                    },
                    {
                        path: '/user/courses',
                        element: <ProtectedRoute><RegisteredCourses/></ProtectedRoute>,
                        loader: async () => {
                            const protectedResult = await protectedRouteLoader();
                            const registeredCoursesResult = await registeredCoursesLoader()
                            return {...protectedResult, ...registeredCoursesResult};
                        }
                    },
                    {
                        path: '/',
                        element: <ProtectedRoute isProtected={false}><Home/></ProtectedRoute>,
                        loader: async () => {
                            const protectedResult = await protectedRouteLoader();
                            const homeResult = await homeLoader()
                            return {...protectedResult, ...homeResult};
                        }
                    }
                ]
            }
        ]
    }]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={browserRouter}/>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
