import React from "react";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

interface Props {
    name: string;
    portion: number;
    calories: number;
    remove: boolean;
    addRemovePortion: () => void;
    customizePortion?: () => void;
}

export default function MealCard({
    name,
    calories,
    portion,
    customizePortion,
    addRemovePortion,
    remove = false,
}: Props) {
    return (
        <div className="flex w-full items-center rounded  bg-neutral p-4 text-neutral-content shadow-lg">
            <div onClick={customizePortion} className=" w-72">
                <h1 className="w-full truncate text-xl font-bold text-white">
                    {name}
                </h1>
                <p className="text-md ">{calories} kcal</p>
                <p className="text-md ">{portion} g</p>
            </div>
            <AddCircleRoundedIcon
                onClick={addRemovePortion}
                className={`ml-auto scale-150 !text-accent-focus ${
                    remove ? "rotate-45" : ""
                }`}
            />
        </div>
    );
}
