import React from "react";
import ReactDOM from "react-dom";
import "../css/index.css";
import App from "../App";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.render(
    <React.StrictMode>
        <App />
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
