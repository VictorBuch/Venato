import { IconButton, LinearProgress, MenuItem, Menu } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import MealCard from "../components/MealCard";
import { UserContext } from "../contexts/UserContext";
import { useMacros } from "../hooks/useMacros";
import { useQuery } from "../hooks/useQuery";
import { Meal } from "../types/meals";
import { DropdownMenuButton } from "../components/DropdownMenuButton";

export default function AddFood() {
    console.log("AddFood rendered");

    // Spoof data for now id: number;

    const [savedFoods, setSavedFoods] = useState<Meal[]>([
        {
            id: Math.ceil(Math.random() * 1000),
            name: "Pizza",
            description: "",
            calories: 100,
            carbs: 10,
            protein: 10,
            fat: 10,
            portion: 1,
            portion_unit: "g",
        },
        {
            id: Math.ceil(Math.random() * 1000),
            name: "Burger",
            description: "",
            calories: 100,
            carbs: 10,
            protein: 10,
            fat: 10,
            portion: 1,
            portion_unit: "g",
        },
    ]);
    const [filteredSavedFoods, setFilteredSavedFoods] =
        useState<Meal[]>(savedFoods);

    const navigate = useNavigate();
    const query = useQuery();
    const mealType = query.get("meal");

    const [searchQuery, setSearchQuery] = useState("");
    const [consumedMeals, setConsumedMeals] = useState([]);
    const [allConsumedMeals, setAllConsumedMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
    });
    const [meals, setMeals] = useState([{}]);
    const [filteredMeals, setFilteredMeals] = useState(meals);
    const { user, setUser } = useContext(UserContext);
    const {
        protein,
        setProtein,
        proteinPercent,
        setProteinPercent,
        fat,
        setFat,
        fatPercent,
        setFatPercent,
        carbs,
        setCarbs,
        carbsPercent,
        setCarbsPercent,
        calories,
        setCalories,
        caloriesPercent,
        setCaloriesPercent,
    } = useMacros();

    useEffect(() => {
        const fetchData = async () => {
            const promises = [
                axios.get(`/api/meals`),
                axios.get(`/api/consumed_meals/${mealType}`),
                axios.get("/api/consumed_meals/breakfast"),
                axios.get("/api/consumed_meals/lunch"),
                axios.get("/api/consumed_meals/dinner"),
                axios.get("/api/consumed_meals/snacks"),
            ];
            const [mealsDB, consumedMealsDB, breakfast, lunch, dinner, snacks] =
                await Promise.all(promises);
            setAllConsumedMeals({
                breakfast: breakfast.data,
                lunch: lunch.data,
                dinner: dinner.data,
                snacks: snacks.data,
            });
            setConsumedMeals(consumedMealsDB.data);
            setMeals(mealsDB.data);
            setFilteredMeals(mealsDB.data);
        };
        fetchData();
        setCalories((calories) => ({
            ...calories,
            left: calories.goal - calories.eaten,
            goal: user.calorie_goal,
        }));
        setCarbs((carbs) => ({
            ...carbs,
            left: carbs.goal - carbs.eaten,
            goal: user.carb_goal,
        }));
        setFat((fat) => ({
            ...fat,
            left: fat.goal - fat.eaten,
            goal: user.fat_goal,
        }));
        setProtein((protein) => ({
            ...protein,
            left: protein.goal - protein.eaten,
            goal: user.protein_goal,
        }));
    }, []);

    useEffect(() => {
        const combinedMeals = allConsumedMeals.breakfast.concat(
            allConsumedMeals.lunch,
            allConsumedMeals.dinner,
            allConsumedMeals.snacks
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
        setCalories((calories) => ({
            ...calories,
            eaten: totalCalories,
            left: calories.goal - totalCalories,
        }));
        setCarbs((carbs) => ({
            ...carbs,
            eaten: totalCarbs,
            left: carbs.goal - totalCarbs,
        }));
        setFat((fat) => ({
            ...fat,
            eaten: totalFat,
            left: fat.goal - totalFat,
        }));
        setProtein((protein) => ({
            ...protein,
            eaten: totalProtein,
            left: protein.goal - totalProtein,
        }));
        setFatPercent((totalFat / fat.goal) * 100);
        setCarbsPercent((totalCarbs / carbs.goal) * 100);
        setProteinPercent((totalProtein / protein.goal) * 100);
        setCaloriesPercent((totalCalories / calories.goal) * 100);
    }, [consumedMeals]);

    useEffect(() => {
        if (
            savedFoods.length > 0 &&
            savedFoods.every((meal) => meal.name) &&
            meals.length > 0 &&
            meals.every((meal) => meal.name)
        ) {
            if (searchQuery.length > 0) {
                setFilteredSavedFoods(
                    savedFoods.filter((meal) =>
                        meal.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    )
                );
                setFilteredMeals(
                    meals.filter((meal) =>
                        meal.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    )
                );
            } else {
                setFilteredSavedFoods(savedFoods);
                setFilteredMeals(meals);
            }
        }
    }, [searchQuery]);

    const refetchData = async () => {
        const promises = [
            axios.get(`/api/meals`),
            axios.get(`/api/consumed_meals/${mealType}`),
            axios.get("/api/consumed_meals/breakfast"),
            axios.get("/api/consumed_meals/lunch"),
            axios.get("/api/consumed_meals/dinner"),
            axios.get("/api/consumed_meals/snacks"),
        ];
        const [mealsDB, consumedMealsDB, breakfast, lunch, dinner, snacks] =
            await Promise.all(promises);
        setAllConsumedMeals({
            breakfast: breakfast.data,
            lunch: lunch.data,
            dinner: dinner.data,
            snacks: snacks.data,
        });
        setConsumedMeals(consumedMealsDB.data);
        setMeals(mealsDB.data);
        setFilteredMeals(mealsDB.data);
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
        <>
            <section className="container bg-accent py-8">
                <div className=" flex h-full w-full  items-center justify-between space-x-2">
                    <Link to="/dashboard">
                        <svg
                            className="h-6 w-6 !stroke-accent-content"
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
                    <h1 className="w-max text-xl font-bold text-accent-content">
                        {mealType!.toUpperCase()}
                    </h1>
                    <div className="ml-auto h-max w-max">
                        <DropdownMenuButton />
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-center">
                    <div className="form-control w-full">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Search…"
                                className="input input-bordered w-full bg-accent-content !text-black placeholder:text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="btn btn-square">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container space-y-4">
                {!searchQuery.length && (
                    <section className="my-8 flex w-full flex-col items-center space-y-4 rounded border border-base-content p-4 text-neutral-content shadow-lg">
                        <div className="flex w-full flex-col items-center justify-center space-y-2">
                            <div className="flex w-full items-center justify-between">
                                <h1 className="text-sm">Dalily intake</h1>
                                <h3 className="text-sm">
                                    {" "}
                                    {calories.eaten}/{user.calorie_goal} kcal
                                </h3>
                            </div>
                            <LinearProgress
                                color="inherit"
                                className="w-full text-accent"
                                value={caloriesPercent}
                                variant="determinate"
                                sx={{ zIndex: 0, borderRadius: "4px" }}
                            />
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                                <h3 className="text-sm">Carbs</h3>
                                <LinearProgress
                                    color="inherit"
                                    className="w-full text-accent"
                                    value={carbsPercent}
                                    variant="determinate"
                                    sx={{ zIndex: 0, borderRadius: "4px" }}
                                />

                                <p className="text-sm">
                                    {carbs.eaten}/ {user.carb_goal}g
                                </p>
                            </div>
                            <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                                <h3 className="text-sm">Protein</h3>
                                <LinearProgress
                                    color="inherit"
                                    className="w-full text-accent"
                                    value={proteinPercent}
                                    variant="determinate"
                                    sx={{ zIndex: 0, borderRadius: "4px" }}
                                />
                                <p className="text-sm">
                                    {protein.eaten}/ {user.protein_goal}g
                                </p>
                            </div>
                            <div className="flex w-1/4 flex-col items-center justify-center space-y-2">
                                <h3 className="text-sm">fat</h3>
                                <LinearProgress
                                    color="inherit"
                                    className="w-full text-accent"
                                    value={fatPercent}
                                    variant="determinate"
                                    sx={{ zIndex: 0, borderRadius: "4px" }}
                                />

                                <p className="text-sm">
                                    {fat.eaten}/ {user.fat_goal}g
                                </p>
                            </div>
                        </div>
                    </section>
                )}
                {consumedMeals.length > 0 && !searchQuery.length && (
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
                {filteredSavedFoods.length > 0 && searchQuery.length > 0 && (
                    <section className="my-8">
                        <h1>Saved Foods</h1>
                        <div className="space-y-4">
                            {filteredSavedFoods.map((food) => (
                                <MealCard
                                    key={food.id}
                                    name={food.name}
                                    calories={100}
                                    portion={100}
                                    customizePortion={() =>
                                        handleCustomizePortion(food)
                                    }
                                    addRemovePortion={() => handleAddMeal(food)}
                                />
                            ))}
                        </div>
                    </section>
                )}
                <section className="my-8">
                    <h1>Meals</h1>
                    <div className="space-y-4">
                        {filteredMeals.length > 0 &&
                            filteredMeals.map((meal) => (
                                <MealCard
                                    key={Math.ceil(Math.random() * 1000)}
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
        </>
    );
}
