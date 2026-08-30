async function checkUrl() {
  const url = "https://lfgeihbrttjxxoywvzwk.supabase.co/storage/v1/object/public/courses_Bannar_Images/course_banners/kxhhfgzyc5l_1788128391248.jfif";
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
checkUrl();
