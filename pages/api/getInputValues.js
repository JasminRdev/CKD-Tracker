import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
  const { pet, testtype, autoForm } = req.query;

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


    //admins form
  if ((autoForm == "true")) {
    let queryAuto = dbClient
      .from("possible_values")
      .select("inputValues")
      if (user) {
        queryAuto = queryAuto.neq("user_id", user.id);
      }
    const { data: adminIniData, error: adminError } = await queryAuto

    if (adminError) {
      return res.status(400).json({ error: adminError.message });
    }

    return res.status(200).json({
      data: adminIniData[0]?.inputValues.map(item => JSON.parse(item)) ?? [],
    });
  }

  let query = dbClient
    .from("possible_values")
    .select("inputValues")
    .eq("pet", pet)
    .eq("test_type", testtype)
    if (user) {
      query = query.eq("user_id", user.id);
    }
  const { data, error } = await query;
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  
  //logged out or no own possi - get admins
  if (!data || data.length === 0) {
    const { data: adminIniData, error: adminError } = await dbClient
      .from("possible_values")
      .select("inputValues")
      .eq("pet", pet)
      .eq("test_type", testtype)

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


