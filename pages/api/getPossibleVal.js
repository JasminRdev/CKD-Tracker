// const { data, error } = await supabase
//         .from('possible_values')
//         .select("inputValues")
//         .neq("user_id", user.id)



//       if (error) {
//         console.error(error)
//       } else {
//         console.log('1 reutrn', data)
//         console.log('2 reutrn',  JSON.parse(data[0].inputValues))
//         // check if ANY name is missing
//         const nameSet = new Set(
//           data[0].inputValues.flatMap(row => row.inputValues.map(v => v.name))
//         );
//         console.log("3 ", nameSet)

//         const isNameMissing = cleanedForm.some(item => !nameSet.has(item.name));

//         console.log("4 checke ", isNameMissing)

//         cleanedForm.forEach(({ name }) => {
//           const field = data[0].inputValues.find(name);
//           if (field) {
//             console.log("5 ", field)
//           };
//         });

//       }


//       // if(!dbFormIsEqualToAdmins || !dbFormIsEqualToOwnForm){
//       //   const tableRow = crypto.randomUUID();
//       //   const { data, error } = await supabase
//       //     .from('possible_values')
//       //     .insert([{ 
//       //         user_id: user.id, 
//       //         id:tableRow,
//       //         created_at : new Date(), 
//       //         inputValues: form,
//       //         pet: chosenPetName
//       //       }]) 
//       //   if (error) {
//       //     console.error(error)
//       //   } else {
//       //     console.log('Data saved, new possible valus:', data)
//       //   }
//       // }
      

//         console.log("hit ini arr from filled ones",form)


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


