import { HelmetProvider } from "react-helmet-async";
import { Router } from "./router/Router";
import React from "react";

export default function App() {
    return (
        <HelmetProvider>
            <Router />
        </HelmetProvider>
    );
}
