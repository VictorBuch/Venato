import React, { MouseEventHandler, useState } from "react";
import { Head } from "../components/shared/Head";
import CircularProgress, {
    CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// SVG ICONS
import BakeryDiningRoundedIcon from "@mui/icons-material/BakeryDiningRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import RamenDiningRoundedIcon from "@mui/icons-material/RamenDiningRounded";
import DinnerDiningRoundedIcon from "@mui/icons-material/DinnerDiningRounded";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import { useNavigate } from "react-router-dom";

type MealCardProps = {
    title: string;
    foodItems: string[];
    calories: number;
    icon: React.ReactElement;
    addFoodItem: MouseEventHandler;
};

function MealCard({
    title,
    foodItems,
    calories,
    icon,
    addFoodItem,
}: MealCardProps) {
    return (
        <div
            className="flex h-28 flex-col rounded-md border border-gray-400 bg-base-content shadow-lg"
            onClick={addFoodItem}
        >
            <div className="flex h-full items-center py-3 px-4">
                <figure>{icon}</figure>
                <main className="ml-6 flex w-60 flex-col items-start justify-center">
                    <h1 className="w-full text-base font-semibold">{title}</h1>
                    <p className="w-full truncate text-sm">
                        {foodItems || "reccomended amount: 800 kcal"}
                    </p>
                </main>
                <AddCircleRoundedIcon className="ml-auto " />
            </div>
            <hr className="border border-gray-200" />
            <p className="flex h-max items-end justify-center  py-2 text-center text-sm">
                {calories} kcal
            </p>
        </div>
    );
}

function CircularProgressWithLabel(
    props: CircularProgressProps & { percent: number } & {
        left: number;
    } & {
        size: number;
    } & { thickness: number } & { eaten: number } & { goal: number }
) {
    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-flex",
            }}
        >
            <CircularProgress
                variant="determinate"
                sx={{ zIndex: 0 }}
                value={props.percent}
                {...props}
            />
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
                    zIndex: -10,
                }}
            />
            <CircularProgress
                variant="determinate"
                size={props.size}
                thickness={props.thickness}
                color="warning"
                value={
                    props.eaten - props.goal > 0
                        ? ((props.eaten - props.goal) / props.goal) * 100
                        : 0
                }
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
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
                    <h1 className="text-3xl">{Math.abs(props.left)}</h1>
                    <h2 className="text-lg">
                        {props.percent > 100 ? "OVER" : "LEFT"}
                    </h2>
                </div>
            </Box>
        </Box>
    );
}

export default function Dashboard() {
    const [caloriesEaten, setCaloriesEaten] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [caloriesGoal, setCaloriesGoal] = useState(2200);
    const [caloriesLeft, setCaloriesLeft] = useState(
        caloriesGoal - caloriesEaten
    );
    const [caloriesPercent, setCaloriesPercent] = useState(
        (caloriesEaten / caloriesGoal) * 100
    );

    const [carbsEaten, setCarbsEaten] = useState(5);
    const [carbsGoal, setCarbsGoal] = useState(100);
    const [carbsPercent, setCarbsPercent] = useState(
        (carbsEaten / carbsGoal) * 100
    );

    const [fatEaten, setFatEaten] = useState(2);
    const [fatGoal, setFatGoal] = useState(100);
    const [fatPercent, setFatPercent] = useState((fatEaten / fatGoal) * 100);

    const [proteinEaten, setProteinEaten] = useState(60);
    const [proteinGoal, setProteinGoal] = useState(100);
    const [proteinPercent, setProteinPercent] = useState(
        (proteinEaten / proteinGoal) * 100
    );

    // TODO: Update this to use personal data from databas

    const navigate = useNavigate();

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-screen w-full flex-col items-center">
                <div className="container py-16">
                    <section
                        id="CaloriesSection"
                        className="item-center  flex w-full justify-between text-lg text-gray-200"
                    >
                        <div className=" flex w-1/4 flex-col items-center justify-center">
                            <h1>{caloriesEaten}</h1>
                            <h2>EATEN</h2>
                        </div>
                        <div className="flex w-2/4 items-center justify-center">
                            <CircularProgressWithLabel
                                percent={caloriesPercent}
                                left={caloriesLeft}
                                eaten={caloriesEaten}
                                goal={caloriesGoal}
                                size={150}
                                thickness={2}
                            />
                        </div>
                        <div className=" flex w-1/4 flex-col items-center justify-center">
                            <h1>{caloriesBurned}</h1>
                            <h2>BURNED</h2>
                        </div>
                    </section>
                    <section className="mt-6 flex w-full justify-between text-lg text-gray-200">
                        <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                            <h3>Carbs</h3>
                            <LinearProgress
                                className="w-full"
                                value={carbsPercent}
                                variant="determinate"
                            />
                            <p className="text-sm">
                                {carbsEaten} / {carbsGoal}g
                            </p>
                        </div>
                        <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                            <h3>Potein</h3>
                            <LinearProgress
                                className="w-full"
                                value={proteinPercent}
                                variant="determinate"
                            />
                            <p className="text-sm">
                                {proteinEaten} / {proteinGoal}g
                            </p>
                        </div>
                        <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                            <h3>Fat</h3>
                            <LinearProgress
                                className="w-full"
                                value={fatPercent}
                                variant="determinate"
                            />
                            <p className="text-sm">
                                {fatEaten} / {fatGoal}g
                            </p>
                        </div>
                    </section>
                </div>
                <section
                    id="Food"
                    className="item-center mt-8 flex w-full flex-col justify-center bg-base-100 text-lg text-base-200"
                >
                    <div className="container space-y-6">
                        <MealCard
                            title="Breakfast"
                            foodItems={["eggs, bacon, toast, coffee"]}
                            calories={300}
                            icon={<BakeryDiningRoundedIcon />}
                            addFoodItem={() => navigate("/food?meal=breakfast")}
                        />
                        <MealCard
                            title="Lunch"
                            foodItems={["salad, chicken, rice"]}
                            calories={700}
                            icon={<RamenDiningRoundedIcon />}
                            addFoodItem={() => navigate("/food?meal=lunch")}
                        />
                        <MealCard
                            title="Dinner"
                            foodItems={["steak, pasta, rice"]}
                            calories={1000}
                            icon={<DinnerDiningRoundedIcon />}
                            addFoodItem={() => navigate("/food?meal=dinner")}
                        />
                        <MealCard
                            title="Snack"
                            foodItems={["chips, chocolate"]}
                            calories={300}
                            icon={<FastfoodRoundedIcon />}
                            addFoodItem={() => navigate("/food?meal=snack")}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
