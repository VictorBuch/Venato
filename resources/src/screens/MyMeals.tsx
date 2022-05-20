import axios from "axios";
import React, { useEffect, useState } from "react";

export default function MyMeals() {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await axios.get("/api/meals");
            setMeals(response.data);
        };
        fetchMeals();
    }, []);

    return (
        <div className="container">
            <section className="h-screen w-full flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-xl text-gray-200">My Meals</h1>
                    <ul className="flex flex-col items-center">
                        {meals.map((meal) => (
                            <li key={meal.id}>
                                <div className="flex flex-col items-center">
                                    <h2 className="text-xl text-gray-200">
                                        {meal.name}
                                    </h2>
                                    <p className="text-gray-200">
                                        {meal.portion}
                                    </p>
                                    <p className="text-gray-200">
                                        {meal.calories}
                                    </p>
                                    <p className="text-gray-200">
                                        {meal.carbs}
                                    </p>
                                    <p className="text-gray-200">
                                        {meal.protein}
                                    </p>
                                    <p className="text-gray-200">{meal.fat}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
