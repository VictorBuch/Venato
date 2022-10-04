<script>
	import { user } from '$lib/stores/userStore';
	import { get } from 'svelte/store';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	supabase.auth.onAuthStateChange(async (_, session) => {
		await getUser();
	});

	async function getUser() {
		console.log('here');
		try {
			const db_user = await supabase.auth.user();
			const { data, error } = await supabase
				.from('profiles')
				.select()
				.eq('id', db_user?.id)
				.single();
			if (data) {
				user.set({ ...data, id: db_user?.id });
				if ($user.calorie_goal) {
					goto('/dashboard');
				} else {
					goto('/get-user-information');
				}
			}
			if (error) {
				try {
					const { data, error } = await supabase.from('profiles').insert({
						id: db_user?.id,
						updated_at: db_user?.updated_at
					});
				} catch (e) {
					console.log(e);
				}
			}
		} catch (error) {
			alert(error.message);
		} finally {
			if (!Object.keys(get(user)).length) {
				goto('/login');
			}
		}
	}

	onMount(async () => {
		await getUser();
	});
</script>
