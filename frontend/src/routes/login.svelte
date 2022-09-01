<script lang="ts">
	import { supabase } from '../lib/supabaseClient';
	import { toast } from '@zerodevx/svelte-toast';

	let email = '';
	let loading = false;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			toast.push(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};
</script>

<div class="mx-auto h-screen w-3/4 ">
	<div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div>
				<img
					class="mx-auto h-12 w-auto rounded-full bg-accent !fill-accent p-2"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
					alt="Workflow"
				/>
				<h2 class="mt-6 text-center text-2xl font-extrabold text-gray-100">
					Sign in to your account
				</h2>
			</div>
			<form on:submit|preventDefault={handleLogin} class="mt-8 space-y-6">
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
							class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
							placeholder="Email address"
						/>
					</div>
				</div>

				<button type="submit" class="btn-main"> Sign in </button>
				<!-- <div class="flex justify-center text-sm"> -->
				<!-- 	<a href="/forgot" class="font-medium text-neutral-content"> Forgot your password? </a> -->
				<!-- </div> -->
				<!-- <a -->
				<!-- 	href="/signup" -->
				<!-- 	class=" flex items-start justify-center text-center text-sm text-accent-focus" -->
				<!-- > -->
				<!-- 	Sign up -->
				<!-- </a> -->
			</form>
		</div>
	</div>
</div>
