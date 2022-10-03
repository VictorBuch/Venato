<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';

	const handleNext = () => {
		if ($user.username && $user.age && $user.height && $user.sex) {
			goto('/get-user-information/weight');
		} else {
			console.log($user);
			alert('you must have valid inputs');
		}
	};
</script>

<svelte:head>
	<title>Venato | Basic Information</title>
</svelte:head>
<template>
	<section class="container z-20 bg-accent-focus py-4 drop-shadow-md">
		<div class=" flex h-full w-full  items-center space-x-2">
			<button on:click={() => window.history.back()}>
				<svg
					class="h-6 w-6 !stroke-accent-content"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
			</button>
			<h1 class="w-max text-xl font-bold text-accent-content">Basic Information</h1>
		</div>
	</section>
	<div class="container h-screen w-screen bg-gradient-to-t from-accent to-accent-focus">
		<main class="flex flex-col items-center justify-center pt-24">
			<h1 class="text-center text-xl font-medium text-accent-content">
				We need some basic information from you to get started!
			</h1>
			<div class="mt-12 flex w-full flex-col items-center justify-center space-y-12">
				<div
					class="flex w-full items-end justify-between space-x-8 border-b border-solid border-base-100"
				>
					<label for="name" class="text-accent-content">Name:</label>
					<input
						bind:value={$user.username}
						type="text"
						id="name"
						placeholder="Type here"
						class="w-full bg-transparent text-end text-accent-content outline-none ring-0 placeholder:text-white/50 focus:outline-none focus:ring-0"
					/>
				</div>
				<div
					class="flex w-full items-end justify-between space-x-8 border-b border-solid border-base-100"
				>
					<label for="name" class="text-accent-content">Age:</label>
					<input
						bind:value={$user.age}
						type="number"
						min="1"
						max="100"
						id="name"
						placeholder="Type here"
						class="w-full bg-transparent text-end text-accent-content outline-none ring-0 placeholder:text-white/50 focus:outline-none focus:ring-0"
					/>
				</div>
				<div
					class="flex w-full items-end justify-between space-x-8 border-b border-solid border-base-100"
				>
					<label for="name" class="text-accent-content">Height:</label>
					<div class="flex w-full items-center space-x-1">
						<input
							bind:value={$user.height}
							type="number"
							min="1"
							max="300"
							id="name"
							placeholder="Type here"
							class="w-full bg-transparent text-end text-accent-content outline-none ring-0 placeholder:text-white/50 focus:outline-none focus:ring-0"
						/>
						<p>cm</p>
					</div>
				</div>
				<div
					class="flex w-full items-end justify-between space-x-8 border-b border-solid border-base-100"
				>
					<label for="name" class="text-accent-content">Sex:</label>
					<select
						bind:value={$user.sex}
						class="select !h-max !min-h-max bg-transparent text-end text-accent-content outline-none ring-0 placeholder:text-white/50 focus:outline-none focus:ring-0"
					>
						<option class:selected={$user.sex == 'male'} value="male">Male</option>
						<option class:selected={$user.sex == 'female'} value="female">Female</option>
					</select>
				</div>
			</div>
		</main>
	</div>
	<div class="text-md  container fixed bottom-0  pb-4">
		<button on:click|preventDefault={handleNext} class=" btn-main ">Next step</button>
	</div>
</template>
