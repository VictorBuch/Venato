import React, { lazy, Suspense } from "react";
import {
    RouteObject,
    useRoutes,
    BrowserRouter,
    Navigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Loading = () => (
    <p className="h-full w-full p-4 text-center">Loading...</p>
);

const IndexScreen = lazy(() => import("../screens/Index"));
const Page404Screen = lazy(() => import("../screens/404"));
const Dashboard = lazy(() => import("../screens/Dashboard"));
const AddMeal = lazy(() => import("../screens/AddMeal"));
const MyMeals = lazy(() => import("../screens/MyMeals"));
const AddFood = lazy(() => import("../screens/AddFood"));
const Food = lazy(() => import("../screens/Food"));
const GetUserInformation = lazy(() => import("../screens/GetUserInformation"));

// Authorization routes
const SignupScreen = lazy(() => import("../screens/Signup"));

export const Router = () => {
    return (
        <BrowserRouter>
            <InnerRouter />
        </BrowserRouter>
    );
};

const ProtectedRoute = ({ children, navigateTo = "/" }) => {
    const { authed, loading } = useAuth();
    if (loading) {
        return <Loading />;
    } else {
        return authed ? children : <Navigate to={navigateTo} />;
    }
};

const InnerRouter = () => {
    const routes: RouteObject[] = [
        {
            path: "/",
            children: [
                {
                    index: true,
                    element: <IndexScreen />,
                },
                {
                    path: "/signup",
                    element: <SignupScreen />,
                },
                {
                    path: "/user-information",
                    element: (
                        <ProtectedRoute>
                            <GetUserInformation />{" "}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/dashboard",
                    element: (
                        <ProtectedRoute>
                            {" "}
                            <Dashboard />{" "}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/add-food",
                    element: (
                        <ProtectedRoute>
                            {" "}
                            <AddFood />{" "}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/food/:id",
                    element: (
                        <ProtectedRoute>
                            {" "}
                            <Food />{" "}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/add-meal",
                    element: (
                        <ProtectedRoute>
                            {" "}
                            <AddMeal />{" "}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/my-meals",
                    element: (
                        <ProtectedRoute>
                            {" "}
                            <MyMeals />{" "}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "*",
                    element: <Page404Screen />,
                },
            ],
        },
    ];
    const element = useRoutes(routes);
    return (
        <div>
            <Suspense fallback={<Loading />}>{element}</Suspense>
        </div>
    );
};
