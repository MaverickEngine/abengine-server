import { redirect }  from "@sveltejs/kit"

export async function load({ cookies }) {
    cookies.set("token", "");
    redirect(307, "/dashboard/login")
}