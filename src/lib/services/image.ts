import imageCompression from 'browser-image-compression';

interface CompressionResult {
  compressed: Blob;
  thumbnail: Blob;
}

const FULL_IMAGE_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  fileType: 'image/jpeg' as const,
  initialQuality: 0.8,
};

const THUMBNAIL_OPTIONS = {
  maxSizeMB: 0.1,
  maxWidthOrHeight: 200,
  useWebWorker: true,
  fileType: 'image/jpeg' as const,
  initialQuality: 0.7,
};

export async function compressAndCreateThumbnail(file: File): Promise<CompressionResult> {
  try {
    const [compressed, thumbnail] = await Promise.all([
      imageCompression(file, FULL_IMAGE_OPTIONS),
      imageCompression(file, THUMBNAIL_OPTIONS),
    ]);

    return {
      compressed,
      thumbnail,
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to process image');
  }
}

export function createImageUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}

export async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
  });
}

