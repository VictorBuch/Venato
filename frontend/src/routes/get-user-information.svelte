<script lang="ts">
	// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import axios from 'axios';
	import API from '../services/Api';

	let user = {
		height: undefined,
		weight: undefined,
		age: undefined,
		sex: undefined,
		goal: undefined,
		calories: undefined,
		activityLevel: undefined,
		isMetric: true
	};
	let step = 'basic';

	const calculateCaloricIntake = (
		weight: number,
		height: number,
		age: number,
		sex: string,
		goal = 'maintain',
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
			case 'mild loss':
				finalCaloricIntake = AMR * 0.9;
				break;
			case 'loss':
				finalCaloricIntake = AMR * 0.8;
				break;
			case 'extreme loss':
				finalCaloricIntake = AMR * 0.6;
				break;
			case 'maintain':
				finalCaloricIntake = AMR;
				break;
			case 'mild gain':
				finalCaloricIntake = AMR * 1.1;
				break;
			case 'gain':
				finalCaloricIntake = AMR * 1.2;
				break;
			case 'extreme gain':
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
			proteinGoal: Math.ceil((calories * 0.4) / 4)
		};
	};

	const handleSubmitUser = async () => {
		const { height, weight, age, sex, goal, activityLevel, isMetric } = user;
		const calories = calculateCaloricIntake(
			weight,
			height,
			age,
			sex,
			goal,
			activityLevel,
			isMetric
		);
		user = { ...user, calories };

		const { carbGoal, fatGoal, proteinGoal } = calculateCarbFatProteinRatio(calories);

		const response = await API.put('/auth/user', {
			age,
			height,
			weight,
			sex,
			goal: goal,
			activity_level: activityLevel,
			calorie_goal: calories,
			carb_goal: carbGoal,
			fat_goal: fatGoal,
			protein_goal: proteinGoal
		});

		if (response.status === 200) {
			goto('/dashboard');
		}
	};
</script>

{#if step === 'basic'}
	<div class="container">
		<div class="mt-32 flex flex-col items-center">
			<form class="form-control space-y-6">
				<div>
					<label for="height">Height</label>
					<input
						type="number"
						placeholder="Type your height (cm)"
						name="height"
						class="input bg-neutral text-neutral-content placeholder:text-neutral-content w-full max-w-xs"
						bind:value={user.height}
					/>
				</div>
				<div>
					<label for="Weight">Weight</label>
					<input
						type="number"
						placeholder="Type your Weight (kgs)"
						name="Weight"
						class="input bg-neutral text-neutral-content placeholder:text-neutral-content w-full max-w-xs"
						bind:value={user.weight}
					/>
				</div>
				<div>
					<label for="Age">Age</label>
					<input
						type="number"
						placeholder="Type your Age"
						name="Age"
						class="input bg-neutral text-neutral-content placeholder:text-neutral-content w-full max-w-xs"
						bind:value={user.age}
					/>
				</div>
				<div class="form-control max-w-xs">
					<label class="label" for="Gender">
						<span class="label-text">Pick your gender</span>
					</label>
					<select class="select select-bordered bg-neutral" name="Gender" bind:value={user.sex}>
						<option disabled selected>Pick one</option>
						<option value={'male'}>male</option>
						<option value={'female'}>female</option>
						<option value={'other'}>other</option>
					</select>
				</div>
			</form>
		</div>
	</div>
	<div class="container fixed bottom-4">
		<button
			on:click={() => (step = 'goal')}
			class="btn btn-block bg-accent from-accent to-accent-focus text-accent-content shadow-accent/30  hover:shadow-accent-focus/30 border-0 bg-gradient-to-r shadow-lg"
		>
			Next
		</button>
	</div>
{:else if step === 'goal'}
	<div class="container ">
		<div class="mt-16 flex flex-col items-center">
			<form class="form-control  items-center space-y-6 ">
				<button on:click={() => (step = 'basic')} class="btn btn-ghost"> Back </button>
				<div class="form-control w-2/3">
					<label class="label" for="ActicityLevel">
						<span class="label-text">Pick your activity level</span>
					</label>
					<select class="select bg-neutral" name="ActicityLevel" bind:value={user.activityLevel}>
						<option disabled selected>Pick one</option>
						<option value="sedentary">Sedentary (little or no exercise)</option>
						<option value="lightly active"> Lightly active (exercise 1–3 days/week) </option>
						<option value="moderately active"> Moderately active (exercise 3–5 days/week) </option>
						<option value="active"> Active (exercise 6–7 days/week) </option>
						<option value="very active"> Very active (hard exercise 6–7 days/week) </option>
					</select>
				</div>

				<div class="form-control w-2/3">
					<label class="label" for="Goal">
						<span class="label-text">Weight goal</span>
					</label>
					<select class="select bg-neutral" name="Goal" bind:value={user.goal}>
						<option disabled selected>Pick one</option>
						<option value="mild loss">Mild loss 0.25kgs/week</option>
						<option value="loss">Loss 0.5kgs/week</option>
						<option value="extreme loss">Extreme loss 1kgs/week</option>
						<option value="maintain">Maintain weigth</option>
						<option value="mild gain">Mild gain 0.25kgs/week</option>
						<option value="gain">gain 0.5kgs/week</option>
						<option value="extreme gain">Extreme gain 1kgs/week</option>
					</select>
				</div>
			</form>
		</div>
	</div>
	<div class="container fixed bottom-4 ">
		<button
			on:click|preventDefault={handleSubmitUser}
			class="btn btn-block bg-accent from-accent to-accent-focus text-accent-content shadow-accent/30  hover:shadow-accent-focus/30 border-0 bg-gradient-to-r shadow-lg"
		>
			Finish
		</button>
	</div>
{/if}
