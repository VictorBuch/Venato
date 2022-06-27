<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import axios from 'axios';

	let name = '';
	let portion: number;
	let calories: number;
	let carbs: number;
	let protein: number;
	let fat: number;
	let barcode: string;

	let invalidInputs = false;

	const handleSubmit = async (e: MouseEvent) => {
		if (name && portion) {
			invalidInputs = false;
			try {
				const response = await axios.post(`http://fitness-journey.test/api/meals`, {
					name,
					portion,
					calories,
					carbs,
					protein,
					fat,
					barcode
				});

				if (response.status === 200) {
					toast.push('Meal added successfully!');
					setTimeout(() => {
						goto('/dashboard');
					}, 2500);

					// TODO: Ask if user wants to add another meal
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			invalidInputs = true;
		}
	};
</script>

<section class="bg-accent container py-8 drop-shadow-md">
	<div class=" flex h-full w-full items-center justify-center  ">
		<a href="/dashboard" class="mr-auto">
			<svg
				class="!stroke-accent-content h-6 w-6"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
		</a>
		<h1 class="text-accent-content ml-24 w-full text-xl font-bold">Add Food</h1>
	</div>
</section>
<div class="container mt-16 flex w-full flex-col items-center justify-center">
	<form class="flex w-full flex-col items-center space-y-4">
		<div class="flex w-full flex-col ">
			<label class="text-xl text-gray-200" for="name"> Name </label>
			<input
				type="text"
				name="Meal"
				class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
				bind:value={name}
			/>
		</div>
		<div class="flex w-full flex-col ">
			<label class="text-xl text-gray-200" for="Kcal"> Kcal </label>
			<input
				type="text"
				name="Kcal"
				class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
				bind:value={calories}
			/>
		</div>
		<div class="flex w-full flex-col ">
			<label class="text-xl text-gray-200" for="Carbs"> Carbs </label>
			<input
				type="text"
				name="Carbs"
				class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
				bind:value={carbs}
			/>
		</div>
		<div class="flex w-full flex-col ">
			<label class="text-xl text-gray-200" for="Protein">Protein </label>
			<input
				type="text"
				name="Protein"
				class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
				bind:value={protein}
			/>
		</div>
		<div class="flex w-full flex-col ">
			<label class="text-xl text-gray-200" for="Fat">Fat </label>
			<input
				type="text"
				name="Fat"
				class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
				bind:value={fat}
			/>
		</div>
		<div class="flex w-full flex-col ">
			<label class="text-xl text-gray-200" for="barcode">barcode </label>
			<input
				type="text"
				name="barcode"
				class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
				bind:value={barcode}
			/>
		</div>
		<div
			class="text-md  from-base-100 container fixed bottom-0 bg-gradient-to-t to-transparent pb-4"
		>
			<button on:click|preventDefault={handleSubmit} class=" btn-main "> Submit Meal </button>
		</div>
	</form>
</div>
