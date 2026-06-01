import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlatformShell from "@/components/layout/PlatformShell";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error.message, error.code);
  }

  const displayName = profile?.display_name ?? user.email ?? "User";
  const balance = profile?.husky_balance ?? 1000;

  return (
    <PlatformShell displayName={displayName} balance={balance}>
      {children}
    </PlatformShell>
  );
}
