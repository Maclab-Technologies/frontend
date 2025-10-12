"use client";

// Client-only upload function
export const uploadWithProgress = async (
  url,
  data,
  onProgress,
  options = {}
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({ success: true, data: response });
        } catch {
          resolve({ success: true, data: xhr.responseText });
        }
      } else {
        reject({ success: false, error: `HTTP ${xhr.status}` });
      }
    };

    xhr.onerror = () => reject({ success: false, error: "Network error" });

    const { token, headers = {} } = options;

    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}${url}`);

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(data);
  });
};