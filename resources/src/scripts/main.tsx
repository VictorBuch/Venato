import React from "react";
import ReactDOM from "react-dom";
import "../css/index.css";
import App from "../App";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { AuthProvider } from "../hooks/useAuth";

axios.defaults.withCredentials = true;

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
        <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </React.StrictMode>,
    document.getElementById("root")
);
