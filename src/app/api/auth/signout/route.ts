import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // 303 See Other — tells the browser to GET the redirect target (not re-POST)
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
