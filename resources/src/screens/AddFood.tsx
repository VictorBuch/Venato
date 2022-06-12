import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MealCard from "../components/MealCard";
import { useQuery } from "../hooks/useQuery";
import { Meal } from "../types/meals";

export default function AddFood() {
    const navigate = useNavigate();
    const query = useQuery();
    const mealType = query.get("meal");

    const [consumedMeals, setConsumedMeals] = useState([]);
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const consumedMealsDB = await axios.get(
                `/api/consumed_meals/${mealType}`
            );
            const mealsDB = await axios.get(`/api/meals`);
            setConsumedMeals(consumedMealsDB.data);
            setMeals(mealsDB.data);
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
            <section className="flex h-full w-full flex-col items-center ">
                <h1 className="text-xl font-bold">{mealType!.toUpperCase()}</h1>
            </section>
            <section>
                <h1>Consumed meals</h1>
                <div className="space-y-4">
                    {consumedMeals.length &&
                        consumedMeals.map((consumedMeal) => (
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
            <section>
                <h1>Meals</h1>
                <div className="space-y-4">
                    {meals.length &&
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
