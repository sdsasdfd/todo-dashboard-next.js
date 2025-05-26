import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();

  const body = await req.json();

  const { email, password } = body;

  console.log("body of login :: ", body);

  if (!email || !password) {
    return NextResponse.json(
      { message: "All fields are required", success: false },
      { status: 400 }
    );
  }

  const { error: errorMsy } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (errorMsy) {
    return NextResponse.json(
      { message: errorMsy?.message, success: false },
      { status: 400 }
    );
  }

  //   lets check user status is pending or not
  const { data: userData, error: errorUser } = await supabase
    .from("users")
    .select("status")
    .eq("email", email)
    .limit(1)
    .single();

  if (errorUser) {
    return NextResponse.json(
      { message: "User not exist", success: false },
      { status: 400 }
    );
  }

  if (userData.status === "pending") {
    const { error } = await supabase
      .from("users")
      .update({ status: "active" })
      .eq("email", email);

    if (error) {
      return NextResponse.json(
        { message: "Failed to update status", success: false },
        { status: 400 }
      );
    }
  }

  //   lets update the user stats in the users table

  //   const { data: insertUser, error: errorInsert } = await supabase
  //     .from("users")
  //     .select("*")
  //     .eq("email", email)
  //     .limit(1)
  //     .single();

  //   if (errorInsert) {
  //     return NextResponse.json(
  //       { message: errorInsert.message, success: false },
  //       { status: 400 }
  //     );
  //   }
  return NextResponse.json(
    { message: "Login successfully", success: true },
    { status: 200 }
  );
};
