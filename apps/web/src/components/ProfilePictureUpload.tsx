"use client";

import { useRef, useState } from "react";
import { usersApi } from "@/lib/api/users";

interface Props {
  // Current PFP URL; null renders placeholder.
  profilePictureUrl?: string | null;
  // Fires after upload/delete with the new URL or null.
  onChange?: (newUrl: string | null) => void;
  // Rendered diameter in px.
  size?: number;
}

// Tap-the-image-to-change profile picture uploader. Borderless circle with an
// optional Remove action stacked beneath when a picture exists.
export default function ProfilePictureUpload({ profilePictureUrl, onChange, size = 96 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setBusy(true);
    setError(null);
    const { data, error: err } = await usersApi.uploadProfilePicture(file);
    setBusy(false);
    if (err || !data) { setError(err || "Upload failed"); return; }
    onChange?.(data.profilePictureUrl ?? null);
  }

  async function handleRemove() {
    if (!profilePictureUrl) return;
    setBusy(true);
    setError(null);
    const { error: err } = await usersApi.deleteProfilePicture();
    setBusy(false);
    if (err) { setError(err); return; }
    onChange?.(null);
  }

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        disabled={busy}
        aria-label={profilePictureUrl ? "Change profile picture" : "Upload profile picture"}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          padding: 0,
          border: "none",
          // Subtle accent ring only while a file is being dragged over.
          outline: dragOver ? "2px solid var(--color-active-highlight)" : "none",
          outlineOffset: 1,
          background: profilePictureUrl ? "transparent" : "var(--color-input)",
          overflow: "hidden",
          cursor: busy ? "wait" : "pointer",
          opacity: busy ? 0.5 : 1,
          transition: "outline-color 0.15s",
        }}
      >
        {profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profilePictureUrl}
            alt="Profile picture"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span
            aria-hidden
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              fontSize: size * 0.32,
              color: "var(--color-fg-subtle)",
            }}
          >
            +
          </span>
        )}
      </button>

      {profilePictureUrl && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={busy}
          className="text-[10px] tracking-widest uppercase font-semibold cursor-pointer disabled:opacity-40"
          style={{
            color: "var(--color-danger)",
            background: "transparent",
            border: "none",
            padding: "2px 6px",
          }}
        >
          {busy ? "…" : "Remove"}
        </button>
      )}
      {error && (
        <span style={{ color: "var(--color-danger)", fontSize: 10 }}>{error}</span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Reset to allow re-picking the same file.
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
