import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { pageAccessToken, pageId, caption, imageBase64 } = await req.json();

    if (!caption) {
      return NextResponse.json({ error: "نص المنشور مطلوب" }, { status: 400 });
    }

    // If real Facebook Page credentials provided, call Meta Graph API
    if (pageAccessToken && pageId) {
      try {
        const formData = new URLSearchParams();
        formData.append("message", caption);
        formData.append("access_token", pageAccessToken);

        // If imageBase64 provided or image url
        let graphEndpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
        
        const fbRes = await fetch(graphEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        const fbData = await fbRes.json();
        if (fbData.id) {
          return NextResponse.json({
            success: true,
            isLiveGraphApi: true,
            postId: fbData.id,
            postUrl: `https://www.facebook.com/${fbData.id}`,
            message: "تم النشر الحقيقي بنجاح عبر Facebook Graph API!",
          });
        } else {
          return NextResponse.json({
            success: false,
            error: fbData.error?.message || "فشل الاتصال بـ Meta Graph API",
          }, { status: 400 });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: "حدث خطأ أثناء الاتصال بسيرفرات فيسبوك: " + (err.message || ""),
        }, { status: 500 });
      }
    }

    // Direct Web intent fallback
    const simulatedId = `fb_${Date.now()}_boraey`;
    return NextResponse.json({
      success: true,
      isLiveGraphApi: false,
      postId: simulatedId,
      message: "تم تجهيز المنشور بنجاح ونقله للحافظة مع تنزيل التصميم بدقة 1080x1080!",
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
