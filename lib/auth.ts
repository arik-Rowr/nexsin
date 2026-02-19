import { supabase } from "./supabase";

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://www.nexcyn.com/home",
    },
  });

  if (error) throw error;

  
}
