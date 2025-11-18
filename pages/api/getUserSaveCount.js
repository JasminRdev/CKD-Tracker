// code here von chartcontext bissel als veranschaulichung
import { supabase } from "../../app/lib/supabaseClient";


export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id name is required" });
  }
  console.log(user_id)
  try {
    // Server-side only: can access secret env variables safely
    const { data, error } = await supabase
      .from("testResult_data")
      .select('*')
      .eq("user_id", user_id)

    if (error) throw error;

    res.status(200).json({ data: data });
  } catch (error) {
    console.error("Supabase query error:", error);
    res.status(500).json({ error: error.message });
  }
}