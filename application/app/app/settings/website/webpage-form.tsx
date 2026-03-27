"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray, Control } from "react-hook-form";
import { updateWebsitePage } from "./actions";
import { 
  Loader2, Save, ArrowLeft, Plus, Trash2, 
  GripVertical, Image as ImageIcon, Type, AlignLeft, Calendar, Link as LinkIcon, Search, X
} from "lucide-react";
import { getMediaLibrary } from "./actions";
import Link from "next/link";

type Props = {
  page: {
    id: string;
    page_key: string;
    title: string;
    body_json: any;
  };
};

/**
 * SCHEMA DEFINITION
 * This config controls what fields appear for each page.
 * It's easy to extend with new sections or field types.
 */
type FieldType = 'text' | 'textarea' | 'image' | 'date' | 'url';

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  rows?: number;
}

interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  type: 'section' | 'list';
  fields?: FieldConfig[];
  itemFields?: FieldConfig[]; // For 'list' types
  listField?: string;       // The key in body_json for the array
}

const PAGE_CONFIGS: Record<string, SectionConfig[]> = {
  home: [
    {
      id: "hero",
      title: "Hero Section",
      description: "The main splash area at the top of the home page.",
      type: "section",
      fields: [
        { name: "hero_title", label: "Hero Title", type: "text" },
        { name: "hero_subtitle", label: "Hero Subtitle", type: "textarea", rows: 2 },
        { name: "hero_image", label: "Hero Image Path", type: "image", placeholder: "/images/website/home-hero.jpg" },
      ]
    },
    {
      id: "intro",
      title: "Introduction",
      type: "section",
      fields: [
        { name: "intro_text", label: "Intro Text Body", type: "textarea", rows: 4 },
      ]
    }
  ],
  bags: [
    {
      id: "header",
      title: "Header & Intro",
      type: "section",
      fields: [
        { name: "hero_title", label: "Page Title", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 3 },
        { name: "hero_image", label: "Hero Image Path", type: "image" },
      ]
    },
    {
      id: "process",
      title: "Designing Process",
      description: "Steps showing how custom bags are created.",
      type: "list",
      listField: "process_steps",
      itemFields: [
        { name: "title", label: "Step Title", type: "text" },
        { name: "text", label: "Step Description", type: "textarea", rows: 2 },
        { name: "image_path", label: "Image Path", type: "image" },
      ]
    },
    {
      id: "commercial",
      title: "Pricing & CTA",
      type: "section",
      fields: [
        { name: "pricing_range", label: "Pricing Text", type: "text", placeholder: "e.g. Range from €300 to €800" },
      ]
    },
    {
      id: "feedback",
      title: "Testimonials",
      type: "list",
      listField: "testimonials",
      itemFields: [
        { name: "name", label: "Client Name", type: "text" },
        { name: "quote", label: "Quote", type: "textarea", rows: 2 },
      ]
    }
  ],
  materials: [
    {
      id: "header",
      title: "Header & Intro",
      type: "section",
      fields: [
        { name: "hero_title", label: "Page Title", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 3 },
      ]
    },
    {
      id: "inventory",
      title: "Material Catalog",
      description: "Showcase the innovative materials researched by Studio Macnas.",
      type: "list",
      listField: "materials",
      itemFields: [
        { name: "name", label: "Material Name", type: "text" },
        { name: "text", label: "Short Description", type: "textarea", rows: 2 },
        { name: "pros", label: "Pros (e.g. + Compostable)", type: "text" },
        { name: "cons", label: "Cons (e.g. - Not bendable)", type: "text" },
        { name: "image_path", label: "Image Path", type: "image" },
      ]
    }
  ],
  events: [
    {
      id: "header",
      title: "Header",
      type: "section",
      fields: [
        { name: "hero_title", label: "Page Title", type: "text" },
        { name: "hero_image", label: "Hero Image Path", type: "image" },
      ]
    },
    {
      id: "upcoming",
      title: "Upcoming Events",
      type: "list",
      listField: "upcoming_events",
      itemFields: [
        { name: "date", label: "Event Date/Time", type: "text", placeholder: "e.g. 15 Oct, 19:00" },
        { name: "title", label: "Event Title", type: "text" },
        { name: "description", label: "Description", type: "textarea", rows: 2 },
        { name: "link_url", label: "External Link", type: "url" },
        { name: "image_path", label: "Image Path", type: "image" },
      ]
    }
  ],
  contact: [
    {
      id: "details",
      title: "Contact Information",
      type: "section",
      fields: [
        { name: "description", label: "Intro Description", type: "textarea", rows: 3 },
        { name: "email", label: "Email", type: "text" },
        { name: "phone", label: "Phone", type: "text" },
        { name: "address", label: "Physical Address", type: "text" },
        { name: "instagram", label: "Instagram Handle", type: "text" },
      ]
    }
  ]
};

