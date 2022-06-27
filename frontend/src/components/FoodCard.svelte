<script lang="ts">
	import PlusCircle from 'svelte-material-icons/PlusCircle.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title: string;
	export let calories: number;
	export let servingSize: string;
	export let remove: boolean;

	const clickFoodIcon = () => {
		dispatch('clickFoodIcon');
	};

	const customizeFoodItem = () => {
		dispatch('customizeFoodItem');
	};
</script>

<div
	class="bg-base-content  flex h-28 flex-col rounded-md border border-gray-400 shadow-lg"
	on:click={customizeFoodItem}
>
	<div class="flex h-full items-center py-3 px-2">
		<main class="ml-6 flex w-60 flex-col items-start  justify-center space-y-1">
			<h1 class=" text-base-300 w-full font-semibold">{title}</h1>
			<p class="text-base-100 w-full truncate text-xs ">
				{calories} kcal
			</p>
			<p class="text-base-100 w-full truncate text-xs ">
				{servingSize}
			</p>
		</main>
		<figure class:rotate-45={remove} class="text-base-300 ml-auto mr-4" on:click={clickFoodIcon}>
			<PlusCircle size={'25'} />
		</figure>
	</div>
</div>
