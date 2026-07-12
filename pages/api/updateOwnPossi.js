import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
  const { pet, form } = req.query;

  let parsedForm;
  try {
    parsedForm = JSON.parse(form);
  } catch {
    return res.status(400).json({ error: "Invalid form JSON" });
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
    .from('possible_values')
    .update([{ 
        inputValues: parsedForm,
        created_at : new Date(), 
    }])
    .eq("user_id", user.id)
    .eq("pet", pet) 

    if (error) {
      return res.status(400).json({ error: error.message })
    };

    return res.status(200).json(data);
  }

