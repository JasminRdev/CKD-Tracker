

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  const isValidJwt = token && token.split(".").length === 3;

  // Select correct Supabase client
  const dbClient = isValidJwt
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          global: {
            headers: { Authorization: `Bearer ${token}` },
          },
        }
      )
    : publicClient; // Logged out user

 // Now safely get user
  const {
    data: { user },
  } = await (isValidJwt
    ? dbClient.auth.getUser()
    : { data: { user: null } });

  const isAdmin = user?.app_metadata?.role === "admin";

  if (isAdmin) {
    return res.status(200).json({ data: 1 });
  }

  try {
    const { data, error } = await dbClient
      .from("testResult_data")
      .select('*')
      .eq("user_id", user.id)

    if (error) throw error;

    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Supabase query error:", error);
    res.status(500).json({ error: error.message });
  }
}