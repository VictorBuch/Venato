import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GetUserInformation() {
    const [user, setUser] = useState({});
    const [step, setStep] = useState("basic");

    const navigate = useNavigate();

    const calculateCaloricIntake = (
        weight: number,
        height: number,
        age: number,
        sex: string,
        goal = "maintain",
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
                AMR = BMR * 1.55;
                break;
            case "active":
                AMR = BMR * 1.725;
                break;
            case "very active":
                AMR = BMR * 1.9;
                break;
        }

        // Maintain weight 100% Calories/day
        // Mild weight loss 0.25 kg/week 90% Calories/day
        // Weight loss 0.5 kg/week 80% Calories/day
        // Extreme weight loss 1 kg/week 60% Calories/day
        let finalCaloricIntake = AMR;
        switch (goal) {
            case "mild loss":
                finalCaloricIntake = AMR * 0.9;
                break;
            case "loss":
                finalCaloricIntake = AMR * 0.8;
                break;
            case "extreme loss":
                finalCaloricIntake = AMR * 0.6;
                break;
            case "maintain":
                finalCaloricIntake = AMR;
                break;
            case "mild gain":
                finalCaloricIntake = AMR * 1.1;
                break;
            case "gain":
                finalCaloricIntake = AMR * 1.2;
                break;
            case "extreme gain":
                finalCaloricIntake = AMR * 1.4;
                break;
            default:
                break;
        }

        return Math.ceil(finalCaloricIntake);
    };

    const calculateCarbFatProteinRatio = (calories: number) => {
        return {
            carbGoal: Math.ceil((calories * 0.4) / 4),
            fatGoal: Math.ceil((calories * 0.2) / 9),
            proteinGoal: Math.ceil((calories * 0.4) / 4),
        };
    };

    const handleSubmitUser = async () => {
        const { height, weight, age, sex, goal, activityLevel, isMetric } =
            user;
        const calories = calculateCaloricIntake(
            weight,
            height,
            age,
            sex,
            goal,
            activityLevel,
            isMetric
        );
        setUser({ ...user, calories });

        const { carbGoal, fatGoal, proteinGoal } =
            calculateCarbFatProteinRatio(calories);

        const response = await axios.put("/api/user", {
            age,
            height,
            weight,
            sex,
            goal: goal,
            activity_level: activityLevel,
            calorie_goal: calories,
            carb_goal: carbGoal,
            fat_goal: fatGoal,
            protein_goal: proteinGoal,
        });

        if (response.status) {
            navigate("/dashboard");
        }
    };

    return (
        <div>
            {/* {user.calories} Kcal */}
            {step === "basic" && (
                <GetBasicInfo setStep={setStep} user={user} setUser={setUser} />
            )}
            {step === "goal" && (
                <GetGoalInfo
                    setStep={setStep}
                    user={user}
                    setUser={setUser}
                    handleSubmitUser={handleSubmitUser}
                />
            )}
        </div>
    );
}

const GetBasicInfo = ({ setStep, user, setUser }) => {
    return (
        <>
            <div className="container">
                <div className="mt-32 flex flex-col items-center">
                    <form className="form-control space-y-6">
                        <div>
                            <label htmlFor="height">Height</label>
                            <input
                                type="number"
                                placeholder="Type your height (cm)"
                                name="height"
                                className="max-w-xs input w-full bg-neutral text-neutral-content placeholder:text-neutral-content"
                                value={user.height || ""}
                                onChange={(e) =>
                                    setUser({ ...user, height: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="Weight">Weight</label>
                            <input
                                type="number"
                                placeholder="Type your Weight (kgs)"
                                name="Weight"
                                className="max-w-xs input w-full bg-neutral text-neutral-content placeholder:text-neutral-content"
                                value={user.weight || ""}
                                onChange={(e) =>
                                    setUser({ ...user, weight: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="Age">Age</label>
                            <input
                                type="number"
                                placeholder="Type your Age"
                                name="Age"
                                className="max-w-xs input w-full bg-neutral text-neutral-content placeholder:text-neutral-content"
                                value={user.age || ""}
                                onChange={(e) =>
                                    setUser({ ...user, age: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="Gender">Gender</label>
                            <input
                                type="text"
                                placeholder="(male or female)"
                                name="Gender"
                                className="max-w-xs input w-full bg-neutral text-neutral-content placeholder:text-neutral-content"
                                value={user.sex || ""}
                                onChange={(e) =>
                                    setUser({ ...user, sex: e.target.value })
                                }
                            />
                        </div>
                    </form>
                </div>
            </div>
            <div className="container fixed bottom-4 ">
                <button
                    onClick={() => setStep("goal")}
                    className="btn btn-accent btn-block "
                >
                    Next
                </button>
            </div>
        </>
    );
};

const GetGoalInfo = ({ user, setUser, setStep, handleSubmitUser }) => {
    return (
        <>
            <div className="container ">
                <div className="mt-16 flex flex-col items-center">
                    <button
                        onClick={() => setStep("basic")}
                        className="btn btn-ghost"
                    >
                        Back
                    </button>
                    <FormControl className="max-w-xs mt-16 space-y-6" fullWidth>
                        <InputLabel id="activity-level">
                            Activity Level
                        </InputLabel>
                        <Select
                            labelId="activity-level"
                            value={user.activityLevel || ""}
                            label="Activity Level"
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    activityLevel: e.target.value,
                                })
                            }
                        >
                            <MenuItem value="sedentary">
                                Sedentary (little or no exercise)
                            </MenuItem>
                            <MenuItem value="lightly active">
                                Lightly active (exercise 1–3 days/week)
                            </MenuItem>
                            <MenuItem value="moderately active">
                                Moderately active (exercise 3–5 days/week)
                            </MenuItem>
                            <MenuItem value="active">
                                Active (exercise 6–7 days/week)
                            </MenuItem>
                            <MenuItem value="very active">
                                Very active (hard exercise 6–7 days/week)
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className="max-w-xs mt-16 space-y-6" fullWidth>
                        <InputLabel id="goal">Goal</InputLabel>
                        <Select
                            labelId="goal"
                            value={user.goal || ""}
                            label="Goal"
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    goal: e.target.value,
                                })
                            }
                        >
                            <MenuItem value="mild loss">
                                Mild loss 0.25kgs/week
                            </MenuItem>
                            <MenuItem value="loss">Loss 0.5kgs/week</MenuItem>
                            <MenuItem value="extreme loss">
                                Extreme loss 1kgs/week
                            </MenuItem>
                            <MenuItem value="maintain">
                                Maintain weigth
                            </MenuItem>
                            <MenuItem value="mild gain">
                                Mild gain 0.25kgs/week
                            </MenuItem>
                            <MenuItem value="gain">gain 0.5kgs/week</MenuItem>
                            <MenuItem value="extreme gain">
                                Extreme gain 1kgs/week
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="container fixed bottom-4 ">
                <button
                    onClick={handleSubmitUser}
                    className="btn btn-accent btn-block "
                >
                    Finish
                </button>
            </div>
        </>
    );
};
