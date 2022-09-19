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
					fat
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

<div class="container">
	<section class="flex h-screen w-full flex-col items-center justify-center">
		<form class="flex flex-col items-center space-y-4">
			<div class="flex flex-col items-center">
				<label class="text-xl text-gray-200" for="name"> Name </label>
				{#if invalidInputs}
					<p class="text-red-500">Please fill this field</p>
				{/if}
				<input
					class={`mt-2 w-full border border-gray-400 p-2 text-gray-800 rounded${
						invalidInputs ? ' border-red-500' : 'border-none'
					}`}
					required
					type="text"
					name="name"
					bind:value={name}
				/>
			</div>
			<div class="flex flex-col items-center">
				<label class="text-xl text-gray-200" for="portion"> Portion </label>
				{#if invalidInputs}
					<p class="text-red-500">Please fill this field</p>
				{/if}
				<div class="flex items-center">
					<input
						class={`mt-2 w-full border border-gray-400 p-2 text-gray-800 rounded${
							invalidInputs ? ' border-red-500' : 'border-none'
						}`}
						type="number"
						name="portion"
						bind:value={portion}
						required
					/>
				</div>
			</div>
			<div class="flex flex-col items-center">
				<label class="text-xl text-gray-200" for="calories"> Calories </label>
				<input
					class="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
					type="number"
					value={calories}
					name="calories"
				/>
			</div>
			<div class="flex flex-col items-center">
				<label class="text-xl text-gray-200" for="carbs"> Carbs </label>
				<input
					class="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
					type="number"
					value={carbs}
					name="carbs"
				/>
			</div>
			<div class="flex flex-col items-center">
				<label class="text-xl text-gray-200" for="protein"> Protein </label>
				<input
					class="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
					type="number"
					value={protein}
					name="protein"
				/>
			</div>
			<div class="flex flex-col items-center">
				<label class="text-xl text-gray-200" for="fat">Fat</label>
				<input
					class="mt-2 w-full rounded border border-gray-400 p-2 text-gray-800"
					type="number"
					value={fat}
					name="fat"
				/>
			</div>
			<div>
				<button
					on:click|preventDefault={handleSubmit}
					class=" !mt-8 w-full rounded-md bg-primary px-4 py-3"
				>
					Submit meal
				</button>
			</div>
		</form>
	</section>
</div>
