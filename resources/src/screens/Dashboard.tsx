import React, { MouseEventHandler, useEffect, useState } from "react";
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
import axios from "axios";

type MealCardProps = {
    title: string;
    foodItems: string[];
    calories: number;
    reccomendedCalories: number;
    icon: React.ReactElement;
    addFoodItem: MouseEventHandler;
};

function MealCard({
    title,
    foodItems,
    calories,
    reccomendedCalories,
    icon,
    addFoodItem,
}: MealCardProps) {
    //    loop through foodItems and add a , after each item except the last one
    const foodItemsList = foodItems.map((item, index) => {
        if (index === foodItems.length - 1) {
            return item;
        } else {
            return `${item}, `;
        }
    });

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
                        {foodItems.length
                            ? foodItemsList
                            : `reccomended amount: ${reccomendedCalories} kcal`}
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
                color="inherit"
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
                    color: "rgba(59,109,114,1)",
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
    const [calories, setCalories] = useState({
        eaten: 0,
        burned: 0,
        goal: 2200,
        left: 0,
    });

    const [caloriesPercent, setCaloriesPercent] = useState(
        (calories.eaten / calories.goal) * 100
    );

    const [carbs, setCarbs] = useState({
        eaten: 0,
        burned: 0,
        goal: 100,
        left: 0,
    });
    const [carbsPercent, setCarbsPercent] = useState(
        (carbs.eaten / carbs.goal) * 100
    );

    const [fat, setFat] = useState({
        eaten: 0,
        burned: 0,
        goal: 90,
        left: 0,
    });
    const [fatPercent, setFatPercent] = useState((fat.eaten / fat.goal) * 100);

    const [protein, setProtein] = useState({
        eaten: 0,
        burned: 0,
        goal: 160,
        left: 0,
    });
    const [proteinPercent, setProteinPercent] = useState(
        (protein.eaten / protein.goal) * 100
    );

    const [consumedMeals, setConsumedMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
    });

    const navigate = useNavigate();

    useEffect(() => {
        // TODO: make this a hook
        const fetchData = async () => {
            const promises = [
                axios.get("/api/consumed_meals/breakfast"),
                axios.get("/api/consumed_meals/lunch"),
                axios.get("/api/consumed_meals/dinner"),
                axios.get("/api/consumed_meals/snacks"),
            ];
            const [breakfast, lunch, dinner, snacks] = await Promise.all(
                promises
            );

            setConsumedMeals({
                breakfast: breakfast.data,
                lunch: lunch.data,
                dinner: dinner.data,
                snacks: snacks.data,
            });
        };
        fetchData();

        setCalories({ ...calories, left: calories.goal - calories.eaten });
        setCarbs({ ...carbs, left: carbs.goal - carbs.eaten });
        setFat({ ...fat, left: fat.goal - fat.eaten });
        setProtein({ ...protein, left: protein.goal - protein.eaten });
    }, []);

    useEffect(() => {
        const combinedMeals = consumedMeals.breakfast.concat(
            consumedMeals.lunch,
            consumedMeals.dinner,
            consumedMeals.snacks
        );
        const totalCalories = combinedMeals.reduce(
            (acc, meal) => acc + meal.calories,
            0
        );
        const totalCarbs = combinedMeals.reduce(
            (acc, meal) => acc + meal.carbs,
            0
        );
        const totalFat = combinedMeals.reduce((acc, meal) => acc + meal.fat, 0);
        const totalProtein = combinedMeals.reduce(
            (acc, meal) => acc + meal.protein,
            0
        );

        setCalories({
            ...calories,
            eaten: totalCalories,
            left: calories.goal - totalCalories,
        });
        setCarbs({
            ...carbs,
            eaten: totalCarbs,
            left: carbs.goal - totalCarbs,
        });
        setFat({
            ...fat,
            eaten: totalFat,
            left: fat.goal - totalFat,
        });
        setProtein({
            ...protein,
            eaten: totalProtein,
            left: protein.goal - totalProtein,
        });
        setFatPercent((totalFat / fat.goal) * 100);
        setCarbsPercent((totalCarbs / carbs.goal) * 100);
        setProteinPercent((totalProtein / protein.goal) * 100);
        setCaloriesPercent((totalCalories / calories.goal) * 100);
    }, [consumedMeals]);
    console.log("render");

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
                            <h1>{calories.eaten}</h1>
                            <h2>EATEN</h2>
                        </div>
                        <div className="flex w-2/4 items-center justify-center">
                            <CircularProgressWithLabel
                                percent={caloriesPercent}
                                left={calories.left}
                                eaten={calories.eaten}
                                goal={calories.goal}
                                size={150}
                                thickness={2}
                                className="text-accent"
                            />
                        </div>
                        <div className=" flex w-1/4 flex-col items-center justify-center">
                            <h1>{calories.burned}</h1>
                            <h2>BURNED</h2>
                        </div>
                    </section>
                    <section className="mt-6 flex w-full justify-between text-lg text-gray-200">
                        <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                            <h3>Carbs</h3>
                            <LinearProgress
                                color="inherit"
                                className="w-full text-accent"
                                value={carbsPercent}
                                variant="determinate"
                                sx={{ zIndex: 0, borderRadius: "4px" }}
                            />

                            <p className="text-sm">
                                {carbs.eaten} / {carbs.goal}g
                            </p>
                        </div>
                        <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                            <h3>Potein</h3>
                            <LinearProgress
                                color="inherit"
                                className="w-full text-accent"
                                value={proteinPercent}
                                variant="determinate"
                                sx={{ zIndex: 0, borderRadius: "4px" }}
                            />
                            <p className="text-sm">
                                {protein.eaten} / {protein.goal}g
                            </p>
                        </div>
                        <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                            <h3>Fat</h3>
                            <LinearProgress
                                color="inherit"
                                className="w-full text-accent"
                                value={fatPercent}
                                variant="determinate"
                                sx={{ zIndex: 0, borderRadius: "4px" }}
                            />
                            <p className="text-sm">
                                {fat.eaten} / {fat.goal}g
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
                            foodItems={consumedMeals.breakfast.map(
                                (food) => food.name
                            )}
                            calories={consumedMeals.breakfast.reduce(
                                (acc, food) => acc + food.calories,
                                0
                            )}
                            reccomendedCalories={400}
                            icon={<BakeryDiningRoundedIcon />}
                            addFoodItem={() =>
                                navigate("/add-food?meal=breakfast")
                            }
                        />
                        <MealCard
                            title="Lunch"
                            foodItems={consumedMeals.lunch.map(
                                (food) => food.name
                            )}
                            calories={consumedMeals.lunch.reduce(
                                (acc, food) => acc + food.calories,
                                0
                            )}
                            reccomendedCalories={700}
                            icon={<RamenDiningRoundedIcon />}
                            addFoodItem={() => navigate("/add-food?meal=lunch")}
                        />
                        <MealCard
                            title="Dinner"
                            foodItems={consumedMeals.dinner.map(
                                (food) => food.name
                            )}
                            calories={consumedMeals.dinner.reduce(
                                (acc, food) => acc + food.calories,
                                0
                            )}
                            reccomendedCalories={900}
                            icon={<DinnerDiningRoundedIcon />}
                            addFoodItem={() =>
                                navigate("/add-food?meal=dinner")
                            }
                        />
                        <MealCard
                            title="Snack"
                            foodItems={consumedMeals.snacks.map(
                                (food) => food.name
                            )}
                            calories={consumedMeals.snacks.reduce(
                                (acc, food) => acc + food.calories,
                                0
                            )}
                            reccomendedCalories={300}
                            icon={<FastfoodRoundedIcon />}
                            addFoodItem={() => navigate("/add-food?meal=snack")}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
