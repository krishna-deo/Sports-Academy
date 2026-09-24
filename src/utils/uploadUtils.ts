/**
 * Helper function for XMLHttpRequest file uploads with real-time percentage progress tracking
 */
export const uploadWithProgress = (
  url: string,
  method: string,
  body: FormData | any,
  token: string | null,
  onProgress: (percent: number) => void
): Promise<{ ok: boolean; status: number; data: any }> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    let payload = body;
    if (!(body instanceof FormData) && typeof body === 'object' && body !== null) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      payload = JSON.stringify(body);
    }

    if (xhr.upload) {
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable && evt.total > 0) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      let data: any = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch (e) {
        data = { text: xhr.responseText };
      }
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data });
    };

    xhr.onerror = () => {
      reject(new Error('Network request failed during upload'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload request timed out'));
    };

    xhr.send(payload);
  });
};
