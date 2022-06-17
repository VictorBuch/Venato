import { useState } from "react";

export const useMacros = () => {
    const [calories, setCalories] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });

    const [caloriesPercent, setCaloriesPercent] = useState(0);

    const [carbs, setCarbs] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });
    const [carbsPercent, setCarbsPercent] = useState(0);

    const [fat, setFat] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });
    const [fatPercent, setFatPercent] = useState(0);

    const [protein, setProtein] = useState({
        eaten: 0,
        burned: 0,
        goal: 0,
        left: 0,
    });
    const [proteinPercent, setProteinPercent] = useState(0);
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
