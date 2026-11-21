import type { NextRequest } from "next/server"

// Server-side proxy for imgbb so the API key never reaches the browser.
// The sign-up form sends the selected file here and gets back a hosted URL.
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

type ImgbbResponse = {
  success?: boolean
  data?: {
    url?: string
    display_url?: string
    thumb?: { url?: string }
    delete_url?: string
  }
  error?: { message?: string }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.IMGBB_API_KEY

  if (!apiKey) {
    return Response.json(
      { message: "Image upload is not configured. Add IMGBB_API_KEY to your environment." },
      { status: 500 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ message: "Invalid form data." }, { status: 400 })
  }

  const file = formData.get("image")

  if (!(file instanceof File)) {
    return Response.json({ message: "No image file was provided." }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { message: "Only JPG, PNG, WEBP or GIF images are allowed." },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ message: "Image must be 5 MB or smaller." }, { status: 400 })
  }

  try {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64")

    const imgbbForm = new FormData()
    imgbbForm.append("image", base64)
    imgbbForm.append(
      "name",
      file.name.replace(/\.[^.]+$/, "").slice(0, 64) || "profile-image"
    )

    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: imgbbForm, cache: "no-store" }
    )

    const result = (await imgbbResponse.json()) as ImgbbResponse

    if (!imgbbResponse.ok || !result.success || !result.data?.url) {
      return Response.json(
        { message: result.error?.message ?? "imgbb rejected the upload." },
        { status: 502 }
      )
    }

    return Response.json({
      url: result.data.url,
      displayUrl: result.data.display_url ?? result.data.url,
      thumbUrl: result.data.thumb?.url ?? result.data.url,
      deleteUrl: result.data.delete_url ?? null,
    })
  } catch {
    return Response.json({ message: "Could not upload the image. Please try again." }, { status: 502 })
  }
}
