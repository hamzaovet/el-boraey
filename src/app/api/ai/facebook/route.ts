import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { products, tone = "energetic", branches = [] } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    const branchNames = branches.length > 0 
      ? branches.map((b: any) => `${b.name} (${b.address})`).join(" و ")
      : "فرع شارع الجيش وفرع شارع سعد زغلول بزفتى";

    const productsSummary = (products || []).slice(0, 6)
      .map((p: any) => `- ${p.name}: كان ${p.originalPrice} ج وبقى ${p.offerPrice} ج (وفر ${p.originalPrice - p.offerPrice} ج)`)
      .join("\n");

    const prompt = `أنت المسوق الرسمي الأول لـ "هايبر ماركت البرعي" في مدينة زفتى بمحافظة الغربية.
صاحب السلسلة هو "المعلم سامح" وشعارنا التاريخي هو: "الأسعار قطاعي بسعر جملة الجملة 💙💙".
لدينا فرعين في زفتى:
1- فرع شارع الجيش - بجوار الوحدة الزراعية.
2- فرع شارع سعد زغلول - بجوار مكتبة ناهد.

المطلوب: اكتب منشور فيسبوك فيروسي ومقنع جداً ومكتوب بالعامية المصرية الأصيلة الجذابة جداً، بأسلوب (${tone === "energetic" ? "حماسي وضرب نار وتدمير أسعار وجملة الجملة" : tone === "friendly" ? "عائلي وتوفير ميزانية البيت وست الكل" : "عروض الويك إند السريعة للأسرة"}).

قائمة العروض الأساسية:
${productsSummary}

شروط المنشور:
1- ابدأ بترحيب حار جداً لأهل زفتى والغربية.
2- اذكر اسم المعلم سامح وشعار جملة الجملة.
3- اعرض المنتجات والأسعار بطريقة مشوقة مع إيموجيز مناسبة.
4- اذكر عنوان الفرعين بوضوح ورابط الموقع (https://boraey-market.com) ورقم الواتساب (01023456789).
5- ضع 6 هاشتاجات قوية ومناسبة في نهاية المنشور.

أرجع فقط نص المنشور المكتوب مباشرة بدون أي مقدمات أو شروحات.`;

    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
    ];

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const generatedPost = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedPost) {
            return NextResponse.json({
              success: true,
              source: "gemini_ai",
              modelUsed: model,
              postContent: generatedPost.trim(),
            });
          }
        }
      } catch (err: any) {
        console.error("Gemini FB Error on model", model, err.message);
      }
    }

    return NextResponse.json({ error: "Failed to generate post with Gemini" }, { status: 502 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
