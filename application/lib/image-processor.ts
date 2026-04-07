import sharp from "sharp";
import fs from "fs";
import path from "path";

const TARGET_WIDTHS = [360, 420, 540, 768, 1280, 1366, 1536, 1920];
const BASE_MEDIA_PATH = path.join(process.cwd(), "public", "cms-media");

/**
 * Ensures all required directories exist.
 */
function ensureDirectories() {
  const dirs = ["original", ...TARGET_WIDTHS.map(String)];
  for (const dir of dirs) {
    const dirPath = path.join(BASE_MEDIA_PATH, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}

/**
 * Processes an uploaded image buffer: 
 * 1. Saves original.
 * 2. Generates responsive sizes (no upscaling).
 */
export async function processImage(buffer: Buffer, filename: string) {
  ensureDirectories();

  const metadata = await sharp(buffer).metadata();
  const originalWidth = metadata.width || 0;

  // 1. Save Original
  const originalPath = path.join(BASE_MEDIA_PATH, "original", filename);
  await sharp(buffer).toFile(originalPath);

  // 2. Generate Responsive Sizes
  const results = [];
  for (const width of TARGET_WIDTHS) {
    // skip-upscale logic: Only downscale
    if (originalWidth > width) {
      const outputPath = path.join(BASE_MEDIA_PATH, String(width), filename);
      
      // We also generate a webp version if possible for performance
      const webpPath = outputPath + ".webp";

      try {
        await sharp(buffer)
          .resize(width)
          .toFile(outputPath);
        
        await sharp(buffer)
          .resize(width)
          .webp()
          .toFile(webpPath);
          
        results.push({ width, status: "generated" });
      } catch (err) {
        console.error(`Error generating ${width}px version for ${filename}:`, err);
        results.push({ width, status: "error" });
      }
    } else {
      results.push({ width, status: "skipped (original is smaller)" });
    }
  }

  return {
    filename,
    originalWidth,
    responsiveVersions: results
  };
}

/**
 * Removes the original image and all its generated responsive versions.
 */
export async function deleteProcessedImage(filename: string) {
  const pathsToDelete = [
    path.join(BASE_MEDIA_PATH, "original", filename),
    ...TARGET_WIDTHS.flatMap(width => [
      path.join(BASE_MEDIA_PATH, String(width), filename),
      path.join(BASE_MEDIA_PATH, String(width), filename + ".webp")
    ])
  ];

  for (const filePath of pathsToDelete) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }

  return { success: true };
}
