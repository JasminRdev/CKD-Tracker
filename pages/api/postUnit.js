import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
  const { pet, testtype, name, fromUnit, settedUnit, factor, offset } = req.query;


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

  const tableRow = crypto.randomUUID();
  const { data, error } = await dbClient
    .from('units')
    .insert([{ 
        user_id: user.id, 
        id:tableRow,
        name: name,
        fromUnit: fromUnit,
        settedUnit: settedUnit,
        factor: Number(Number(factor).toFixed(4)),
        offset: Number(Number(offset).toFixed(4)),
        created_at : new Date(), 
        pet: pet,
        test_type:testtype, 
    }]) 

    if (error) {
        console.log("SUPABASE INSERT ERROR:", error);
        return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

