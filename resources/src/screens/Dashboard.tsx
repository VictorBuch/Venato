import React, { useState } from "react";
import { Head } from "../components/shared/Head";
import CircularProgress, {
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number } & {
        left: number;
    } & {
        size: number;
    } & { thickness: number }
) {
    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-flex",
            }}
        >
            <CircularProgress variant="determinate" {...props} />
            <CircularProgress
                variant="determinate"
                color="inherit"
                size={props.size}
                thickness={props.thickness}
                value={100}
                sx={{
                    color: "rgba(255,255,255,0.1)",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: -1,
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="flex flex-col items-center  text-gray-100">
                    <h1 className="text-3xl">{props.left}</h1>
                    <h2 className="text-lg">LEFT</h2>
                </div>
            </Box>
        </Box>
    );
}

export default function Dashboard() {
    const [caloriesEaten, setCaloriesEaten] = useState(500);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [caloriesGoal, setCaloriesGoal] = useState(2200);
    const [caloriesLeft, setCaloriesLeft] = useState(
        caloriesGoal - caloriesEaten
    );

    const [percent, setPercent] = useState(
        (caloriesEaten / caloriesGoal) * 100
    );

    // TODO: Update this to use personal data from database

    return (
        <>
            <Head title="Dashboard" />
            <div className="container">
                <div className="flex h-screen w-full flex-col items-center">
                    <section
                        id="CaloriesSection"
                        className="item-center mt-16 flex h-44 w-full justify-between text-lg text-gray-200"
                    >
                        <div className=" flex w-1/4 flex-col items-center justify-center">
                            <h1>{caloriesEaten}</h1>
                            <h2>EATEN</h2>
                        </div>
                        <div className="flex w-2/4 items-center justify-center">
                            <CircularProgressWithLabel
                                value={percent}
                                left={caloriesLeft}
                                size={150}
                                thickness={2}
                            />
                        </div>
                        <div className=" flex w-1/4 flex-col items-center justify-center">
                            <h1>{caloriesBurned}</h1>
                            <h2>BURNED</h2>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
