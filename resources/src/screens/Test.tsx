import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";

export default function Test() {
    const [foods, setFoods] = useState([]);

    const { status, data } = useFetch(
        `https://api.calorieninjas.com/v1/nutrition?query=${foods}`,
        { "X-Api-Key": "g3MDcxRxD2HNwTvPtR+r4A==xeCgAwWlHSji9qmP" }
    );
    console.log(status, data);

    return (
        <div>
            <input
                type="text"
                value={foods}
                onChange={(e) => setFoods(e.target.value)}
            />
            <button>Fetch</button>
        </div>
    );
}
