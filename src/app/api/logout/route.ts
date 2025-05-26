import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { message: "Logout successful", success: true },
    { status: 200 }
  );
};
