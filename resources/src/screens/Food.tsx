import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MealCard from "../components/MealCard";
import { Meal } from "../types/meals";

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Food() {
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

    return (
        <div className="container space-y-4">
            <section className="flex h-full w-full flex-col items-center ">
                <h1 className="text-xl font-bold">{mealType!.toUpperCase()}</h1>
            </section>
            <section>
                <h1>Consumed meals</h1>
                {consumedMeals.length &&
                    consumedMeals.map((consumedMeal) => (
                        <MealCard
                            key={consumedMeal.id}
                            {...consumedMeal}
                            remove
                            clicked={() => handleRemoveMeals(consumedMeal)}
                        />
                    ))}
            </section>
            <section>
                <h1>Meals</h1>
                {meals.length &&
                    meals.map((meal) => (
                        <MealCard
                            key={meal.id}
                            {...meal}
                            clicked={() => handleAddMeal(meal)}
                        />
                    ))}
            </section>
        </div>
    );
}
