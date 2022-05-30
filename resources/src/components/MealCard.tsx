import React from "react";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

interface Props {
    name: string;
    portion: number;
    calories: number;
    clicked: () => void;
}

export default function MealCard({ name, calories, portion, clicked }: Props) {
    return (
        <div
            className="text-neutral-contetn flex w-full items-center rounded bg-neutral p-4 shadow-lg"
            onClick={clicked}
        >
            <div className=" w-72">
                <h1 className="w-full truncate text-xl font-bold text-white">
                    {name}
                </h1>
                <p className="text-md ">{calories} kcal</p>
                <p className="text-md ">{portion} g</p>
            </div>
            <AddCircleRoundedIcon className="ml-auto scale-150 " />
        </div>
    );
}
