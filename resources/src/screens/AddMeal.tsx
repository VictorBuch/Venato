import axios from "axios";
import React from "react";

export default function AddMeal() {
    const [name, setName] = React.useState("");
    const [portion, setPortion] = React.useState(null);
    const [calories, setCalories] = React.useState(null);
    const [carbs, setCarbs] = React.useState(null);
    const [protein, setProtein] = React.useState(null);
    const [fat, setFat] = React.useState(null);

    const [invalidInputs, setInvalidInputs] = React.useState(false);

    const handleSubmit = async (e: MouseEvent) => {
        e.preventDefault();
        if (name && portion) {
            setInvalidInputs(false);
            const response = await axios.post(`/api/add-meal`, {
                name,
                portion,
                calories,
                carbs,
                protein,
                fat,
            });
            if (response.success) {
                alert("Meal added!");
            }
        } else {
            setInvalidInputs(true);
        }
    };

    return (
        <div className="container">
            <section className="h-screen w-full flex flex-col items-center">
                <form className="flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <label className="text-xl text-gray-200">Name</label>
                        {invalidInputs && (
                            <p className="text-red-500">
                                Please fill this field
                            </p>
                        )}
                        <input
                            className={`w-full mt-2 p-2 border text-gray-800 border-gray-400 rounded${
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
                        <label className="text-xl text-gray-200">Portion</label>
                        {invalidInputs && (
                            <p className="text-red-500">
                                Please fill this field
                            </p>
                        )}
                        <input
                            className={`w-full mt-2 p-2 border text-gray-800 border-gray-400 rounded${
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
                    <div className="flex flex-col items-center">
                        <label className="text-xl text-gray-200">
                            Calories
                        </label>
                        <input
                            className="w-full mt-2 p-2 border text-gray-800 border-gray-400 rounded"
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-xl text-gray-200">Carbs</label>
                        <input
                            className="w-full mt-2 p-2 border text-gray-800 border-gray-400 rounded"
                            type="number"
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-xl text-gray-200">Protein</label>
                        <input
                            className="w-full mt-2 p-2 border text-gray-800 border-gray-400 rounded"
                            type="number"
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-xl text-gray-200">Fat</label>
                        <input
                            className="w-full mt-2 p-2 border text-gray-800 border-gray-400 rounded"
                            type="number"
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-3 bg-primary rounded-md w-full mt-6"
                    >
                        Submit meal
                    </button>
                </form>
            </section>
        </div>
    );
}