/**
 * REUSABLE COMPONENTS
 */

function SectionWrapper({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-sm transition-all hover:shadow-md group">
      <div className="px-6 py-4 border-b border-[#e5e0d8] bg-gray-50/50 group-hover:bg-[#fcfaf8] transition-colors">
        <h2 className="font-bold text-[#1a1714] flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#be7b3b] rounded-full" />
          {title}
        </h2>
        {description && <p className="text-xs text-gray-400 mt-1 font-medium">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/**
 * MEDIA PICKER MODAL
 */
function MediaPickerModal({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (path: string) => void;
}) {
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMedia = async () => {
    setLoading(true);
    const result = await getMediaLibrary();
    if (result.files) {
      setMedia(result.files);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen]);

  const filteredMedia = media.filter(m => m.toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#1a1714]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#e5e0d8]">
        {/* Header */}
        <div className="p-6 border-b border-[#e5e0d8] flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-[#1a1714]">Media Library</h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">Select an asset from /cms-media/original</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#e5e0d8]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e5e0d8] bg-gray-50/50 text-sm focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] outline-none transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#be7b3b]" />
              <p className="text-sm text-gray-400 font-medium">Scanning media folder...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-gray-400">No images found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((file) => (
                <button
                  key={file}
                  onClick={() => onSelect(`/cms-media/original/${file}`)}
                  className="group relative aspect-square rounded-2xl border border-[#e5e0d8] overflow-hidden hover:border-[#be7b3b] hover:ring-4 hover:ring-[#be7b3b]/10 transition-all text-left bg-[#fcfaf8]"
                >
                  <img 
                    src={`/cms-media/original/${file}`} 
                    alt={file}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-[10px] text-white font-medium truncate w-full">{file}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StandardField({ config, register, openPicker, watchValue }: { config: FieldConfig; register: any; openPicker?: (name: string) => void; watchValue?: string }) {
  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-white text-sm transition-all outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] hover:border-gray-300";
  const labelClass = "block text-sm font-semibold text-[#1a1714] mb-1.5 flex items-center gap-2";

  const getIcon = () => {
    switch(config.type) {
      case 'image': return <ImageIcon className="w-3.5 h-3.5 text-gray-400" />;
      case 'textarea': return <AlignLeft className="w-3.5 h-3.5 text-gray-400" />;
      case 'date': return <Calendar className="w-3.5 h-3.5 text-gray-400" />;
      case 'url': return <LinkIcon className="w-3.5 h-3.5 text-gray-400" />;
      default: return <Type className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-1.5">
      <label className={labelClass}>
        {getIcon()}
        {config.label}
      </label>
      
      {config.type === 'image' && (
        <div className="flex gap-4 items-start mb-2 group/media">
          {watchValue ? (
            <div className="w-20 h-20 rounded-xl border border-[#e5e0d8] overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm group-hover/media:shadow-md transition-all">
              <img src={watchValue} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#e5e0d8] bg-gray-50 flex-shrink-0 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-300" />
            </div>
          )}
          <div className="flex-1 space-y-2 pt-1">
            <div className="flex gap-2">
              <input 
                {...register(config.name)} 
                type="text" 
                className={inputClass} 
                placeholder={config.placeholder || "Paste path or browse..."}
              />
              <button
                type="button"
                onClick={() => openPicker?.(config.name)}
                className="px-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-white hover:bg-gray-50 text-xs font-bold text-gray-500 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                Browse
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium italic">Relative to public folder (e.g. /cms-media/original/filename.jpg)</p>
          </div>
        </div>
      )}

      {config.type === 'textarea' ? (
        <textarea 
          {...register(config.name)} 
          rows={config.rows || 3} 
          className={inputClass} 
          placeholder={config.placeholder}
        />
      ) : config.type !== 'image' && (
        <input 
          {...register(config.name)} 
          type="text" 
          className={inputClass} 
          placeholder={config.placeholder}
        />
      )}
    </div>
  );
}

function DynamicList({ control, register, config, openPicker, watch }: { control: Control<any>; register: any; config: SectionConfig; openPicker: (name: string) => void; watch: any }) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: config.listField || "items"
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div 
          key={field.id} 
          className="relative bg-gray-50/50 rounded-2xl border border-[#e5e0d8] p-5 pt-10 transition-all hover:bg-white"
        >
          {/* Item Header / Tools */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <GripVertical className="w-4 h-4 cursor-grab" />
              Item #{index + 1}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Item Sub-Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {config.itemFields?.map((itemField) => (
              <div key={itemField.name} className={itemField.type === 'textarea' ? 'md:col-span-2' : ''}>
                <StandardField 
                  config={{
                    ...itemField,
                    name: `${config.listField}.${index}.${itemField.name}`
                  }} 
                  register={register}
                  openPicker={openPicker}
                  watchValue={watch(`${config.listField}.${index}.${itemField.name}`)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({})}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-[#e5e0d8] text-gray-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-[#be7b3b] hover:text-[#be7b3b] hover:bg-[#be7b3b]/5 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add New {config.title.replace('ies', 'y').replace('s', '')}
      </button>
    </div>
  );
}

/**
 * MAIN COMPONENT
 */

export function WebsitePageForm({ page }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Media Picker State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeFieldName, setActiveFieldName] = useState<string | null>(null);

  const sections = useMemo(() => PAGE_CONFIGS[page.page_key] || [], [page.page_key]);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: page.title,
      ...page.body_json
    }
  });

  const openMediaPicker = (fieldName: string) => {
    setActiveFieldName(fieldName);
    setPickerOpen(true);
  };

  const handleMediaSelect = (path: string) => {
    if (activeFieldName) {
      setValue(activeFieldName, path, { shouldDirty: true });
    }
    setPickerOpen(false);
    setActiveFieldName(null);
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    setIsSaving(true);
    setError(null);

    // Filter out the title from body_json
    const { title, ...body_json } = data;
    
    // We also want to preserve any top-level keys that might be in body_json 
    // but not explicitly in the current data object (safety first)
    const finalBodyJson = { ...page.body_json, ...body_json };

    const result = await updateWebsitePage(page.id, {
      title,
      body_json: finalBodyJson
    });

    setIsSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
      router.push("/app/settings/website");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/app/settings/website" 
            className="p-2.5 rounded-xl border border-[#e5e0d8] bg-white hover:bg-gray-50 transition-all text-gray-500 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1714]">
              {page.title} <span className="text-gray-300 font-normal ml-2">/ Editor</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Page Key: {page.page_key}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Admin Section */}
        <SectionWrapper title="Platform Display">
          <div className="max-w-md">
            <StandardField 
              config={{ name: "title", label: "Dashboard Title", type: "text", placeholder: "e.g. Home Page" }} 
              register={register} 
            />
          </div>
        </SectionWrapper>

          {/* Dynamic Sections from Config */}
        {sections.map((section) => (
          <SectionWrapper 
            key={section.id} 
            title={section.title} 
            description={section.description}
          >
            {section.type === 'section' ? (
              <div className="space-y-6">
                {section.fields?.map((field) => (
                  <StandardField 
                    key={field.name} 
                    config={field} 
                    register={register}
                    openPicker={openMediaPicker}
                    watchValue={watch(field.name)}
                  />
                ))}
              </div>
            ) : (
              <DynamicList 
                control={control} 
                register={register} 
                config={section} 
                openPicker={openMediaPicker}
                watch={watch}
              />
            )}
          </SectionWrapper>
        ))}

        <MediaPickerModal 
          isOpen={pickerOpen} 
          onClose={() => setPickerOpen(false)} 
          onSelect={handleMediaSelect} 
        />

        {/* Fallback for unconfigured pages */}
        {sections.length === 0 && (
          <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200 flex gap-5">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 font-bold text-xl">!</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-2">No Schema Configured</h3>
              <p className="text-sm text-amber-800 leading-relaxed max-w-xl">
                We haven't defined a modular schema for <strong>{page.page_key}</strong> yet. 
                Existing JSON data will be preserved, but you can only edit the Page Title above.
              </p>
            </div>
          </div>
        )}

        {/* Sticky Footer for Saves */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e5e0d8] p-4 shadow-2xl flex items-center justify-between gap-4">
            <div className="hidden md:block pl-2">
              {error ? (
                <p className="text-sm text-red-600 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </p>
              ) : (
                <p className="text-xs text-gray-400 font-medium">Changes apply instantly to the public site once saved.</p>
              )}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl border border-[#e5e0d8] text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="flex-1 md:flex-none px-10 py-3 rounded-xl bg-[#be7b3b] text-white text-sm font-bold hover:bg-[#a86330] disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#be7b3b]/20"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Content</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
