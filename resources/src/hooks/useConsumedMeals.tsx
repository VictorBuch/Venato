import axios from "axios";
import { useEffect, useState } from "react";

export function useConsumedMeals() {
    const [consumedMeals, setConsumedMeals] = useState({});
    const [status, setStatus] = useState("idle");
    useEffect(() => {
        const getConsumedMeals = async () => {
            try {
                setStatus("fetching");
                const promises = [
                    axios.get("/api/consumed_meals/breakfast"),
                    axios.get("/api/consumed_meals/lunch"),
                    axios.get("/api/consumed_meals/dinner"),
                    axios.get("/api/consumed_meals/snacks"),
                ];
                const [breakfastData, lunchData, dinnerData, snacksData] =
                    await Promise.all(promises);
                const breakfast = breakfastData.data;
                const lunch = lunchData.data;
                const dinner = dinnerData.data;
                const snacks = snacksData.data;
                setConsumedMeals({ breakfast, lunch, dinner, snacks });
            } catch (error) {
                console.error(error);
                setStatus("error");
            } finally {
                setStatus("fetched");
            }
        };
        getConsumedMeals();
    }, []);
    return { consumedMeals, status };
}
