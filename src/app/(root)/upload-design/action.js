import { uploadWithProgress } from "@/app/_hooks/fetch-hook";

export async function uploadFile(formData, token) {
  const res = await uploadWithProgress("/orders/uploads", formData, { token });
  return res.data
}
