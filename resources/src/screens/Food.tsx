import { FormControl, InputLabel, NativeSelect } from "@mui/material";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "../hooks/useQuery";

export default function Food() {
    const { id } = useParams();
    const query = useQuery();
    const mealType = query.get("meal");
    const navigate = useNavigate();

    const [food, setFood] = useState({});
    const [invalidInputs, setInvalidInputs] = useState(false);
    const [portion, setPortion] = useState(0);
    const [unit, setUnit] = useState("g");

    useEffect(() => {
        const fetchFood = async () => {
            const response = await axios.get(`/api/meals`, { params: { id } });
            setFood(response.data);
            setPortion(response.data.portion);
            setUnit(response.data.portion_unit);
        };
        fetchFood();
    }, []);

    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();

        if (portion && unit) {
            setInvalidInputs(false);
            try {
                const response = await axios.post(`/api/consumed_meals`, {
                    meal_id: food.id,
                    meal_type: mealType,
                    portion: portion,
                    portion_unit: unit,
                });

                if (response.status === 200) {
                    toast.success("Meal added successfully!");
                    setTimeout(() => {
                        navigate(`/add-food?meal=${mealType}`);
                    }, 2500);
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong!");
            }
        } else {
            setInvalidInputs(true);
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="container">
                <h1>{food.name}</h1>
                <button>Heart</button>

                <form onSubmit={handleSubmit}>
                    <input
                        className={`mt-2 w-full border border-gray-400 p-2 text-gray-800 rounded${
                            invalidInputs ? " border-red-500" : "border-none"
                        }`}
                        type="number"
                        value={portion}
                        required
                        onChange={(e) => setPortion(e.target.value)}
                    />
                    <FormControl>
                        <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                        >
                            Unit
                        </InputLabel>
                        <NativeSelect
                            className={`mt-2 border border-gray-400 p-2 text-gray-800 rounded${
                                invalidInputs
                                    ? " border-red-500"
                                    : "border-none"
                            }`}
                            defaultValue={unit}
                            inputProps={{
                                name: "portion-unit",
                                id: "uncontrolled-native",
                            }}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <option value="g">g</option>
                            <option value="p">pound</option>
                        </NativeSelect>
                    </FormControl>
                    <button type="submit">Track</button>
                </form>
            </div>
        </Suspense>
    );
}
