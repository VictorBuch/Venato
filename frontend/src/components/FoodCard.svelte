<script lang="ts">
	import PlusCircle from 'svelte-material-icons/PlusCircle.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title: string;
	export let calories: number;
	export let servingSize: number;
	export let remove: boolean;

	const clickFoodIcon = () => {
		dispatch('clickFoodIcon');
	};

	const customizeFoodItem = () => {
		dispatch('customizeFoodItem');
	};
</script>

<div class="flex  h-28 flex-col rounded-md border border-gray-400 bg-base-content shadow-lg">
	<div class="flex h-full items-center py-3 px-2" on:click={customizeFoodItem}>
		<div class="ml-6 flex w-60 flex-col items-start  justify-center space-y-1">
			<h1 class=" w-full font-semibold text-base-300">{title}</h1>
			<p class="w-full truncate text-xs text-base-100 ">
				{calories} kcal
			</p>
			<p class="w-full truncate text-xs text-base-100 ">
				{servingSize}
			</p>
		</div>
		<figure
			class:rotate-45={remove}
			class="ml-auto mr-4 text-base-300"
			on:click|stopPropagation={clickFoodIcon}
		>
			<PlusCircle size={'25'} />
		</figure>
	</div>
</div>
