<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import axios from 'axios';

	let email = '';
	let password = '';
	let passwordConfirmation = '';

	const handleSignup = async () => {
		const response = await axios.post('http://fitness-journey.test/api/auth/register', {
			email,
			password,
			password_confirmation: passwordConfirmation
		});

		if (response.status === 200) {
			toast.push('Successfully signed up!');
			setTimeout(() => {
				goto('/');
			}, 2000);
		}
	};
</script>

<div class="mx-auto h-screen w-3/4 ">
	<div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div>
				<img
					class="mx-auto h-12 w-auto"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
					alt="Workflow"
				/>
				<div class="flex items-center space-x-4">
					<a href="/">
						<svg class="h-5 w-10 rotate-90">
							<path
								d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
								fill="#fff"
							/>
						</svg>
					</a>
					<h2 class="mt-6 text-center text-2xl font-extrabold text-gray-100">
						Register Account To Start Getting Yolked
					</h2>
				</div>
			</div>
			<form class="mt-8 space-y-6">
				<input type="hidden" name="remember" />
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
							class="relative mb-4 block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 invalid:ring-red-400  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
							class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							placeholder="Password"
						/>
					</div>
					<div>
						<label for="password" class="sr-only"> Confirm Password </label>
						<input
							id="confirm-password"
							name="confirm-password"
							type="password"
							bind:value={passwordConfirmation}
							required
							class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							placeholder="Confirm Password"
						/>
					</div>
				</div>

				<div>
					<button
						on:click|preventDefault={handleSignup}
						type="submit"
						class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-5 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800"
					>
						Sign in
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
