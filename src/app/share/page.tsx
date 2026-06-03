"use client";

import React, { useState, useRef, Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { UploadCloud, X, MapPin, CheckCircle, Leaf, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetCategories, useGetProfile, useUploadImage, useCreateItem } from "@/api/hooks";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function getImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith('/uploads')) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return `${backendUrl}${url}`;
  }
  return url;
}

function ShareWizardContent() {
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKarmaModal, setShowKarmaModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: categories = [] } = useGetCategories();
  const { data: profile } = useGetProfile();
  const uploadImageMutation = useUploadImage();
  const createItemMutation = useCreateItem();

  const location = profile?.location || "Downtown, Block 4";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        try {
          const res = await uploadImageMutation.mutateAsync(file);
          setImages((prev) => [...prev, res.url]);
          toast.success(`Uploaded ${file.name} successfully`);
        } catch (err: any) {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        await createItemMutation.mutateAsync({
          title,
          description,
          category_id: category,
          images,
        });
        setIsSubmitting(false);
        setShowKarmaModal(true);
      } catch (err: any) {
        setIsSubmitting(false);
        toast.error(
          err.response?.data?.message ||
            "Failed to publish listing. Please try again."
        );
      }
    }
  };

  if (showKarmaModal) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4 animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

        {/* Floating leaves animation effect using Tailwind arbitrary values */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 text-primary animate-bounce delay-100">
          <Leaf />
        </div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 text-primary animate-bounce delay-300">
          <Leaf />
        </div>
        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 text-primary animate-bounce delay-700">
          <Leaf />
        </div>

        <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(var(--color-emerald-500),0.4)]">
          <CheckCircle className="w-12 h-12" />
        </div>

        <h1 className="text-4xl font-bold text-center mb-4 bg-linear-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
          {t("thankYouGiveBack")}
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-md mb-12">
          {t("listingIsLive", { title })}
        </p>

        <Link href="/dashboard">
          <Button className="py-6 px-10 rounded-full text-lg shadow-lg hover-lift tactile-scale">
            {t("viewDashboard")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() =>
              step > 1 ? setStep(step - 1) : window.history.back()
            }
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t("shareAnItem")}</h1>
            <p className="text-sm text-muted-foreground">{t("stepProgress", { step })}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-12">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 glass-effect p-6 md:p-10 rounded-3xl card-elevation"
        >
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-semibold">{t("uploadPhotos")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("photoGuideline")}
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
              >
                {uploadImageMutation.isPending ? (
                  <Loader2 className="w-10 h-10 text-primary mb-3 animate-spin" />
                ) : (
                  <UploadCloud className="w-10 h-10 text-primary mb-3" />
                )}
                <span className="font-medium">
                  {t("dragUpload")}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {t("fileSizeLimit")}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={getImageUrl(src)}
                        alt="Upload preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-semibold">{t("itemDetails")}</h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium">{t("inputTitleLabel")}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("inputTitlePlaceholder")}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">{t("inputCategoryLabel")}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                >
                  <option value="" disabled>
                    {t("inputCategorySelect")}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">{t("inputDescLabel")}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("inputDescPlaceholder")}
                  rows={5}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-semibold">{t("confirmLocation")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("whereToPick")}
              </p>

              <div className="glass-effect rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-3 text-lg font-medium mb-4">
                  <MapPin className="w-5 h-5 text-secondary" />
                  {location}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">
                    {t("useDefaultNeighborhood")}
                  </span>
                  {/* Mock Toggle */}
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-border mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (step === 1 && images.length === 0) ||
                (step === 2 && (!title || !description || !category))
              }
              className="py-6 px-8 rounded-xl text-lg shadow-md hover-lift tactile-scale gap-2"
            >
              {isSubmitting ? (
                <>
                  {t("publishing")} <Loader2 className="w-5 h-5 animate-spin" />
                </>
              ) : step === 3 ? (
                <>
                  {t("publishListing")} <CheckCircle className="w-5 h-5" />
                </>
              ) : (
                <>
                  {t("nextStep")} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function ShareWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      }
    >
      <ShareWizardContent />
    </Suspense>
  );
}
