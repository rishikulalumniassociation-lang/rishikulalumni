"use client";

/**
 * Compresses an image file in the browser using HTML5 Canvas
 * Targets file size <= maxKb (Default 50KB)
 */
export async function compressImageTo50Kb(file: File, maxKb = 50): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Compute resized dimensions
        let width = img.width;
        let height = img.height;
        const maxDimension = 600; // max width/height

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively reduce quality until <= maxKb
        let quality = 0.85;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        while (sizeKb > maxKb && quality > 0.15) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        resolve({ dataUrl, sizeKb });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
