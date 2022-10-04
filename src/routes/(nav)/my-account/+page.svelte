<script lang="ts">
	import { onMount } from 'svelte';
	import CogOutline from 'svelte-material-icons/CogOutline.svelte';
	import WeightKilogram from 'svelte-material-icons/WeightKilogram.svelte';
	import Fire from 'svelte-material-icons/Fire.svelte';
	import CalendarToday from 'svelte-material-icons/CalendarToday.svelte';
	import type { Meal } from '$lib/types/meals';
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import { isOverlayOpen } from '$lib/stores/overlayStore';
	import Modal from '$lib/components/Modal.svelte';
	import { updateUserCaloriesAndMacros } from '$lib/calculateCaloricIntake';

	const fetchStats = async () => {
		const seven = new Date();
		seven.setDate(seven.getDate() - 7);
		const six = new Date();
		six.setDate(six.getDate() - 6);
		const five = new Date();
		five.setDate(five.getDate() - 5);
		const four = new Date();
		four.setDate(four.getDate() - 4);
		const three = new Date();
		three.setDate(three.getDate() - 3);
		const two = new Date();
		two.setDate(two.getDate() - 2);
		const one = new Date();
		one.setDate(one.getDate() - 1);
		const { data } = await supabase
			.from('consumed_meals')
			.select('portion,meals(*), created_at')
			.match({ user_id: $user?.id })
			.gt('created_at', seven.toISOString());

		// make a new object with numbers one to seven where each entry is withing the date range of the day before and after
		const week = {
			seven: data?.filter((item) => {
				return new Date(item.created_at) > seven && new Date(item.created_at) < six;
			}),
			six: data?.filter((item) => {
				return new Date(item.created_at) > six && new Date(item.created_at) < five;
			}),
			five: data?.filter((item) => {
				return new Date(item.created_at) > five && new Date(item.created_at) < four;
			}),
			four: data?.filter((item) => {
				return new Date(item.created_at) > four && new Date(item.created_at) < three;
			}),
			three: data?.filter((item) => {
				return new Date(item.created_at) > three && new Date(item.created_at) < two;
			}),
			two: data?.filter((item) => {
				return new Date(item.created_at) > two && new Date(item.created_at) < one;
			}),
			one: data?.filter((item) => {
				return new Date(item.created_at) > one && new Date(item.created_at) < new Date();
			})
		};

		// create an object with the average calories for each day
		const calories = {
			seven: week.seven?.reduce((acc, item) => {
				return acc + (item.portion / item.meals.portion) * item.meals.calories;
			}, 0),
			six: week.six?.reduce((acc, item) => {
				return acc + (item.portion / item.meals.portion) * item.meals.calories;
			}, 0),
			five: week.five?.reduce((acc, item) => {
				return acc + (item.portion / item.meals.portion) * item.meals.calories;
			}, 0),
			four: week.four?.reduce((acc, item) => {
				return acc + (item.portion / item.meals.portion) * item.meals.calories;
			}, 0),
			three: week.three?.reduce((acc, item) => {
				return acc + (item.portion / item.meals.portion) * item.meals.calories;
			}, 0),
			two: week.two?.reduce((acc, item) => {
				return acc + (item.portion / item.meals.portion) * item.meals.calories;
			}, 0),
			one: week.one?.reduce((acc, item) => {
				return acc + (item.portion / item.meals.portion) * item.meals.calories;
			}, 0)
		};

		// create a new object with the average of the overall calories
		const averages = {
			seven: calories.seven / week.seven?.length,
			six: calories.six / week.six?.length,
			five: calories.five / week.five?.length,
			four: calories.four / week.four?.length,
			three: calories.three / week.three?.length,
			two: calories.two / week.two?.length,
			one: calories.one / week.one?.length
		};

		const totalAverage = [];

		for (const key in averages) {
			if (!isNaN(averages[key])) {
				totalAverage.push(averages[key]);
			}
		}

		const total =
			totalAverage.reduce((acc, item) => {
				return acc + item;
			}, 0) / totalAverage.length;

		// find out how many days since the user last tracked a meal
		const last = new Date(data?.[data.length - 1]?.created_at);
		const today = new Date();
		const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
		if (data) {
			consumed = data;
			average = isNaN(total) ? 'No data' : Math.ceil(total);
			days = isNaN(diff) ? 'No data' : diff;
		}
	};

	let statsPromise = fetchStats();

	let consumed: [Meal];
	let average: number | string;
	let days: number | string;

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			$user = null;
			goto('/');
		}
	};

	let weightModal = false;
	let heightModal = false;
	let backupWeight = 0;
	let backupHeight = 0;
	const toggleWeightModal = () => {
		if (weightModal) {
			$user.weight = backupWeight;
		} else {
			backupWeight = $user.weight;
		}
		weightModal = !weightModal;
		$isOverlayOpen = weightModal;
	};

	const toggleHeightModal = () => {
		if (heightModal) {
			$user.height = backupHeight;
		} else {
			backupHeight = $user.height;
		}
		heightModal = !heightModal;
		$isOverlayOpen = heightModal;
	};

	const handleSaveChanges = async () => {
		const { data, error } = await updateUserCaloriesAndMacros();
		if (!error) {
			weightModal = false;
			heightModal = false;
			$isOverlayOpen = false;
		}
	};
