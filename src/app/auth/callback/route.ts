import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }
  console.log("origin::", origin)

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.log("Error fetching user data: ", userError.message);
        return NextResponse.redirect(`${origin}/error`);
      }
      const user = userData.user
      // console.log('user::', data)
      const { data: existingUser, error:fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user?.email)
        .maybeSingle();

 if (fetchError) {
    console.error("Error checking user existence: ", fetchError.message);
    return NextResponse.redirect(`${origin}/error`);
  }
      if (!existingUser) {
        console.log('user not existed')
        const { error: dbError } = await supabase.from("users").insert({
          email: user?.email,
          full_name: user?.user_metadata.full_name,
          status: 'active'
        }) 
      

        if (dbError) {
          console.log("Error inserting user data: ", dbError.message);
          return NextResponse.redirect(`${origin}/error`);
        }

      } 
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
