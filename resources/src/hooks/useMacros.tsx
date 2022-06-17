import { useState } from "react";

export const useMacros = () => {
    const [calories, setCalories] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });

    const [caloriesPercent, setCaloriesPercent] = useState(
        (calories.eaten / calories.goal) * 100
    );

    const [carbs, setCarbs] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });
    const [carbsPercent, setCarbsPercent] = useState(
        (carbs.eaten / carbs.goal) * 100
    );

    const [fat, setFat] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });
    const [fatPercent, setFatPercent] = useState((fat.eaten / fat.goal) * 100);

    const [protein, setProtein] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });
    const [proteinPercent, setProteinPercent] = useState(
        (protein.eaten / protein.goal) * 100
    );
    return {
        calories,
        setCalories,
        caloriesPercent,
        setCaloriesPercent,
        carbs,
        setCarbs,
        carbsPercent,
        setCarbsPercent,
        fat,
        setFat,
        fatPercent,
        setFatPercent,
        protein,
        setProtein,
        proteinPercent,
        setProteinPercent,
    };
};
