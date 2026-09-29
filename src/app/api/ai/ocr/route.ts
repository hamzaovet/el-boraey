import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const prompt = `أنت خبير قراءة الخط اليدوي العربي وقوائم أسعار وتخفيضات السوبر ماركت في مصر.
افحص هذه الورقة المكتوبة بخط اليد بدقة واستخرج كافة المنتجات والأسعار ونسب التوفير.
يجب أن تعيد الإجابة بصيغة JSON نقي فقط (Array of Objects) بدون أي نصوص أو markdown:
[
  {
    "name": "اسم المنتج كاملاً وبالحجم",
    "category": "grocery" أو "dairy" أو "frozen" أو "beverages" أو "produce" أو "cleaning" أو "spices_oils",
    "originalPrice": رقم السعر القديم,
    "offerPrice": رقم سعر العرض بالجنيه,
    "discountPercentage": نسبة الخصم كرقم صحيح,
    "unit": "مثال: زجاجة 1.6 لتر أو كيس 1 كجم أو عرض 3 علب",
    "isHotOffer": true,
    "description": "وصف قصير جذاب"
  }
]`;

    // Try modern models with fallback
    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
    ];

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: cleanBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJsonText = rawText.replace(/```json\n?|```/g, "").trim();
            const parsedProducts = JSON.parse(cleanJsonText);
            return NextResponse.json({
              success: true,
              source: "gemini_vision_ai",
              modelUsed: model,
              products: parsedProducts,
            });
          }
        } else {
          const errData = await geminiRes.json();
          lastError = errData.error?.message || "Gemini error";
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    // Fallback if vision endpoint encounters high demand
    return NextResponse.json({
      success: false,
      error: lastError || "Failed to process handwriting with Gemini Vision",
    }, { status: 502 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
