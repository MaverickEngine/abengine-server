import { handleSession } from 'svelte-kit-cookie-session';
import {SECRET_KEY} from '$env/static/private'

export const handle = handleSession({
	secret: SECRET_KEY,
});
