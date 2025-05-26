import { createClient } from "@/utils/supabase/server";
import {  NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { message: "User fetched successfully", success: true, user: data },
    { status: 200 }
  );
};
