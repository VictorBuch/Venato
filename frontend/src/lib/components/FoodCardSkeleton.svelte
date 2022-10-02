<script>
	import PlusCircle from 'svelte-material-icons/PlusCircle.svelte';
</script>

<div class="flex  h-28 w-full animate-pulse flex-col rounded-md bg-gray-100 shadow-lg">
	<div class="flex h-full items-center py-3 px-2">
		<div class="ml-6 flex w-60 flex-col items-start  justify-center space-y-1">
			<div class="flex items-center space-x-1">
				<h1 class=" h-6 w-28 animate-pulse rounded-md bg-gray-300 font-semibold text-base-300" />
			</div>
			<p class="h-4 w-14 animate-pulse truncate rounded-md bg-gray-300 text-xs text-base-100 " />
			<p class="h-4 w-14 animate-pulse truncate rounded-md bg-gray-300 text-xs text-base-100" />
		</div>
		<figure class="ml-auto mr-4 text-base-300">
			<PlusCircle size={'25'} />
		</figure>
	</div>
</div>
