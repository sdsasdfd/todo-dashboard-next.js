import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();
  const body = await req.json();
  console.log("body of signup :: ", body);
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required", success: false },
      { status: 400 }
    );
  }

  // Check if the email is already in use
  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  console.log("existingUser", existingUser);

  if (existingUserError && existingUserError.code !== "PGRST116") {
    return NextResponse.json(
      {
        message: "Failed to check existing user",
        success: false,
      },
      { status: 500 }
    );
  }
  if (existingUser && existingUser.status !== "pending") {
    return NextResponse.json(
      {
        message: "User already exists. Please login.",
        success: false,
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    },
  });

  console.log("data after signup :: ", data);
  console.log("error after signup :: ", error);

  if (data && data.user) {
    // Check if the user already exists in the database
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("existingUser after signup ::", existingUser);

    if (existingUserError && existingUserError.code !== "PGRST116") {
      return NextResponse.json(
        { message: "Failed to check existing user", success: false },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists. Please verify your email.",
          success: false,
        },
        { status: 400 }
      );
    }

    const userId = data.user.id;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        full_name: name,
        email: email,
        status: "pending",
      })
      .select();

    console.log("userData after insert ::", userData);
    console.log("userError after insert ::", userError);

    if (userError) {
      return NextResponse.json(
        { message: "Failed to insert data", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully. Please verify your email.",
        success: true,
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: "Failed to sign up", success: false },
      { status: 500 }
    );
  }
};
