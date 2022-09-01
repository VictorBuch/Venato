import { user } from '../../stores/userStore'; // stores related to app state, auth state
import { get } from 'svelte/store';

export async function authGuardRedirect(url: { pathname: string }) {
	if (url.pathname !== '/') {
		return { redirect: '/', status: 304 };
	} else if (url.pathname === '/') {
		return { redirect: '/dashboard', status: 304 };
	}
}

export async function authGuard(url) {
	const storedUser = get(user);
	const logedIn = storedUser && Object.keys(storedUser).length > 0;

	if (!logedIn && url.pathname !== '/') {
		return true;
	} else if (logedIn && url.pathname === '/') {
		return true;
	} else {
		return false;
	}
}
