import { createRoute, z } from "@hono/zod-openapi";
import { studioNameInputSchema, studioOutputSchema, studioPhotosInputSchema } from "../models/studios.schema";

export const getStudioRoute = createRoute({
  path: "/{studioName}",
  method: "get",
  request: {
    params: studioNameInputSchema
  },
  responses: {
    200: {
      description: "取得成功",
      content: {
        "application/json": {
          schema: studioOutputSchema
        }
      }
    },
    404: {
      description: "スタジオがありません",
      content: {
        "application/json": {
          schema: z.null()
        }
      }
    }
  }
})

export const createStudioRoute = createRoute({
  path: "/",
  method: "post",
  description: "スタジオの名前を登録",
  request: {
    body: {
      content: {
        "application/json": {
          schema: studioNameInputSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: "成功",
      content: {
        "application/json": {
          schema: z.object({
            message: z.literal("作成成功しました。")
          })
        }
      }
    },
    401: {
      description: "認証してください。",
      content: {
        "application/json": {
          schema: z.object({
            message: z.literal("認証してください。")
          })
        }
      }
    }
  }
})

export const updateStudioRoute = createRoute({
  path: "/",
  method: "put",
  description: "スタジオの写真を更新 (multipart/form-data)",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: studioPhotosInputSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "更新成功",
      content: {
        "application/json": {
          schema: z.object({ message: z.literal("更新おめでとう。") })
        }
      }
    },
    401: {
      description: "認証してください。",
      content: {
        "application/json": {
          schema: z.object({ message: z.literal("認証してください。") })
        }
      }
    },
    400: {
      description: "ファイルとメタデータの長さが違う",
      contnet: {
        "application/json": {
          schema: z.object({ message: z.literal("ファイルとメタデータの長さが違う。") })
        }
      }
    },
    500: {
      description: "画像のアップロードに失敗。",
      content: {
        "application/json": {
          schema: z.object({ message: z.literal("画像のアップロードに失敗。") })
        }
      }
    }
  }
});

