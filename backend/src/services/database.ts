import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database helper functions
export const database = {
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createUserProfile(profile: any) {
    const { data, error } = await supabase
      .from("users")
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
