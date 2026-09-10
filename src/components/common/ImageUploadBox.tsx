import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, X, Check, Eye } from 'lucide-react';

interface ImageUploadBoxProps {
  label?: string;
  helperText?: string;
  value?: string;
  onChange: (dataUrlOrUrl: string) => void;
  onRemove?: () => void;
  aspectRatio?: 'square' | 'video' | 'banner' | 'category' | 'logo';
  maxHeight?: number;
  allowUrlToggle?: boolean;
  className?: string;
  aspectHint?: string;
  recommendedDimensions?: string;
}

export const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  label,
  helperText = 'PNG, JPG, WebP ফাইল আপলোড করুন (স্বয়ংক্রিয়ভাবে অপ্টিমাইজড)',
  value,
  onChange,
  onRemove,
  aspectRatio = 'square',
  maxHeight,
  allowUrlToggle = true,
  className = '',
  aspectHint,
  recommendedDimensions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    banner: 'aspect-[21/9]',
    category: 'aspect-[4/5]',
    logo: 'aspect-[3/1] max-h-24',
  };

  const compressImage = (
    dataUrl: string,
    fileType: string = 'image/jpeg',
    maxWidth = 1000,
    maxHeight = 850,
    quality = 0.78
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // If format is JPEG, paint white background so transparent parts don't turn black
            const isPng = fileType === 'image/png' || dataUrl.startsWith('data:image/png');
            const targetFormat = isPng ? 'image/webp' : 'image/jpeg';

            if (targetFormat === 'image/jpeg') {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, width, height);
            }

            ctx.drawImage(img, 0, 0, width, height);

            try {
              const compressed = canvas.toDataURL(targetFormat, quality);
              // Ensure browser actually supports webp export, otherwise fallback to jpeg
              if (compressed.startsWith('data:image/webp') || compressed.startsWith('data:image/jpeg')) {
                resolve(compressed);
                return;
              }
            } catch {}

            const fallbackJpg = canvas.toDataURL('image/jpeg', quality);
            resolve(fallbackJpg);
            return;
          }
        } catch (err) {
          console.warn('Canvas compression error, using original', err);
        }
        resolve(dataUrl);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ভ্যালিড ছবি (PNG/JPG/WebP) সিলেক্ট করুন।');
      return;
    }

    setIsProcessing(true);
    setPreviewError(false);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawResult = event.target?.result as string;
        if (rawResult) {
          const compressed = await compressImage(rawResult, file.type, 1000, 850, 0.78);
          onChange(compressed);
          setPreviewError(false);
          setJustSaved(true);
          setTimeout(() => setJustSaved(false), 3000);
        }
      } catch (err) {
        console.error('Error handling uploaded file:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setIsProcessing(false);
      alert('ছবি রিড করতে সমস্যা হয়েছে। অন্য একটি ছবি চেষ্টা করুন।');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      setPreviewError(false);
      onChange(tempUrl.trim());
      setShowUrlInput(false);
      setTempUrl('');
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-800 tracking-tight">{label}</label>
          {allowUrlToggle && (
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'ফাইল ড্রপজোন' : 'URL লিংক দিন'}</span>
            </button>
          )}
        </div>
      )}

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2 p-2 bg-amber-50/50 border border-amber-200 rounded-lg">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="https://example.com/image.png"
            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
          >
            প্রয়োগ করুন
          </button>
        </form>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Upload Box / Image Display */}
      {value && !previewError ? (
        <div
          className={`relative group rounded-xl overflow-hidden border border-stone-300 bg-stone-100 flex items-center justify-center ${
            aspectClasses[aspectRatio]
          }`}
          style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
        >
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-contain p-1"
            onError={() => setPreviewError(true)}
            referrerPolicy="no-referrer"
          />

          {/* Hover Overlay with Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-white/90 hover:bg-white text-stone-900 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
              title="নতুন ছবি পরিবর্তন করুন"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>পরিবর্তন</span>
            </button>

            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105"
                title="ছবি ডিলিট করুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Verified Badge */}
          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-900/90 backdrop-blur-xs text-white rounded text-[10px] font-mono flex items-center gap-1.5 shadow-xs">
            <Check className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold text-emerald-300">
              {justSaved ? 'ছবি সফলভাবে সেভ হয়েছে' : 'ছবি রেডি'}
            </span>
          </span>
        </div>
      ) : isProcessing ? (
        <div
          className={`relative border-2 border-amber-400 border-dashed rounded-xl p-4 text-center bg-amber-50/50 flex flex-col items-center justify-center gap-2 ${aspectClasses[aspectRatio]}`}
          style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
        >
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-amber-900">ছবি প্রসেস ও অপ্টিমাইজ হচ্ছে...</p>
          <p className="text-[10px] text-amber-700">কয়েক সেকেন্ড অপেক্ষা করুন</p>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-amber-500 bg-amber-50/70 scale-[1.01]'
              : 'border-stone-300 hover:border-amber-500/80 bg-stone-50/80 hover:bg-amber-50/20'
          } ${aspectClasses[aspectRatio]}`}
          style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800">
              <span className="text-amber-700 underline">ক্লিক করে ছবি আপলোড করুন</span> বা ড্র্যাগ করুন
            </p>
            <p className="text-[10px] text-stone-500 mt-0.5 font-medium">{helperText}</p>
          </div>
        </div>
      )}
    </div>
  );
};
