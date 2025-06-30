import { toast } from "react-toastify";

export default async function fetchHook(url, method, token, formData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: `${method}`,
      headers: {
        'contentType': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })

    toast.success()
    return res
  } catch (error) {
    toast.error('Something went worng, try again later.')
  }
}
