"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CircleHelp,
  Plus,
  Search,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

type SourceType = "facebook" | "craigslist" | "estate_sale" | "storage_locker";

const sourceChips: { value: SourceType; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "craigslist", label: "Craigslist" },
  { value: "estate_sale", label: "Estate sale" },
  { value: "storage_locker", label: "Storage locker" },
];

export default function NewScanScreen() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [source, setSource] = useState<SourceType>("facebook");
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const previews = useMemo(() => {
    return photos.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [photos]);

  function openPicker() {
    inputRef.current?.click();
  }

  function onFileChange(fileList: FileList | null, mode: "append" | "replace" = "append") {
    if (!fileList) return;

    const next = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    setPhotos((current) => {
      if (mode === "replace") {
        return next.slice(0, 12);
      }
      return [...current, ...next].slice(0, 12);
    });
    setWarning("");
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }

  async function analyzeLot() {
    if (!photos.length) {
      setWarning("Add at least one photo before analyzing.");
      return;
    }

    try {
      setLoading(true);
      setWarning("");

      const form = new FormData();
      form.append("mode", "tools");
      form.append("businessContext", "thrift_shop");
      form.append("itemSetting", photos.length > 1 ? "multiple_items" : "single_item");
      form.append("source", source);
      photos.slice(0, 8).forEach((photo) => form.append("photos", photo));

      const res = await fetch("/api/analyze-photo", {
        method: "POST",
        body: form,
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Failed to analyze lot.");
      }

      sessionStorage.setItem("newScanResult", JSON.stringify(payload));
      sessionStorage.setItem("newScanSource", source);
      router.push("/scan/report");
    } catch (err: unknown) {
      setWarning(err instanceof Error ? err.message : "Scan failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F1E3] text-[#18232E]">
      <div className="mx-auto w-full max-w-md px-4 pb-[calc(98px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))]">
        <header className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#18232E]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: '"Georgia", serif', fontSize: "2rem" }}>
            New Scan
          </h1>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E4D7BD] bg-[#FFFDF7]"
            aria-label="Help"
          >
            <CircleHelp className="h-6 w-6" />
          </button>
        </header>

        <section className="mt-4 overflow-x-auto pb-1">
          <div className="inline-flex min-w-full gap-2">
            {sourceChips.map((chip) => {
              const active = chip.value === source;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setSource(chip.value)}
                  className={`min-h-11 shrink-0 rounded-xl border px-4 py-2 text-sm font-bold ${
                    active
                      ? "border-[#2F66C9] bg-[#2F66C9] text-white"
                      : "border-[#E4D7BD] bg-[#FFFDF7] text-[#18232E]"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 rounded-3xl border-2 border-dashed border-[#7FC8C6] bg-[#FFFDF7] p-6 text-center shadow-[0_8px_24px_rgba(24,35,46,0.08)]">
          <div className="mx-auto mb-3 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#DFF4F1] text-[#007B7A]">
            <Camera className="h-10 w-10" />
          </div>

          <h2 className="text-3xl font-black tracking-tight">Add listing photos</h2>
          <p className="mt-2 text-lg leading-7 text-[#5E6A72]">
            Tap to take a photo
            <br />
            or upload from library
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFileChange(e.target.files, "append")}
          />

          <button
            type="button"
            onClick={openPicker}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#007B7A] px-5 py-3 text-xl font-black text-white shadow-[0_10px_20px_rgba(0,95,94,0.25)] transition hover:bg-[#005F5E]"
          >
            <Upload className="h-5 w-5" />
            Choose photos
          </button>
        </section>

        <section className="mt-5">
          <h3 className="text-3xl font-black" style={{ fontFamily: '"Georgia", serif', fontSize: "1.85rem" }}>
            Your photos ({photos.length})
          </h3>

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {previews.map((preview, index) => (
              <div key={preview.url} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E4D7BD] bg-[#FFFDF7]">
                <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#D94A38] bg-white text-[#D94A38]"
                  aria-label={`Remove ${preview.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={openPicker}
              className="inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-[#C8D2D8] bg-[#FFFDF7] text-[#5E6A72]"
              aria-label="Add more photos"
            >
              <Plus className="h-8 w-8" />
            </button>
          </div>
        </section>

        <section className="mt-5 flex justify-center">
          <div className="relative w-full max-w-[340px] rotate-[-2deg] rounded-lg border border-[#E4D7BD] bg-[#FFD966] p-4 shadow-[0_10px_16px_rgba(24,35,46,0.14)]">
            <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-[#007B7A] shadow" />
            <div className="flex items-start gap-3">
              <Search className="mt-1 h-8 w-8 shrink-0 text-[#18232E]" />
              <p className="text-xl font-semibold leading-8 text-[#18232E]" style={{ fontFamily: '"Comic Sans MS", "Marker Felt", cursive' }}>
                Check close-ups
                <br />
                for marks and
                <br />
                model numbers.
              </p>
            </div>
          </div>
        </section>

        {warning ? (
          <div className="mt-4 rounded-xl border border-[#D94A38] bg-[#FFECE9] px-3 py-2 text-sm font-semibold text-[#D94A38]">
            {warning}
          </div>
        ) : null}
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E4D7BD] bg-[#F8F1E3]/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto w-full max-w-md">
          <button
            type="button"
            onClick={analyzeLot}
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#007B7A] px-5 py-3 text-xl font-black text-white shadow-[0_12px_20px_rgba(0,95,94,0.26)] transition hover:bg-[#005F5E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles className="h-5 w-5" />
            {loading ? "Analyzing..." : "Analyze lot"}
          </button>
        </div>
      </footer>
    </main>
  );
}
