import axios from "axios";
import React, { useState } from "react";

export default function Test() {
    const [foods, setFoods] = useState([]);
    const fetchFood = async () => {
        const response = await fetch(
            `https://api.calorieninjas.com/v1/nutrition?query=${foods}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": "g3MDcxRxD2HNwTvPtR+r4A==xeCgAwWlHSji9qmP",
                },
            }
        );
        const json = await response.json();
        console.log(json);
    };

    const fetchDB = async () => {
        const response = await axios.get("/api/foodDB");

        console.log(response);
    };

    return (
        <div>
            <input
                type="text"
                value={foods}
                onChange={(e) => setFoods(e.target.value)}
            />
            <button onClick={fetchFood}>Fetch</button>
            <button onClick={fetchDB}>FOOD DB</button>
        </div>
    );
}
