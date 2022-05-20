import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { Meal } from "../types/meals";

export default function MyMeals() {
    const [meals, setMeals] = useState<Meal[]>([]);

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await axios.get("/api/meals");
            setMeals(response.data);
        };
        fetchMeals();
    }, []);

    const removeMeal = async (id: number) => {
        await axios.delete(`/api/meals/${id}`);
        const newMeals = await axios.get("/api/meals");
        setMeals(newMeals.data);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="container">
                <section className="flex h-screen w-full flex-col items-center">
                    <h1 className="mt-10 text-4xl text-gray-200">My Meals</h1>

                    <div className="mt-10 grid grid-cols-1 gap-4 text-gray-800">
                        {meals.map((meal) => (
                            <div
                                onClick={() => removeMeal(meal.id)}
                                key={meal.id}
                                className="flex flex-col items-center rounded-sm bg-white p-4 shadow-lg"
                            >
                                <h2 className="w-full truncate text-center text-2xl ">
                                    {meal.name}
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <p>Calories: {meal.calories}</p>
                                    <p>Carbs: {meal.carbs || "Unkown"}</p>
                                    <p>Protein: {meal.protein || "Unkown"}</p>
                                    <p>Fat: {meal.fat || "Unkown"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Suspense>
    );
}
