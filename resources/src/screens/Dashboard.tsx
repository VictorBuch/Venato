import React from "react";
import { Head } from "../components/shared/Head";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="container">
                <div className="w-full h-screen flex flex-col items-center">
                    <section id="CaloriesSection" className="flex">
                        <h2>Calories eaten</h2>
                        <h1>Calories Left</h1>
                        <h2>Burned</h2>
                    </section>
                </div>
            </div>
        </>
    );
}
