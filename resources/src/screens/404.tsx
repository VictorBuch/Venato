import { Head } from "../components/shared/Head";
import React from "react";
import { Link } from "react-router-dom";

function Page404() {
    return (
        <>
            <Head title="The page is not found" />
            <div className="hero min-h-screen bg-gray-800">
                <div className="hero-content text-center text-3xl font-bold">
                    <div>
                        <h1>The page is not found.</h1>
                        <div className="mt-4">
                            <Link to="/dashboard" className="link-primary">
                                Top Page
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page404;
