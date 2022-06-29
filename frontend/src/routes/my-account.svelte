<script lang="ts" context="module">
</script>

<script lang="ts">
	import CogOutline from 'svelte-material-icons/CogOutline.svelte';
	import WeightKilogram from 'svelte-material-icons/WeightKilogram.svelte';
	import Fire from 'svelte-material-icons/Fire.svelte';
	import CalendarToday from 'svelte-material-icons/CalendarToday.svelte';
</script>

<section class="bg-accent container py-8 drop-shadow-md">
	<div class=" flex h-full w-full  items-center justify-between space-x-2">
		<a href="/dashboard">
			<svg
				class="!stroke-accent-content h-6 w-6"
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
		<h1 class="text-accent-content w-max text-xl font-bold">Profile</h1>
		<div class="ml-auto h-max w-max">
			<div class="dropdown dropdown-end">
				<button tabindex="0">
					<CogOutline size="30" />
				</button>
				<ul
					tabindex="0"
					class="dropdown-content menu bg-base-content text-base-100 rounded-box w-52 p-2 shadow"
				>
					<li>Under construction</li>
				</ul>
			</div>
		</div>
	</div>
</section>
<section class="container">
	<div class="card bg-neutral my-8 w-full shadow-xl">
		<div class="card-body h-max">
			<div class="flex items-center space-x-8">
				<div class="avatar">
					<div class="mask mask-hexagon w-24">
						<img alt="avatar" src="https://api.lorem.space/image/face?hash=55350" />
					</div>
				</div>
				<div>
					<h2 class="card-title">Name</h2>
					<p>Age years old</p>
				</div>
			</div>
			<div class="divider my-4" />

			<div class="stats !grid-flow-row shadow">
				<div class="stat place-items-center">
					<div class="stat-figure">
						<WeightKilogram size="30" />
					</div>
					<div class="stat-title">Weight</div>
					<div class="stat-value">300 Kgs</div>
					<div class="stat-desc">80% towards goal</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-figure">
						<Fire size="30" />
					</div>
					<div class="stat-title">Average Calories Eaten</div>
					<div class="stat-value">4,200 Kcal</div>
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
</section>
