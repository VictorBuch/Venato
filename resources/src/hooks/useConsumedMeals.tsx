import axios from "axios";

export const useMeals = async () => {
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
    return { breakfast, lunch, dinner, snacks };
};
