import cloudinary from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FOLDERS = ["products", "categories", "collections", "site", "media"];

function validateImageFile(file) {
  if (!file) return "File tidak ditemukan.";
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Format gambar harus JPG, JPEG, PNG, atau WEBP.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Ukuran gambar maksimal 5MB.";
  }
  return null;
}

export async function uploadImage(file, folder = "site") {
  const error = validateImageFile(file);
  if (error) {
    return { success: false, message: error, error: "INVALID_IMAGE" };
  }

  const targetFolder = ALLOWED_FOLDERS.includes(folder) ? folder : "site";

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `affiliate-cms/${targetFolder}`,
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
    });

    return {
      success: true,
      message: "Upload berhasil.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        name: result.original_filename || file.name,
        size: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
      },
    };
  } catch {
    return { success: false, message: "Upload gagal.", error: "UPLOAD_FAILED" };
  }
}
