

// code here von chartcontext bissel als veranschaulichung
// app/pages/api/getTestResults.js
import { supabase } from "../../app/lib/supabaseClient";

export default async function handler(req, res) {
//   const { pet } = req.query;

//   if (!pet) {
//     return res.status(400).json({ error: "Pet name is required" });
//   }
//   console.log(pet)
  try {
    // Server-side only: can access secret env variables safely
    const { data, error } = await supabase
      .from("testResult_data")
      .select("file_url, pet") 
      .order("pet", { ascending: true });
    //    .eq("pet", "Blus") filter

    if (error) throw error;

    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Supabase query error:", error);
    res.status(500).json({ error: error.message });
  }
}