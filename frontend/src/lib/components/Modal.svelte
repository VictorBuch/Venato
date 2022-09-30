<script>
	import { isOverlayOpen } from '$lib/stores/overlayStore';
	import { scale, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const emitClose = () => dispatch('close');
	const handleClose = () => {
		emitClose();
		$isOverlayOpen = false;
	};
</script>

<div
	transition:fade={{ duration: 200, easing: cubicOut }}
	class="fixed inset-0 z-40 flex h-screen w-screen items-center justify-center bg-base-100 opacity-95"
/>
<div
	on:click={() => handleClose()}
	transition:scale={{ duration: 300, easing: cubicOut }}
	class="container fixed inset-0 z-50 flex h-screen w-screen items-center justify-center"
>
	<div on:click|stopPropagation class="min-h-16  h-max w-full">
		<div
			class="flex flex-col items-center justify-center rounded-t-md bg-gradient-to-bl from-primary-focus to-primary-focus p-2 text-primary-content"
		>
			<span class="text-md mb-4 font-light text-primary-content">
				<slot name="title" />
			</span>
			<span class="mb-2 w-full">
				<slot name="content" />
			</span>
		</div>
		<div class="flex items-center justify-center rounded-b-md bg-neutral p-2">
			<slot name="footer" />
		</div>
	</div>
</div>
