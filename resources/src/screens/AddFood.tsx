import { LinearProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import MealCard from "../components/MealCard";
import { useQuery } from "../hooks/useQuery";
import { Meal } from "../types/meals";

export default function AddFood() {
    const navigate = useNavigate();
    const query = useQuery();
    const mealType = query.get("meal");

    const [consumedMeals, setConsumedMeals] = useState([]);
    const [meals, setMeals] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const consumedMealsDB = await axios.get(
                `/api/consumed_meals/${mealType}`
            );
            const mealsDB = await axios.get(`/api/meals`);
            const userDB = await axios.get(`/api/user`);
            setConsumedMeals(consumedMealsDB.data);
            setMeals(mealsDB.data);
            setUser(userDB.data);
        };
        fetchData();
    }, []);

    const refetchData = async () => {
        const consumedMealsDB = await axios.get(
            `/api/consumed_meals/${mealType}`
        );
        const mealsDB = await axios.get(`/api/meals`);
        setConsumedMeals(consumedMealsDB.data);
        setMeals(mealsDB.data);
    };

    const handleAddMeal = async (meal: Meal) => {
        const response = await axios.post(`/api/consumed_meals`, {
            meal_id: meal.id,
            meal_type: mealType,
            portion: meal.portion,
            portion_unit: meal.portion_unit,
        });
        if (response.status === 200) {
            refetchData();
        }
    };

    const handleRemoveMeals = async (meal: Meal) => {
        const response = await axios.delete(`/api/consumed_meals/${meal.id}`);
        if (response.status === 200) {
            refetchData();
        }
    };

    const handleCustomizePortion = async (meal: Meal) => {
        navigate(`/food/${meal.id}?meal=${mealType}`);
    };

    return (
        <div className="container space-y-4">
            <section className="my-8 flex h-full w-full  items-center space-x-2">
                <Link to="/dashboard">
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                </Link>
                <h1 className="text-xl font-bold">{mealType!.toUpperCase()}</h1>
            </section>
            <section className="my-8 flex w-full flex-col items-center space-y-4 rounded border border-base-content p-4 text-neutral-content shadow-lg">
                <div className="flex w-full flex-col items-center justify-center space-y-2">
                    <div className="flex w-full items-center justify-between">
                        <h1 className="text-sm">Dalily intake</h1>
                        <h3 className="text-sm"> 800/2200 kcal</h3>
                    </div>
                    <LinearProgress
                        color="inherit"
                        className="w-full text-accent"
                        value={3}
                        variant="determinate"
                        sx={{ zIndex: 0, borderRadius: "4px" }}
                    />

                    {/* <p className="text-sm">
                        {carbs.eaten} / {carbs.goal}g
                    </p> */}
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                        <h3 className="text-sm">Carbs</h3>
                        <LinearProgress
                            color="inherit"
                            className="w-full text-accent"
                            value={3}
                            variant="determinate"
                            sx={{ zIndex: 0, borderRadius: "4px" }}
                        />

                        {/* <p className="text-sm">
                        {carbs.eaten} / {carbs.goal}g
                    </p> */}
                    </div>
                    <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                        <h3 className="text-sm">Protein</h3>
                        <LinearProgress
                            color="inherit"
                            className="w-full text-accent"
                            value={3}
                            variant="determinate"
                            sx={{ zIndex: 0, borderRadius: "4px" }}
                        />

                        {/* <p className="text-sm">
                        {carbs.eaten} / {carbs.goal}g
                    </p> */}
                    </div>
                    <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                        <h3 className="text-sm">fat</h3>
                        <LinearProgress
                            color="inherit"
                            className="w-full text-accent"
                            value={3}
                            variant="determinate"
                            sx={{ zIndex: 0, borderRadius: "4px" }}
                        />

                        {/* <p className="text-sm">
                        {carbs.eaten} / {carbs.goal}g
                    </p> */}
                    </div>
                </div>
            </section>
            {consumedMeals.length > 0 && (
                <section className="my-8">
                    <h1>Consumed meals</h1>
                    <div className="space-y-4">
                        {consumedMeals.map((consumedMeal) => (
                            <MealCard
                                key={consumedMeal.id}
                                {...consumedMeal}
                                remove
                                addRemovePortion={() =>
                                    handleRemoveMeals(consumedMeal)
                                }
                            />
                        ))}
                    </div>
                </section>
            )}
            <section className="my-8">
                <h1>Meals</h1>
                <div className="space-y-4">
                    {meals.length > 0 &&
                        meals.map((meal) => (
                            <MealCard
                                key={meal.id}
                                {...meal}
                                customizePortion={() =>
                                    handleCustomizePortion(meal)
                                }
                                addRemovePortion={() => handleAddMeal(meal)}
                            />
                        ))}
                </div>
            </section>
        </div>
    );
}
