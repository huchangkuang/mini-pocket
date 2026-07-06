import Taro from "@tarojs/taro";
import type { ApiResponse, ApiUploadResult } from "@/types/api";
import { getToken } from "@/utils/authStore";
import { ApiError } from "@/utils/request";

export async function uploadTempFile(
  filePath: string
): Promise<ApiUploadResult> {
  const token = getToken();
  if (!token) {
    throw new ApiError("请先登录", 401);
  }

  const base = API_BASE_URL.replace(/\/$/, "");
  const response = await Taro.uploadFile({
    url: `${base}/storage/upload`,
    filePath,
    name: "file",
    header: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.statusCode === 401) {
    throw new ApiError("登录已失效，请重新登录", 401);
  }

  let body: ApiResponse<ApiUploadResult>;
  try {
    body = JSON.parse(response.data) as ApiResponse<ApiUploadResult>;
  } catch {
    throw new ApiError("上传响应解析失败", response.statusCode);
  }

  if (
    response.statusCode < 200 ||
    response.statusCode >= 300 ||
    body.code !== 0
  ) {
    throw new ApiError(body?.message || "上传失败", response.statusCode);
  }

  return body.data;
}
