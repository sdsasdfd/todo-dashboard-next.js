"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { headers } from "next/headers";


export const signInWithGoogle = async () => {
  const origin = (await headers()).get("origin");
  const supabase = createClient();
  console.log("origin ::", origin);

  const { data,error } = await (
    await supabase
  ).auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

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

