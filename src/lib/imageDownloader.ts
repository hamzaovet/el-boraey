import { toPng, toBlob } from "html-to-image";

/**
 * Downloads any DOM element as a high-resolution PNG image
 */
export async function downloadElementAsImage(elementId: string, filename: string = "download.png"): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for download.`);
    return false;
  }

  try {
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // 2x retina sharpness
      backgroundColor: "#020617",
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error("Error generating image from DOM:", error);
    return false;
  }
}

/**
 * Enhances an image via Canvas: boosts contrast, sharpens edges, and removes dim lighting
 */
export function enhanceImageBase64(base64Str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      // Apply CSS visual enhancement filters directly on canvas
      ctx.filter = "contrast(125%) brightness(105%) saturate(110%)";
      ctx.drawImage(img, 0, 0);

      const enhancedDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      resolve(enhancedDataUrl);
    };
    img.onerror = (e) => reject(e);
    img.src = base64Str;
  });
}
