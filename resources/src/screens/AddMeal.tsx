import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddMeal() {
    const [name, setName] = useState("");
    const [portion, setPortion] = useState(undefined);
    // const [unit, setUnit] = useState('g');
    const [calories, setCalories] = useState(undefined);
    const [carbs, setCarbs] = useState(undefined);
    const [protein, setProtein] = useState(undefined);
    const [fat, setFat] = useState(undefined);

    const [invalidInputs, setInvalidInputs] = React.useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();

        if (name && portion) {
            setInvalidInputs(false);
            try {
                const response = await axios.post(`/api/meals`, {
                    name,
                    portion,
                    calories,
                    carbs,
                    protein,
                    fat,
                });

                if (response.status === 200) {
                    toast.success("Meal added successfully!");
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 2500);

                    // TODO: Ask if user wants to add another meal
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            setInvalidInputs(true);
        }
    };

    return (
        <>
            <div className="container">
                <section className="flex h-screen w-full flex-col items-center justify-center">
                    <form className="flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center">
                            <label className="text-xl text-gray-200">
                                Name
                            </label>
                            {invalidInputs && (
                                <p className="text-red-500">
                                    Please fill this field
                                </p>
                            )}
                            <input
                                className={`mt-2 w-full border border-gray-400 p-2 text-gray-800 rounded${
                                    invalidInputs
                                        ? " border-red-500"
                                        : "border-none"
                                }`}
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-xl text-gray-200">
                                Portion
                            </label>
                            {invalidInputs && (
                                <p className="text-red-500">
                                    Please fill this field
                                </p>
                            )}
                            <div className="flex items-center">
                                <input
                                    className={`mt-2 w-full border border-gray-400 p-2 text-gray-800 rounded${
                                        invalidInputs
                                            ? " border-red-500"
                                            : "border-none"
                                    }`}
                                    type="number"
                                    value={portion}
                                    required
                                    onChange={(e) => setPortion(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-xl text-gray-200">
                                Calories
                            </label>
                            <input
                                className="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-xl text-gray-200">
                                Carbs
                            </label>
                            <input
                                className="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
                                type="number"
                                value={carbs}
                                onChange={(e) => setCarbs(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-xl text-gray-200">
                                Protein
                            </label>
                            <input
                                className="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
                                type="number"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-xl text-gray-200">Fat</label>
                            <input
                                className="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
                                type="number"
                                value={fat}
                                onChange={(e) => setFat(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleSubmit}
                                className=" !mt-8 w-full rounded-md bg-primary px-4 py-3"
                            >
                                Submit meal
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}
