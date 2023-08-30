export const actions = {
    default: async ({ locals }) => {
        await locals.session.destroy();
        return {};
    }
}
