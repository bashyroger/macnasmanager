"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { slugify } from "@/lib/utils";
import { saveProject, deleteProject } from "./actions";
import { MediaPicker } from "@/components/dashboard/media-picker";
import { Search, ImageIcon as ImageIconIcon, Loader2, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

const PROJECT_STATUSES = ["inquiry", "consultation", "design", "production", "completed", "delivered", "archived"] as const;

const schema = z.object({
  client_id: z.string().uuid("Please select a client"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  short_code: z.string().optional(),
  status: z.enum(PROJECT_STATUSES),
  hourly_rate_snapshot: z.coerce.number().positive("Must be a positive number").optional().or(z.literal("")),
  start_date: z.string().optional(),
  target_delivery_date: z.string().optional(),
  overhead_amount: z.coerce.number().min(0).optional().or(z.literal("")),
  private_notes: z.string().optional(),
  public_title: z.string().optional(),
  public_description: z.string().optional(),
  hero_image_path: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Client = { id: string; full_name: string };

export function ProjectForm({
  clients,
  defaultValues,
  projectId,
  defaultClientId,
}: {
  clients: Client[];
  defaultValues?: Partial<FormValues>;
  projectId?: string;
  defaultClientId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteFromGoogle, setDeleteFromGoogle] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isEdit = !!projectId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: {
      status: "inquiry",
      overhead_amount: 0,
      client_id: defaultClientId ?? "",
      ...defaultValues,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setError(null);
    const payload = {
      client_id: values.client_id,
      title: values.title,
      slug: values.slug,
      short_code: values.short_code || null,
      status: values.status,
      hourly_rate_snapshot: values.hourly_rate_snapshot ? Number(values.hourly_rate_snapshot) : null,
      start_date: values.start_date || null,
      target_delivery_date: values.target_delivery_date || null,
      overhead_amount: Number(values.overhead_amount ?? 0),
      private_notes: values.private_notes || null,
      public_title: values.public_title || null,
      public_description: values.public_description || null,
      hero_image_path: values.hero_image_path || null,
    };

    try {
      const result = await saveProject(projectId, payload);

      if (result.error) {
        setError(result.error);
        return;
      }

      const targetId = result.targetId;
      // We use a small delay or ensure the redirect happens after revalidation if needed, 
      // but usually router.push is enough. 
      // To prevent 'hanging' feel, we can refresh first then push.
      router.refresh();
      router.push(`/app/projects/${targetId}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving.");
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deleteProject(projectId, deleteFromGoogle);
      if (result.error) {
        setError(result.error);
        setIsDeleting(false);
      } else {
        router.refresh();
        router.push("/app/projects");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete project.");
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5 max-w-xl">
      <Field id="client_id" label="Client *" error={errors.client_id?.message}>
        <select 
          id="client_id" 
          {...register("client_id")} 
          className={inputClass(!!errors.client_id)}
          aria-invalid={!!errors.client_id}
          aria-required="true"
        >
          <option value="">Select a client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>
      </Field>

      <Field id="title" label="Project title *" error={errors.title?.message}>
        <input
          id="title"
          {...register("title", {
            onChange: (e) => {
              setValue("slug", slugify(e.target.value));
            },
          })}
          className={inputClass(!!errors.title)}
          placeholder="e.g. Weekend Tote — Sarah"
          aria-invalid={!!errors.title}
          aria-required="true"
        />
      </Field>

      <Field id="slug" label="Slug *" error={errors.slug?.message}>
        <input 
          id="slug" 
          {...register("slug")} 
          className={inputClass(!!errors.slug)} 
          placeholder="weekend-tote-sarah" 
          aria-invalid={!!errors.slug}
          aria-required="true"
        />
        <p id="slug-hint" className="text-xs text-gray-400 mt-1">Used in the public showcase URL. Auto-generated from title.</p>
      </Field>

      <Field id="short_code" label="Short code" error={errors.short_code?.message}>
        <input 
          id="short_code" 
          {...register("short_code")} 
          className={inputClass(false)} 
          placeholder="e.g. WTS-001" 
          aria-invalid={!!errors.short_code}
        />
        <p className="text-xs text-gray-400 mt-1">Optional. Used for calendar event matching.</p>
      </Field>

      <Field id="status" label="Status *" error={errors.status?.message}>
        <select 
          id="status" 
          {...register("status")} 
          className={inputClass(!!errors.status)}
          aria-invalid={!!errors.status}
          aria-required="true"
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="start_date" label="Start date">
          <input id="start_date" type="date" {...register("start_date")} className={inputClass(false)} />
        </Field>
        <Field id="target_delivery_date" label="Target delivery">
          <input id="target_delivery_date" type="date" {...register("target_delivery_date")} className={inputClass(false)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field id="hourly_rate" label="Hourly rate (€)" error={errors.hourly_rate_snapshot?.message}>
          <input id="hourly_rate" type="number" step="0.01" {...register("hourly_rate_snapshot")} className={inputClass(!!errors.hourly_rate_snapshot)} placeholder="0.00" aria-invalid={!!errors.hourly_rate_snapshot} />
        </Field>
        <Field id="overhead_amount" label="Overhead amount (€)" error={errors.overhead_amount?.message}>
          <input id="overhead_amount" type="number" step="0.01" {...register("overhead_amount")} className={inputClass(!!errors.overhead_amount)} placeholder="0.00" aria-invalid={!!errors.overhead_amount} />
        </Field>
      </div>

      <Field id="private_notes" label="Private notes">
        <textarea id="private_notes" {...register("private_notes")} rows={3} className={inputClass(false)} placeholder="Internal notes — never shown publicly" />
      </Field>

      <div className="pt-4 border-t border-[#e5e0d8] mt-6 mb-2" role="group" aria-labelledby="showcase-heading">
        <h3 id="showcase-heading" className="text-sm font-semibold text-[#1a1714] mb-4">Public showcase data</h3>
        <div className="space-y-5">
          <Field id="public_title" label="Public title" error={errors.public_title?.message}>
            <input id="public_title" {...register("public_title")} className={inputClass(false)} placeholder="e.g. Weekend Tote (if different from internal)" />
          </Field>

          <Field id="public_description" label="Public description" error={errors.public_description?.message}>
            <textarea id="public_description" {...register("public_description")} rows={3} className={inputClass(false)} placeholder="Story of this project..." />
          </Field>

          <Field id="hero_image_path" label="Hero Image" error={errors.hero_image_path?.message}>
            <div className="flex gap-3 items-start">
              {watch("hero_image_path") ? (
                <div className="w-16 h-16 rounded-xl border border-[#e5e0d8] overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm">
                  <img src={watch("hero_image_path")} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[#e5e0d8] bg-gray-50 flex-shrink-0 flex items-center justify-center">
                  <ImageIconIcon className="w-6 h-6 text-gray-300" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input 
                    id="hero_image_path" 
                    {...register("hero_image_path")} 
                    className={inputClass(!!errors.hero_image_path)} 
                    placeholder="/images/projects/tote.jpg" 
                  />
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="px-3 py-2 rounded-xl border border-[#e5e0d8] bg-white hover:bg-gray-50 text-xs font-bold text-gray-500 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Browse
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-medium italic">Path relative to public folder.</p>
              </div>
            </div>
          </Field>
        </div>
      </div>

      <MediaPicker 
        isOpen={pickerOpen} 
        onClose={() => setPickerOpen(false)} 
        onSelect={(path) => {
          setValue("hero_image_path", path, { shouldDirty: true });
          setPickerOpen(false);
        }} 
      />

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-bold hover:bg-[#a86330] disabled:opacity-60 transition-all focus:ring-2 focus:ring-[#be7b3b] focus:ring-offset-2 flex items-center gap-2 shadow-lg shadow-[#be7b3b]/10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving changes…
            </>
          ) : isEdit ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>

        {isEdit && !showDeleteConfirm && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="ml-auto px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete project
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="mt-8 p-6 rounded-3xl border-2 border-red-100 bg-red-50/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-4 items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1a1714]">Delete Project?</h3>
              <p className="text-sm text-gray-500 mt-1"> This action cannot be undone. All project data, materials, and internal notes will be permanently removed.</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-red-100 bg-white/50 cursor-pointer hover:bg-white transition-colors group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={deleteFromGoogle}
                  onChange={(e) => setDeleteFromGoogle(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#e5e0d8] bg-white transition-all checked:bg-red-500 checked:border-red-500"
                />
                <CheckCircle className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity pointer-events-none" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1a1714] group-hover:text-red-600 transition-colors">Also delete from Google Calendar</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {deleteFromGoogle 
                    ? "Associated events will be removed from your calendar. This is recommended to avoid clutter."
                    : "Events will stay in your calendar but will be ignored by future syncs to prevent them from coming back as 'unassigned'."}
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="flex-1 px-6 py-3 rounded-2xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Confirm Deletion
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(false)}
              className="px-6 py-3 rounded-2xl border border-[#e5e0d8] bg-white text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1a1714] mb-1.5">{label}</label>
      <div className="relative">
        {children}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] ${
    hasError ? "border-red-300 bg-red-50" : "border-[#e5e0d8] bg-white hover:border-gray-300"
  }`;
}
