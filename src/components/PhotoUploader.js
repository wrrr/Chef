// src/components/PhotoUploader.js
import React, { useRef, useState } from "react";

/**
 * Props:
 * - onUploaded(url: string, meta: { id, deliveryURL }): called when upload succeeds
 * - accept: input accept attr (default: images)
 * - maxMB: client-side size guard (default: 10MB)
 */
export default function PhotoUploader({ onUploaded, accept = "image/*", maxMB = 10 }) {
  const inputRef = useRef(null);
  const [state, setState] = useState({ uploading: false, error: "", preview: "" });

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxMB * 1024 * 1024) {
      setState(s => ({ ...s, error: `File too large. Max ${maxMB} MB.` }));
      return;
    }

    setState({ uploading: true, error: "", preview: URL.createObjectURL(file) });

    try {
      // 1) Ask our API for a direct upload URL
      const resp = await fetch("/api/images/direct-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ttlSeconds: 600 }),
      });
      if (!resp.ok) throw new Error(`direct-upload HTTP ${resp.status}`);
      const { uploadURL, deliveryURL, id } = await resp.json();

      // 2) Upload the file directly to Cloudflare Images
      const form = new FormData();
      form.append("file", file, file.name);
      const up = await fetch(uploadURL, { method: "POST", body: form });
      if (!up.ok) throw new Error(`upload HTTP ${up.status}`);
      const upJson = await up.json();
      if (!upJson?.success) throw new Error("Images API said success=false");

      // 3) Notify parent
      onUploaded?.(deliveryURL, { id, deliveryURL });

      setState(s => ({ ...s, uploading: false }));
    } catch (err) {
      console.error("Photo upload error:", err);
      setState(s => ({ ...s, uploading: false, error: "Upload failed. Please try another image." }));
    }
  }

  return (
    <div className="photo-uploader">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        aria-label="Upload image"
      />
      {state.preview && (
        <div className="photo-preview" style={{ marginTop: 8 }}>
          <img
            src={state.preview}
            alt="Selected preview"
            style={{ maxWidth: 280, borderRadius: 8 }}
          />
        </div>
      )}
      {state.uploading && <div className="help-text">Uploading…</div>}
      {state.error && <div className="status err" role="alert">{state.error}</div>}
    </div>
  );
}
