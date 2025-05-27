"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { headers } from "next/headers";

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  return url
}


export const signInWithGoogle = async () => {
  const origin = (await headers()).get("origin");
  const supabase = createClient();
  console.log("origin ::", origin);

  const { data,error } = await (
    await supabase
  ).auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getURL()}/auth/callback`,
    },
  });

  console.log("data after signing in with Google :: ", data);
  console.log("error after signing in with Google :: ", error);

  if (error) {
    console.error("Error signing in with Google:", error.message);
    redirect("/login");
  }
  if(data?.url) {
    console.log("Redirecting to Google OAuth URL:", data.url);
    redirect(data.url);
  } else {
    console.error("No redirect URL returned from Supabase.");
    redirect("/login");
  }
};

