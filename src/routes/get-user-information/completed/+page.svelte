<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	onMount(() => {
		animate = true;
		setTimeout(() => {
			goto('/dashboard');
		}, 3300);
	});
	let animate = false;
</script>

<div
	out:fade={{ duration: 2000, easing: cubicOut }}
	class="flex h-screen w-screen flex-col items-center justify-center  bg-gradient-to-l from-accent-focus to-accent "
>
	<div class="container space-y-12 text-center">
		{#if animate}
			<h1
				in:fly={{ duration: 500, easing: cubicOut, y: window.innerHeight }}
				class="text-6xl font-semibold text-accent-content"
			>
				Thank you!
			</h1>
			<p
				in:fly={{ duration: 500, delay: 1200, easing: cubicOut, y: window.innerHeight }}
				class="text-2xl font-light text-accent-content"
			>
				This is a geat first step
			</p>
			<p
				in:fly={{ duration: 500, delay: 2400, easing: cubicOut, y: window.innerHeight }}
				class="text-lg font-light text-accent-content"
			>
				Let's go!
			</p>
		{/if}
	</div>
</div>
