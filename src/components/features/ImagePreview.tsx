import { useEffect } from 'react';

interface ImagePreviewProps {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}

export function ImagePreview({ image, onClose }: ImagePreviewProps) {
  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="image-modal fixed inset-0 z-[80] grid place-items-center px-4 py-8" role="dialog" aria-modal="true">
      <button type="button" className="image-modal-backdrop absolute inset-0" onClick={onClose} aria-label="Close image preview" />
      <div className="image-modal-panel relative z-10 w-full max-w-5xl rounded-md border p-3 shadow-2xl">
        <button type="button" className="image-modal-close absolute right-3 top-3 rounded-md border px-3 py-1.5 text-sm font-semibold" onClick={onClose}>
          Close
        </button>
        <img src={image.src} alt={image.alt} className="max-h-[82vh] w-full rounded object-contain" />
      </div>
    </div>
  );
}
