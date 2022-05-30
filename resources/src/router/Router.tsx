import React, { lazy, Suspense } from "react";
import { RouteObject, useRoutes, BrowserRouter } from "react-router-dom";

const Loading = () => (
    <p className="h-full w-full p-4 text-center">Loading...</p>
);

const IndexScreen = lazy(() => import("../screens/Index"));
const Page404Screen = lazy(() => import("../screens/404"));
const Dashboard = lazy(() => import("../screens/Dashboard"));
const AddMeal = lazy(() => import("../screens/AddMeal"));
const MyMeals = lazy(() => import("../screens/MyMeals"));
const Food = lazy(() => import("../screens/Food"));

// Authorization routes
const SignupScreen = lazy(() => import("../screens/Signup"));

export const Router = () => {
    return (
        <BrowserRouter>
            <InnerRouter />
        </BrowserRouter>
    );
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
                    path: "/dashboard",
                    element: <Dashboard />,
                },
                {
                    path: "/food",
                    element: <Food />,
                },
                {
                    path: "/add-meal",
                    element: <AddMeal />,
                },
                {
                    path: "/my-meals",
                    element: <MyMeals />,
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
