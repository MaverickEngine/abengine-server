export function handle({ event, resolve }) {
	event.locals.token = event.cookies.get('token');
	return resolve(event);
}