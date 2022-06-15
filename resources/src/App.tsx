import { HelmetProvider } from "react-helmet-async";
import { Router } from "./router/Router";
import React, { useMemo } from "react";
import { UserContext } from "./contexts/UserContext";
import { AuthProvider } from "./hooks/useAuth";

export default function App() {
    const [user, setUser] = React.useState<any>({});
    const providerUser = useMemo(() => ({ user, setUser }), [user, setUser]);
    return (
        <HelmetProvider>
            <UserContext.Provider value={providerUser}>
                <AuthProvider>
                    <Router />
                </AuthProvider>
            </UserContext.Provider>
        </HelmetProvider>
    );
}
