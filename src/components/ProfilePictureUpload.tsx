"use client";

import { useRef, useState } from "react";
import { usersApi } from "@/lib/api/users";

interface Props {
  // Current profile picture URL; null/undefined renders a placeholder.
  profilePictureUrl?: string | null;
  // Fires after a successful upload or delete. The argument is the new URL
  // (or null on remove). Parent merges into its own user state.
  onChange?: (newUrl: string | null) => void;
  // Rendered diameter in px. Defaults to 96 — adjust to match your layout.
  size?: number;
}

// Drop-in profile picture uploader. Click the avatar (or the change button)
// to pick a file; the file is resized client-side to ~256x256 JPEG before
// upload to keep payloads small. Drag-and-drop works too.
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
    <div className="flex items-center gap-3">
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
          border: `2px dashed ${dragOver ? "var(--color-active-highlight)" : "var(--color-border-hairline)"}`,
          background: "var(--color-input)",
          overflow: "hidden",
          cursor: busy ? "wait" : "pointer",
          opacity: busy ? 0.5 : 1,
          position: "relative",
          transition: "border-color 0.15s",
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

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="text-[10px] tracking-widest uppercase font-semibold cursor-pointer disabled:opacity-40"
          style={{
            color: "var(--color-fg-subtle)",
            background: "transparent",
            border: "1px solid var(--color-border-hairline)",
            borderRadius: 999,
            padding: "4px 10px",
          }}
        >
          {busy ? "Uploading…" : profilePictureUrl ? "Change" : "Upload"}
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
              padding: "2px 0",
              textAlign: "left",
            }}
          >
            Remove
          </button>
        )}
        {error && (
          <span style={{ color: "var(--color-danger)", fontSize: 10 }}>{error}</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Reset so picking the same file twice still fires onChange.
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
