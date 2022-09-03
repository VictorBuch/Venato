<script lang="ts" context="module">
	import { supabase } from '$lib/supabaseClient';
	import { user } from '../stores/userStore';
	import { get } from 'svelte/store';
	export const load: import('@sveltejs/kit').Load = async ({
		url,
		params,
		props,
		fetch,
		session,
		stuff,
		status,
		error
	}) => {
		const date = new Date();
		date.setDate(date.getDate() - 7);
		const { data } = await supabase
			.from('consumed_meals')
			.select('portion,meals(*), created_at')
			.match({ user_id: get(user)?.id })
			.gt('created_at', date.toISOString());
		console.log(data);
		if (data) {
			return {
				props: {
					consumed: data
				}
			};
		}
		return {
			error: new Error(`Could not load url`)
		};
	};
</script>

<script lang="ts">
	import CogOutline from 'svelte-material-icons/CogOutline.svelte';
	import WeightKilogram from 'svelte-material-icons/WeightKilogram.svelte';
	import Fire from 'svelte-material-icons/Fire.svelte';
	import CalendarToday from 'svelte-material-icons/CalendarToday.svelte';
	import type { Meal } from '../types/meals';
	import { getCaloriesProportionateToPortion } from '$lib/helpers';

	export let consumed: [Meal];

	$: averageCalories =
		consumed.reduce((acc, meal) => {
			return acc + getCaloriesProportionateToPortion(meal.meals, meal.portion);
		}, 0) / consumed.length || 0;

	function handleLogout() {
		supabase.auth.signOut();
	}
</script>

<section class="container bg-accent py-8 drop-shadow-md">
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
			<div class="dropdown-end dropdown ">
				<button tabindex="0">
					<CogOutline size="30" />
				</button>
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box w-52 bg-base-content p-2 text-base-100 shadow"
				>
					<a
						class="cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-300"
						href="/get-user-information"
					>
						Change User Information
					</a>
				</ul>
			</div>
		</div>
	</div>
</section>
<main class="container ">
	<div class="card my-8 w-full bg-neutral shadow-xl">
		<div class="card-body h-max">
			<div class="flex items-center space-x-8">
				<div class="avatar">
					<div class="mask mask-hexagon w-24">
						<img alt="avatar" src="https://api.lorem.space/image/face?hash=55350" />
					</div>
				</div>
				<div>
					<h2 class="card-title">{$user?.username || 'Simon'}</h2>
					<p>{$user?.age} years old</p>
				</div>
			</div>
			<div class="divider my-4" />

			<div class="stats !grid-flow-row shadow">
				<div class="stat place-items-center">
					<div class="stat-figure">
						<WeightKilogram size="30" />
					</div>
					<div class="stat-title">Weight</div>
					<div class="stat-value">{$user.weight} Kgs</div>
					{#if $user?.goal}
						<div class="stat-desc">Goal: {$user?.goal}</div>
					{/if}
				</div>

				<div class="stat place-items-center">
					<div class="stat-figure">
						<Fire size="30" />
					</div>
					<div class="stat-title">Average Calories Eaten</div>
					<div class="stat-value">{averageCalories}</div>
					<div class="stat-desc">↗︎ 400 (22%)</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-figure">
						<CalendarToday size="30" />
					</div>
					<div class="stat-title">Days Not Tracked</div>
					<div class="stat-value">17</div>
					<div class="stat-desc">↘︎ 3 (14%)</div>
				</div>
			</div>
		</div>
	</div>
</main>
