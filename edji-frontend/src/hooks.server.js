import { handleSession } from 'svelte-kit-cookie-session';
import {SECRET_KEY} from '$env/static/private'

function redirect(location, body) {
    return new Response(body, {
        status: 303,
        headers: { location }
    });
}

export const handle = handleSession({
	secret: SECRET_KEY,
});
