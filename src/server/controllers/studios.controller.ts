import { RouteHandler, z } from "@hono/zod-openapi";
import { createStudioRoute, getStudioRoute, updateStudioRoute } from "../routes/studios.route";
import { db } from "@/db";
import { studios } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";

export const getStudioHandler: RouteHandler<typeof getStudioRoute> = async (c) => {
  const { studioName } = c.req.valid("param")

  const studio = await db.query.studios.findFirst({
    where: eq(studios.studioName, studioName),
    columns: {
      photos: true,
      studioName: true,
      ownerId: true,
    }
  })


  if (!studio) {
    return c.json(null, 404)
  }

  const supabase = await createClient()

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  const isEditable = supabaseUser?.id === studio.ownerId
  const { data: ownerData } = await supabase.auth.admin.getUserById(studio.ownerId)

  const arrangedStudio = {
    photos: studio.photos,
    studioName: studio.studioName,
    isEditable: isEditable,
    ownerIconUrl: ownerData.user?.user_metadata.avatar_url
  }

  return c.json(arrangedStudio, 200);
}

export const createStudioHandler: RouteHandler<typeof createStudioRoute> = async (c) => {
  const { studioName } = c.req.valid("json")

  const supabase = await createClient()

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser) {
    return c.json({ message: "認証してください。" }, 401)
  }

  await db.insert(studios).values({
    studioName: studioName,
    ownerId: supabaseUser.id
  })

  return c.json({ message: "作成成功しました。" }, 201)
}

export const updateStudioHandler: RouteHandler<typeof updateStudioRoute> = async (c) => {
  console.log("hello")

  const supabase = await createClient()

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser()

  if (!supabaseUser) {
    return c.json({ message: "認証してください。" }, 401)
  }

  const { files, metadata } = c.req.valid("form")

  console.log(files, metadata)

  if (files.length !== metadata.length) {
    return c.json({ message: 'ファイルとメタデータの長さが違う。' }, 400)
  }

  const photoItems = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const { title, description, display_order } = metadata[i]

    const { data: uploadData, error: uploadErr } =
      await supabase
        .storage
        .from('photos')
        .upload(`${Date.now()}-${display_order}`, file)

    if (uploadErr) {
      console.log(uploadErr)
      return c.json({ message: '画像のアップロードに失敗。' }, 500)
    }

    const { data: { publicUrl } } =
      supabase
        .storage
        .from('photos')
        .getPublicUrl(uploadData.path)

    photoItems.push({
      url: publicUrl,
      title,
      description,
      display_order,
    })
  }

  await db
    .update(studios)
    .set({ photos: photoItems })
    .where(eq(studios.ownerId, supabaseUser.id))

  return c.json({ message: '更新おめでとう。' }, 200)
}