</script>

<svelte:head>
	<title>Venato | My Account</title>
</svelte:head>
<section class="container z-20 rounded-b-md bg-accent py-4 drop-shadow-md">
	<div class=" flex h-full w-full  items-center justify-between space-x-2">
		<a href="/dashboard">
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
		</a>
		<h1 class="w-max text-xl font-bold text-accent-content">Profile</h1>
		<div class="ml-auto h-max w-max">
			<div class="dropdown-end dropdown z-50 ">
				<button tabindex="0">
					<CogOutline size="30" />
				</button>
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box !z-50 w-52 bg-base-content p-2 text-base-100 shadow"
				>
					<button on:click={logout} class="cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-300">
						Logout
					</button>
				</ul>
			</div>
		</div>
	</div>
</section>
<main class="container bg-base-100">
	<div class="card static my-8 block w-full bg-neutral shadow-xl">
		<div class="card-body h-max">
			<div class="flex items-center space-x-8">
				<div class="avatar">
					<div class="mask mask-hexagon w-24">
						<img alt="avatar" src="https://api.lorem.space/image/face?hash=55350" />
					</div>
				</div>
				<div>
					<input
						type="text"
						bind:value={$user.username}
						on:blur={() => updateUserCaloriesAndMacros()}
						class="card-title w-full appearance-none truncate bg-transparent text-neutral-content outline-none ring-transparent focus:outline-none focus:ring-transparent"
					/>
					<p>{$user?.age} years old</p>
				</div>
			</div>
			<div class="divider mt-4 mb-2" />
			<p class="text-md mb-2 font-semibold text-neutral-content">Stats</p>
			<div class="stats !grid-flow-row shadow">
				<div class="stat place-items-center">
					<div class="stat-figure">
						<WeightKilogram size="30" />
					</div>
					<div class="stat-title">Weight</div>
					<div class="stat-value ">{$user.weight}</div>
					{#if $user?.goal}
						<div class="stat-desc">
							Goal: {$user?.goal === 'maintain' ? 'maintain' : $user?.desired_weight + 'Kgs'}
						</div>
					{/if}
				</div>

				{#await statsPromise}
					<div class="stat place-items-center">
						<div class="stat-figure">
							<Fire size="30" />
						</div>
						<div class="stat-title">Average Calories Eaten</div>
						<div class="stat-value animate-pulse h-12 w-32 bg-gray-500 rounded-md" />
						<!-- <div class="stat-desc">↗︎ 400 (22%)</div> -->
					</div>

					<div class="stat place-items-center">
						<div class="stat-figure">
							<CalendarToday size="30" />
						</div>
						<div class="stat-title">Days Not Tracked</div>
						<div class="stat-value animate-pulse  h-12 w-32 bg-gray-500 rounded-md" />
						<!-- <div class="stat-desc">↘︎ 3 (14%)</div> -->
					</div>
				{:then stats}
					<div class="stat place-items-center">
						<div class="stat-figure">
							<Fire size="30" />
						</div>
						<div class="stat-title">Average Calories Eaten</div>
						<div class="stat-value">{average}</div>
						<!-- <div class="stat-desc">↗︎ 400 (22%)</div> -->
					</div>

					<div class="stat place-items-center">
						<div class="stat-figure">
							<CalendarToday size="30" />
						</div>
						<div class="stat-title">Days Not Tracked</div>
						<div class="stat-value">{days}</div>
						<!-- <div class="stat-desc">↘︎ 3 (14%)</div> -->
					</div>
				{:catch error}
					<p>Error: {error.message}</p>
				{/await}
			</div>
			<p class="text-md mt-4 mb-2 font-semibold text-neutral-content">Customization</p>
			<div class="rounded-md bg-base-100 p-3 shadow">
				<a
					class="flex w-full cursor-pointer select-none items-center justify-between p-1 text-left"
					href="/get-user-information/goal"
				>
					<p>Goal:</p>
					<p class="text-sm font-light text-gray-400">{$user.goal}</p>
				</a>
				<div class="divider m-0" />

				<a
					class="flex w-full cursor-pointer select-none items-center justify-between p-1 text-left"
					href="/get-user-information/activity"
				>
					<p>Activity Level</p>
					<p class="text-sm font-light text-gray-400">{$user.activity_level}</p>
				</a>
				<div class="divider m-0" />
				<button
					on:click={() => toggleWeightModal()}
					class="flex w-full cursor-pointer select-none items-center justify-between p-1 text-left"
				>
					<p>Weight</p>
					<p class="text-sm font-light text-gray-400">{$user.weight} kgs</p>
				</button>
				<div class="divider m-0" />
				<button
					on:click={() => toggleHeightModal()}
					class="flex w-full cursor-pointer select-none items-center justify-between p-1 text-left"
				>
					<p>Height</p>
					<p class="text-sm font-light text-gray-400">{$user.height} cm</p>
				</button>
			</div>
		</div>
	</div>
</main>
{#if $isOverlayOpen}
	{#if weightModal}
		<Modal on:close={() => toggleWeightModal()}>
			<h1 slot="title">Track weight</h1>
			<div slot="content" class="flex w-full items-center justify-between px-4">
				<div
					on:click={() => {
						$user.weight -= 0.2;
						// fix floating point math inaccuracy
						$user.weight = Math.round($user.weight * 10) / 10;
					}}
					class="flex aspect-square h-7 w-7 items-center justify-center rounded-full border border-solid border-accent-content "
				>
					-
				</div>
				<p class="text-3xl font-semibold text-accent-content">
					{$user.weight}
				</p>
				<div
					on:click={() => {
						$user.weight += 0.2;
						// fix floating point math inaccuracy
						$user.weight = Math.round($user.weight * 10) / 10;
					}}
					class="flex aspect-square h-7 w-7 items-center justify-center rounded-full border border-solid border-accent-content "
				>
					+
				</div>
			</div>
			<button
				class=" rounded-lg bg-gradient-to-tl from-accent to-accent px-8 py-2"
				slot="footer"
				on:click={() => handleSaveChanges()}
			>
				Save changes
			</button>
		</Modal>
	{:else if heightModal}
		<Modal on:close={() => toggleHeightModal()}>
			<h1 slot="title">Height</h1>
			<div slot="content" class="flex w-full items-center justify-between px-4">
				<div
					on:click={() => {
						$user.height -= 1;
						// fix floating point math inaccuracy
						$user.height = Math.round($user.height * 10) / 10;
					}}
					class="flex aspect-square h-7 w-7 items-center justify-center rounded-full border border-solid border-accent-content "
				>
					-
				</div>
				<p class="text-3xl font-semibold text-accent-content">
					{$user.height}
				</p>
				<div
					on:click={() => {
						$user.height += 1;
						// fix floating point math inaccuracy
						$user.height = Math.round($user.height * 10) / 10;
					}}
					class="flex aspect-square h-7 w-7 items-center justify-center rounded-full border border-solid border-accent-content "
				>
					+
				</div>
			</div>
			<button
				class="rounded-lg bg-gradient-to-tl from-accent to-accent px-8 py-2"
				slot="footer"
				on:click={() => handleSaveChanges()}
			>
				Save changes
			</button>
		</Modal>
	{/if}
{/if}
