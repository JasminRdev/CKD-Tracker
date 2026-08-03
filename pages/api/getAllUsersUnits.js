

import { createClient } from "@supabase/supabase-js";
import { supabase as publicClient } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
  const { pet, testtype } = req.query;

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

  let query = dbClient
    .from("units")
    .select("*")
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
  // if (!data || data.length === 0) {
  //   const { data: adminIniData, error: adminError } = await dbClient
  //     .from("units")
  //     .select("*")
  //     .eq("pet", pet)
  //     .eq("test_type", testtype)

  //   if (adminError) {
  //     return res.status(400).json({ error: adminError.message });
  //   }

  //   return res.status(200).json({
  //     data: adminIniData[0]?.inputValues.map(item => JSON.parse(item)) ?? [],
  //   });
  // }


  return res.status(200).json({
    data: data,
  });
}














// ready to del 

// import { createClient } from "@supabase/supabase-js";
// import { supabase as publicClient } from "../../app/lib/supabaseClient";

// export default async function handler(req, res) {
//   const { pet, testtype } = req.query;
  
//   if (!pet) {
//     return res.status(400).json({ error: "Pet name is required" });
//   }
  
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.startsWith("Bearer ")
//     ? authHeader.replace("Bearer ", "")
//     : null;

//   const isValidJwt = token && token.split(".").length === 3;

//   // Select correct Supabase client
//   const dbClient = isValidJwt
//     ? createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         {
//           global: {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         }
//       )
//     : publicClient; // Logged out user

//   // Now safely get user
//   const {
//     data: { user },
//   } = await (isValidJwt
//     ? dbClient.auth.getUser()
//     : { data: { user: null } });

//   const { data, error } = await dbClient
//     .from("units")
//     .select("*")
//     .eq("pet", pet)
//     .eq("test_type", testtype)

//   if (error) return res.status(400).json({ error: error.message });
//   res.status(200).json({ data: data });
// }


