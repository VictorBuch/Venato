export const calculateCaloricIntake = (
	weight: number,
	height: number,
	age: number,
	sex: string,
	goal = 'maintain',
  kilosPerWeek = 0.5,
	activityLevel = 'sedentary',
	isMetric = true
) => {
	if (!isMetric) {
		height = height * 2.54;
		weight = weight * 0.453592;
	}

	// 	For women, BMR = 655.1 + (9.563 x weight in kg) + (1.850 x height in cm) - (4.676 x age in years)
	// For men, BMR = 66.47 + (13.75 x weight in kg) + (5.003 x height in cm) - (6.755 x age in years)
	let BMR = 0;

	if (sex === 'male') {
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
		case 'sedentary':
			AMR = BMR * 1.2;
			break;
		case 'lightly active':
			AMR = BMR * 1.375;
			break;
		case 'moderately active':
			AMR = BMR * 1.55;
			break;
		case 'active':
			AMR = BMR * 1.725;
			break;
		case 'very active':
			AMR = BMR * 1.9;
			break;
	}

	// Maintain weight 100% Calories/day
	// Mild weight loss 0.25 kg/week 90% Calories/day
	// Weight loss 0.5 kg/week 80% Calories/day
	// Extreme weight loss 1 kg/week 60% Calories/day
  let finalCaloricIntake = AMR;
  switch (goal) {
    case 'loss':
      switch (kilosPerWeek) {
        case 0.25:
          finalCaloricIntake = AMR * 0.9;
          break;
        case 0.5:
          finalCaloricIntake = AMR * 0.8;
          break;
        case 1:
          finalCaloricIntake = AMR * 0.6;
          break;
      }
      break;
    case 'maintain':
      finalCaloricIntake = AMR;
      break;
    case 'gain':
      switch (kilosPerWeek) {
        case 0.25:
          finalCaloricIntake = AMR * 1.1;
          break;
        case 0.5:
          finalCaloricIntake = AMR * 1.2;
          break;
        case 1:
          finalCaloricIntake = AMR * 1.4;
          break;
      }
      break;
  }

	return Math.ceil(finalCaloricIntake);
};

export const calculateCarbFatProteinRatio = (calories: number) => {
	return {
		carbGoal: Math.ceil((calories * 0.4) / 4),
		fatGoal: Math.ceil((calories * 0.2) / 9),
		proteinGoal: Math.ceil((calories * 0.4) / 4)
	};
};
