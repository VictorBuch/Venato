<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '../stores/userStore';
	import { toast } from '@zerodevx/svelte-toast';
	import API from '../services/Api';

	let email = '';
	let password = '';

	const login = async () => {
		// const response = await API.post('/auth/login', {
		// 	email,
		// 	password
		// });
		// console.log(response);

		// if (response.user !== null) {
		// 	$user = {
		// 		...response.user,
		// 		authed: true
		// 	};
		// 	window.localStorage.setItem('token', response.access_token);
		// 	console.log($user);

		// 	goto('/dashboard');
		// } else {
		// 	toast.push('Invalod email or password');
		// }
		const response = await fetch('http://localhost:3004/user');

		if (response.ok) {
			const serverUser = await response.json();
			$user = {
				...serverUser,
				authed: true
			};

			if ($user.calorie_goal !== null) {
				goto('/dashboard');
			} else {
				goto('/get-user-information');
			}
		} else {
			toast.push('Invalod email or password', {
				theme: {
					'--toastBackground': '#F56565',
					'--toastBarBackground': '#C53030'
				}
			});
		}
	};

	const handleLogin = async (e: MouseEvent) => {
		login();
	};
</script>

<div class="mx-auto h-screen w-3/4 ">
	<div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
		<div class="w-full max-w-md space-y-8">
			<div>
				<img
					class="bg-accent !fill-accent mx-auto h-12 w-auto rounded-full p-2"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
					alt="Workflow"
				/>
				<h2 class="mt-6 text-center text-2xl font-extrabold text-gray-100">
					Sign in to your account
				</h2>
			</div>
			<form class="mt-8 space-y-6">
				<input type="hidden" name="remember" default={true} />
				<div class="-space-y-px rounded-md shadow-md">
					<div>
						<label for="email-address" class="sr-only"> Email address </label>
						<input
							id="email-address"
							name="email"
							type="email"
							bind:value={email}
							autoComplete="email"
							required
							class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							placeholder="Email address"
						/>
					</div>
					<div>
						<label for="password" class="sr-only"> Password </label>
						<input
							id="password"
							name="password"
							type="password"
							bind:value={password}
							autoComplete="current-password"
							required
							class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							placeholder="Password"
						/>
					</div>
				</div>

				<button on:click|preventDefault={handleLogin} type="submit" class="btn-main">
					Sign in
				</button>
				<div class="flex justify-center text-sm">
					<a href="/forgot" class="text-neutral-content font-medium"> Forgot your password? </a>
				</div>
				<a
					href="/signup"
					class=" text-accent-focus flex items-start justify-center text-center text-sm"
				>
					Sign up
				</a>
			</form>
		</div>
	</div>
</div>
