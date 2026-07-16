import { Reveal } from './features/Reveal';
import { Timeline } from './Timeline';
import type { ContentBlock as ContentBlockType, ContentImage } from '../types';

function renderFormattedText(text: string, className = 'body-copy mb-4') {
  const paragraphs = text.split('\n').filter((p) => p.trim() !== '');

  return paragraphs.map((para, i) => {
    const parts = para.split(/(\*\*.*?\*\*)/g);

    return (
      <p key={i} className={className}>
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-semibold text-[var(--text-strong)]">
                {part.slice(2, -2)}
              </strong>
            );
          }

          return part;
        })}
      </p>
    );
  });
}

function getBlockImages(block: ContentBlockType): ContentImage[] {
  const images = block.images?.map((image) => (typeof image === 'string' ? { src: image } : image)) ?? [];

  if (images.length > 0) {
    return images.slice(0, 4).filter((image) => image.src);
  }

  return block.image ? [{ src: block.image, alt: block.imageAlt }] : [];
}

interface ContentBlockProps {
  block: ContentBlockType;
  compact?: boolean;
  onPreviewImage: (image: { src: string; alt: string }) => void;
}

export function ContentBlock({ block, compact = false, onPreviewImage }: ContentBlockProps) {
  if (block.type === 'timeline') {
    return <Timeline items={block.timelineItems || []} />;
  }

  const isImageLeft = block.imagePosition === 'left';
  const blockImages = getBlockImages(block);
  const hasImageLayout = block.type === 'imageText' && blockImages.length > 0;
  const imageGridClass =
    blockImages.length === 1
      ? 'grid-cols-1'
      : blockImages.length === 2
        ? 'grid-cols-2'
        : 'grid-cols-2 grid-rows-2';
  const textContent = (
    <div>
      {block.subtitle && <p className="mb-3 text-sm font-semibold uppercase tracking-normal text-[var(--accent)]">{block.subtitle}</p>}
      {block.title && <h3 className="heading-font mb-4 text-2xl font-bold text-[var(--text-strong)] md:text-3xl">{block.title}</h3>}
      {block.content && renderFormattedText(block.content)}

      {block.assets && block.assets.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {block.assets.map((asset, assetIdx) => (
            <a key={assetIdx} href={asset.href} target="_blank" rel="noreferrer" className="asset-link transition">
              {asset.label}
            </a>
          ))}
        </div>
      )}

      {block.tags && block.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {block.tags.map((tag, tagIdx) => (
            <span key={tagIdx} className="tag-pill rounded-full px-3 py-1 text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (!hasImageLayout) {
    return <Reveal className={compact ? '' : 'max-w-4xl'}>{textContent}</Reveal>;
  }

  return (
    <Reveal>
      <div
        className={`grid items-center gap-8 md:gap-12 ${
          isImageLeft
            ? 'md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'
            : 'md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
        }`}
      >
        <div className={isImageLeft ? 'md:order-1' : 'md:order-2'}>
          <div className={`media-frame image-preview-grid grid aspect-[5/3] ${imageGridClass} overflow-hidden rounded-md border shadow-xl`}>
            {blockImages.map((image, imageIdx) => {
              const imageAlt = image.alt || block.imageAlt || block.title || `Portfolio image ${imageIdx + 1}`;

              return (
                <button
                  key={`${image.src}-${imageIdx}`}
                  type="button"
                  className="image-preview-trigger overflow-hidden"
                  onClick={() => onPreviewImage({ src: image.src, alt: imageAlt })}
                  aria-label={`Open larger preview of ${imageAlt}`}
                >
                  <img
                    src={image.src}
                    alt={imageAlt}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
        <div className={isImageLeft ? 'md:order-2' : 'md:order-1'}>{textContent}</div>
      </div>
    </Reveal>
  );
}
