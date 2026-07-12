import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
  const { pet } = req.query
  const { lookForAdminsMatch } = req.query

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

//   const { data, error } = await dbClient
//     .from("possible_values")
//     .select("inputValues")
//     .neq("user_id", user.id)
//     // .eq("pet", pet) this only for own/non admin data row

//   if (error) return res.status(400).json({ error: error.message });

//   res.status(200).json({ data: data });

 if (lookForAdminsMatch == "false") {
    try {
        const { data, error } = await dbClient
            .from("possible_values")
            .select("inputValues")
            .eq("user_id", user.id)
            .eq("pet", pet) 

        res.status(200).json({ data: data });
    } catch (err){
        return res.status(500).json({
            error: "Server err, dev possible values - own.",
        });
    }
  } else {
      try {
          const { data, error } = await dbClient
          .from("possible_values")
          .select("inputValues")
          .neq("user_id", user.id)

          res.status(200).json({ data: data });
      } catch (err){
          return res.status(500).json({
              error: "Server err, dev possible values - admin.",
          });
      }
  }
}


