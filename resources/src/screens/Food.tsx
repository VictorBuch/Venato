import {
    Box,
    CircularProgress,
    CircularProgressProps,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "../hooks/useQuery";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

export default function Food() {
    const { id } = useParams();
    const query = useQuery();
    const mealType = query.get("meal");
    const navigate = useNavigate();

    const [food, setFood] = useState({});
    const [invalidInputs, setInvalidInputs] = useState(false);
    const [portion, setPortion] = useState("0");
    const [unit, setUnit] = useState("g");

    useEffect(() => {
        const fetchFood = async () => {
            const response = await axios.get(`/api/meals`, { params: { id } });
            setFood(response.data);
            setPortion(String(response.data.portion));
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
                    navigate(`/add-food?meal=${mealType}`);
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong!");
            }
        } else {
            setInvalidInputs(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setPortion("");
        } else {
            setPortion(e.target.value);
        }
    };

    function calculateFoodCalories(): number {
        const calories = food.calories * (Number(portion) / food.portion);
        return Math.ceil(calories);
    }

    function calculatePercentage(amount: number, total: number): number {
        return Math.ceil((amount / total) * 100);
    }

    const [isFavorite, setIsFavorite] = useState(false);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <>
                <section className="flex h-48  items-end  justify-between bg-accent p-4">
                    <h1 className="text-lg font-semibold text-accent-content ">
                        {food.name}
                    </h1>
                    <button onClick={() => setIsFavorite((prev) => !prev)}>
                        <div className="rounded-full bg-white p-2 drop-shadow-xl hover:drop-shadow-2xl">
                            <svg
                                className="h-6 w-6"
                                fill={isFavorite ? "red" : "gray"}
                                stroke={isFavorite ? "red" : "gray"}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                            </svg>
                        </div>
                    </button>
                </section>
                <div className="container relative h-max ">
                    <form className="mt-8 space-y-2">
                        <div className="flex space-x-2">
                            <input
                                className={` w-full rounded border border-gray-400 p-2 text-gray-800 outline-none ring-0 rounded${
                                    invalidInputs
                                        ? " border-red-500"
                                        : "border-none"
                                }`}
                                type="number"
                                value={portion}
                                required
                                min={1}
                                onChange={handleInputChange}
                            />
                            <FormControl size="small">
                                <InputLabel id="select-label">Unit</InputLabel>
                                <Select
                                    labelId="select-label"
                                    label="Unit"
                                    value={unit}
                                    className={`rounded border border-gray-400 bg-neutral-content p-2 text-gray-800 ${
                                        invalidInputs
                                            ? " border-red-500"
                                            : "border-none"
                                    }`}
                                    onChange={(e) => setUnit(e.target.value)}
                                >
                                    <MenuItem value="g">g</MenuItem>
                                    <MenuItem value="p">p</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </form>
                    <div className="my-8 flex items-center space-x-3">
                        <figure>
                            <SentimentSatisfiedIcon
                                color="success"
                                fontSize="large"
                            />
                        </figure>
                        <p className="text-md text-base-content">
                            <span className="text-2xl font-semibold text-base-content ">
                                {calculateFoodCalories()}
                            </span>{" "}
                            kcal
                        </p>
                    </div>
                    <section className="my-8 space-y-6">
                        <p className="text-lg font-semibold text-base-content">
                            Nutritional information
                        </p>
                        <div className="flex justify-center space-x-6">
                            <div className="flex flex-col items-center">
                                <CircularProgressWithLabel
                                    className="text-accent"
                                    value={calculatePercentage(
                                        food.carbs,
                                        food.carbs + food.protein + food.fat
                                    )}
                                    size={75}
                                    thickness={2}
                                    color="inherit"
                                />
                                <p className="mt-2 text-xs uppercase text-base-content">
                                    Carbs
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <CircularProgressWithLabel
                                    className="text-accent"
                                    value={calculatePercentage(
                                        food.protein,
                                        food.carbs + food.protein + food.fat
                                    )}
                                    size={75}
                                    thickness={2}
                                    color="inherit"
                                />
                                <p className="mt-2 text-xs uppercase text-base-content">
                                    Carbs
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <CircularProgressWithLabel
                                    className="text-accent"
                                    value={calculatePercentage(
                                        food.fat,
                                        food.carbs + food.protein + food.fat
                                    )}
                                    size={75}
                                    thickness={2}
                                    color="inherit"
                                />
                                <p className="mt-2 text-xs uppercase text-base-content">
                                    Carbs
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-6">
                        <h1 className="font-semi-bold text-lg text-base-content">
                            Nutritional information
                        </h1>
                        <div className="flex w-full items-center justify-between">
                            <p>carbs</p>
                            <p>48</p>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <p>Protein</p>
                            <p>48</p>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <p>Fat</p>
                            <p>48</p>
                        </div>
                    </section>
                </div>
                <div className="text-md container fixed bottom-4">
                    <button
                        onClick={handleSubmit}
                        className="w-full  rounded-full  bg-neutral px-4 py-2 text-neutral-content  drop-shadow-xl active:bg-neutral-focus"
                    >
                        Track
                    </button>
                </div>
            </>
        </Suspense>
    );
}

function CircularProgressWithLabel(
    props: CircularProgressProps & {
        size: number;
    } & { thickness: number }
) {
    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-flex",
            }}
        >
            <CircularProgress
                variant="determinate"
                sx={{ zIndex: 0 }}
                {...props}
            />
            <CircularProgress
                variant="determinate"
                color="inherit"
                size={props.size}
                thickness={props.thickness}
                value={100}
                sx={{
                    color: "rgba(255,255,255,0.1)",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: -10,
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h2 className="text-lg font-semibold text-base-content">
                    {props.value}%
                </h2>
            </Box>
        </Box>
    );
}
