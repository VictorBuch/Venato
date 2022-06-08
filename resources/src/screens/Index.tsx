import axios from "axios";
import React, { MouseEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Head } from "../components/shared/Head";

function Index() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e: MouseEvent) => {
        e.preventDefault();

        const cookie = await axios.get("/sanctum/csrf-cookie");
        if (cookie.status === 204) {
            const response = await axios.post(
                "http://fitness-journey.test/api/auth/login",
                {
                    email,
                    password,
                }
            );

            if (response.status === 200) {
                navigate("/dashboard");
            } else {
                toast.error("Invalid credentials");
            }
        } else {
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="mx-auto h-screen w-3/4 ">
                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                        <div>
                            <img
                                className="mx-auto h-12 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                                alt="Workflow"
                            />
                            <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-100">
                                Sign in to your account
                            </h2>
                        </div>
                        <form className="mt-8 space-y-6">
                            <input
                                type="hidden"
                                name="remember"
                                defaultValue="true"
                            />
                            <div className="-space-y-px rounded-md shadow-md">
                                <div>
                                    <label
                                        htmlFor="email-address"
                                        className="sr-only"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        autoComplete="email"
                                        required
                                        className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Email address"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="sr-only"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="current-password"
                                        required
                                        className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-indigo-200 hover:text-indigo-300"
                                >
                                    Forgot your password?
                                </a>
                            </div>

                            <button
                                onClick={handleLogin}
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800"
                            >
                                Sign in
                            </button>
                            <Link
                                to="/signup"
                                className=" flex items-start justify-center text-center text-sm text-accent"
                            >
                                Sign up
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
