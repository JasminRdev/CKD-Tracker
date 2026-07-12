import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
  const { pet } = req.query;
  
  if (!pet) {
    return res.status(400).json({ error: "Pet name is required" });
  }
  
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

  const { data, error } = await dbClient
    .from("possible_values")
    .select("inputValues")
    .eq("pet", pet)
    .eq("user_id", user.id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    const { data: adminIniData, error: adminError } = await dbClient
      .from("possible_values")
      .select("inputValues")

    if (adminError) {
      return res.status(400).json({ error: adminError.message });
    }

    return res.status(200).json({
      data: adminIniData[0]?.inputValues.map(item => JSON.parse(item)) ?? [],
    });
  }

  return res.status(200).json({
    data: data[0].inputValues.map(item => JSON.parse(item)),
  });
}


