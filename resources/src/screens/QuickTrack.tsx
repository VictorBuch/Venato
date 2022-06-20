import React, { useState } from "react";
import { toast } from "react-toastify";
import MealCard from "../components/MealCard";

export default function QuickTrack() {
    const [query, setQuery] = useState("");
    const [food, setFood] = useState([]);
    const fetchMeal = async (e) => {
        e.preventDefault();
        if (query.length > 0) {
            const response = await fetch(
                `https://api.calorieninjas.com/v1/nutrition?query=${query}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": "g3MDcxRxD2HNwTvPtR+r4A==xeCgAwWlHSji9qmP",
                    },
                }
            );
            const { items } = await response.json();

            if (items.length > 1) {
                // loop through items array and add up the serving_size_g and calories for each item
                const totalCalories = items.reduce(
                    (acc, item) => acc + item.calories,
                    0
                );
                const totalPortion = items.reduce(
                    (acc, item) => acc + item.serving_size_g,
                    0
                );
                const totalFoods = items.map(
                    (item) => `${item.serving_size_g} ${item.name}`
                );
                const totalFoodsString = totalFoods.join(", ");
                const finalFood = {
                    calories: totalCalories,
                    portion: totalPortion,
                    name: totalFoodsString,
                };

                console.log(finalFood);

                setFood(finalFood);
            }
            if (items.length === 1) {
                const { calories, serving_size_g, name } = items[0];
                const finalFood = {
                    calories,
                    portion: serving_size_g,
                    name,
                };
                setFood(finalFood);
            }
        } else {
            toast.error("Please enter a meal");
        }
    };
    return (
        <>
            <div className="container">
                <section>
                    <form className="flex flex-col items-center space-y-6">
                        <div>
                            <label htmlFor="Meal">Input a meal</label>
                            <input
                                type="text"
                                placeholder="Describe meal with measurements (e.g. 200g of chicken)"
                                name="Meal"
                                className="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={fetchMeal}
                            className="btn border-0 bg-accent bg-gradient-to-r from-accent to-accent-focus  text-accent-content shadow-lg shadow-accent/30 hover:shadow-accent-focus/30"
                        >
                            Submit
                        </button>
                    </form>
                </section>
                <section className="mt-16">
                    {Object.keys(food).length > 0 && (
                        <MealCard
                            name={food.name}
                            calories={food.calories}
                            portion={food.portion}
                            addRemovePortion={() => {}}
                            remove={false}
                        />
                    )}
                </section>
            </div>
        </>
    );
}
