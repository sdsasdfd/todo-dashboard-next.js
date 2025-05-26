import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";



// type Task = {
//   title: string;
//   description: string;
// };

export const GET = async (req: NextRequest) => {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  console.log("search params ::", search);
  // lets check user is logged in or not
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json(
      { message: "Failed to fetch user", success: false },
      { status: 500 }
    );
  }

  const userId = userData.user.id;

  let query =  supabase.from('tasks').select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", userId);

   if (search && search.trim() !== "") {
    query = query.ilike("title", `%${search.trim()}%`);
  }

   if (from) {
    query = query.gte("created_at", new Date(from).toISOString());
  }

  if (to) {
    const toDate = new Date(to);
  toDate.setHours(23, 59, 59, 999); 
    query = query.lte("created_at", toDate.toISOString());
  }
    
const {data, error} = await query;
  // console.log("tasks ::", data);
  // console.log("supabase error ::", error);

  if (error) {
    return NextResponse.json(
      { message: "Failed to fetch tasks", success: false },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();

  // lets check user is logged in or not
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // console.log("userData ::", userData.user);

  if (userError || !userData?.user) {
    return NextResponse.json(
      { message: "Please login to create tasks", success: false },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { title, description } = body;

  if (!title || !description) {
    return NextResponse.json(
      { message: "Title and description are required." },
      { status: 500 }
    );
  }

  const userId = userData.user.id;
  // console.log("userId ::", userId);

  const payload = {
    title,
    description,
    user_id: userId,
  };

  // console.log("payload ::", payload);

  const { data, error } = await supabase.from("tasks").insert(payload).select();

  console.log("inserted data ::", data);
  console.log("supabase error ::", error);

  if (error) {
    return NextResponse.json(
      { message: "Failed to insert task", success: false },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { data, message: "Task inserted successfully" },
    { status: 200 }
  );
};

export const DELETE = async (req: NextRequest) => {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json(
      { message: "Please login to update tasks", success: false },
      { status: 500 }
    );
  }

  const userId = userData.user.id;
  console.log("userId ::", userId);
  const body = await req.json();
  const { id } = body;

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  console.log("delete error ::", error);

  if (error) {
    return NextResponse.json(
      { message: "Failed to delete Task" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Task Deleted successfully" },
    { status: 200 }
  );
};

export const PATCH = async (req: NextRequest) => {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return NextResponse.json(
      { message: "Please login to update tasks", success: false },
      { status: 500 }
    );
  }

  const userId = userData.user.id;

  console.log("userId ::", userId);

  const body = await req.json();
  const { id } = body;
  const { error } = await supabase
    .from("tasks")
    .update({ is_completed: true })
    .eq("id", id)
    .eq("user_id", userId);
  console.log("completed error ::", error);

  if (error) {
    return NextResponse.json(
      { message: "Failed to completed Task" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Task completed successfully" },
    { status: 200 }
  );
};

export const PUT = async (req: NextRequest) => {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json(
      { message: "Please login to update tasks", success: false },
      { status: 500 }
    );
  }

  const userId = userData.user.id;
  console.log("userId ::", userId);

  const body = await req.json();
  const { title, description, id } = body;

  console.log("checking from back title and description", title);

  if (!title || !description || !id) {
    return NextResponse.json(
      { message: "Required fields are missing." },
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("tasks")
    .update({ title, description })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json(
      { message: "Failed to update Task" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Task updated successfully" },
    { status: 200 }
  );
};
