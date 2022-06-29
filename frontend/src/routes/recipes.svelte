<script lang="ts" context="module">
</script>

<script lang="ts">
	import RecipeCard from '../components/recipeCard.svelte';
	import DotsVertical from 'svelte-material-icons/DotsVertical.svelte';
	import { fly } from 'svelte/transition';

	let mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
	let recipes = ['Fried rice', 'Mashed potatoes', 'Chicken soup', 'Pancakes'];
	let searchQuery = '';
</script>

<section class="bg-accent container py-8 drop-shadow-md">
	<div class=" flex h-full w-full  items-center justify-between space-x-2">
		<a href="/dashboard">
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
		<h1 class="text-accent-content w-max text-xl font-bold">Find Recipes</h1>
		<div class="ml-auto h-max w-max" />
	</div>
	<div class="mt-6 flex items-center justify-center space-x-2">
		<div class="form-control w-full">
			<div class="input-group">
				<input
					type="text"
					placeholder="Search…"
					bind:value={searchQuery}
					class="input input-bordered bg-accent-content w-full !text-black placeholder:text-gray-700"
				/>
				<button class="btn btn-square">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
	{#if searchQuery.length}
		<div
			transition:fly
			class="badge mt-4  gap-2 !p-3 uppercase"
			on:click={() => (searchQuery = '')}
		>
			{searchQuery}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-4 w-4 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/></svg
			>
		</div>
	{/if}
</section>
<main class="overflow-x-hidden py-8">
	{#if searchQuery.length}
		<div class="container grid grid-cols-2 gap-4">
			{#each recipes as recipe}
				<RecipeCard
					title={recipe}
					calories={Math.floor(Math.random() * 100)}
					tags={['breakfast', 'lunch', 'dinner', 'snacks']}
					recipieId={Math.floor(Math.random() * 100)}
				/>
			{/each}
		</div>
	{:else}
		{#each mealTypes as meal}
			<div class="container flex items-center justify-between">
				<h1 class="text-base-content font-semibold uppercase">{meal}</h1>
				<a class="flex items-center space-x-4" href="/recipes/{meal}">
					<p class="text-accent font-semibold">See All</p>
					<svg
						class="!stroke-accent  h-6 w-6 rotate-180"
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
			</div>
			<div class="carousel carousel-center rounded-box m-2 max-w-md space-x-2 pb-4 pt-2">
				{#each recipes as recipe}
					<div class="carousel-item">
						<RecipeCard title={recipe} calories={300} recipieId={Math.ceil(Math.random() * 1000)} />
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</main>
