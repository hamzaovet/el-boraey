import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, filename = "product.jpg" } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "1705736b8f2b46dcbaeec8a6025aca83";

    // 1. Try uploading to ImgBB
    try {
      const formData = new URLSearchParams();
      formData.append("image", cleanBase64);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      const imgbbData = await imgbbRes.json();
      if (imgbbData.success && imgbbData.data?.url) {
        return NextResponse.json({
          success: true,
          source: "imgbb_cloud",
          url: imgbbData.data.url,
          displayUrl: imgbbData.data.display_url,
          deleteUrl: imgbbData.data.delete_url,
        });
      }
    } catch (imgbbErr: any) {
      console.warn("ImgBB direct upload failed, fallback to local storage:", imgbbErr.message);
    }

    // 2. Resilient Fallback: Save to /public/uploads/
    const uniqueFilename = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, Buffer.from(cleanBase64, "base64"));

    return NextResponse.json({
      success: true,
      source: "local_storage",
      url: `/uploads/${uniqueFilename}`,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
