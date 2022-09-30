<script lang="ts">
	export let title: string;
	export let calories: number;
	export let tags: string[] | undefined;
	export let recipieId: number;
</script>

<div class="card h-max w-44 bg-neutral shadow">
	<figure><img src="https://api.lorem.space/image/shoes?w=400&h=300" alt="Shoes" /></figure>
	<div class="card-body !p-4">
		<h2 class="font-ligh w-fullt mb-2  break-all text-sm  text-neutral-content line-clamp-2">
			{title}
		</h2>
		<p class="font-semi-bold text-base text-neutral-content">{calories} Kcal</p>
		{#if tags && tags.length}
			<div class="card-actions !mt-2 justify-start truncate">
				{#each tags as tag}
					<div class="badge badge-outline !text-2xs">{tag}</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
