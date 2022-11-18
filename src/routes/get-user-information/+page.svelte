<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { onMount } from 'svelte';
	onMount(() => ($user = { ...$user, firstTimeSetup: true }));
</script>

<title>Venato | Welcome!</title>

<div
	class="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-l from-accent-focus to-accent "
>
	<div class="container space-y-16 ">
		<h1 class="text-4xl font-medium text-accent-content">Welcome to Venato</h1>
		<p class="text-md font-light text-accent-content">
			This is where your health journey begins. With this you can keep track of your eating habbits
			in a better way and get organized. Remember getting healthy is not a goal but a journey! Good
			luck
		</p>
		<a href="/get-user-information/goal" class="btn-main">Lets get started!</a>
	</div>
</div>
