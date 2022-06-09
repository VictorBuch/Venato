import React, { useEffect, useState } from "react";

export default function GetUserInformation() {
    const [user, setUser] = useState({});

    const calculateCaloricIntake = (
        weight: number,
        height: number,
        age: number,
        sex: string,
        activityLevel = "sedentary",
        isMetric = true
    ) => {
        if (!isMetric) {
            height = height * 2.54;
            weight = weight * 0.453592;
        }

        // 	For women, BMR = 655.1 + (9.563 x weight in kg) + (1.850 x height in cm) - (4.676 x age in years)
        // For men, BMR = 66.47 + (13.75 x weight in kg) + (5.003 x height in cm) - (6.755 x age in years)
        let BMR = 0;

        if (sex === "male") {
            BMR = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
        } else {
            BMR = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
        }

        // Sedentary (little or no exercise): AMR = BMR x 1.2
        // Lightly active (exercise 1–3 days/week): AMR = BMR x 1.375
        // Moderately active (exercise 3–5 days/week): AMR = BMR x 1.55
        // Active (exercise 6–7 days/week): AMR = BMR x 1.725
        // Very active (hard exercise 6–7 days/week): AMR = BMR x 1.9
        let AMR = 0;
        switch (activityLevel) {
            case "sedentary":
                AMR = BMR * 1.2;
                break;
            case "lightly active":
                AMR = BMR * 1.375;
                break;
            case "moderately active":
                AMR = BMR * 1.155;
                break;
            case "active":
                AMR = BMR * 1.725;
                break;
            case "very active":
                AMR = BMR * 1.9;
                break;
        }

        return AMR;
    };

    useEffect(() => {
        setUser({
            ...user,
            calories: calculateCaloricIntake(80, 183, 23, "male"),
        });
    }, []);

    return <div>{user.calories}</div>;
}
