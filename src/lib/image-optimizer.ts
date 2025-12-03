/**
 * Image Optimization Utilities
 * Resize images for faster AI processing
 */

/**
 * Resize an image file to a maximum dimension while maintaining aspect ratio
 * @param file Original image file
 * @param maxDimension Maximum width or height (default: 1280px)
 * @returns Resized image as Blob
 */
export async function resizeImageBlob(file: File, maxDimension: number = 1280): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        const url = URL.createObjectURL(file);

        img.onload = () => {
            // Calculate new dimensions
            let width = img.width;
            let height = img.height;

            // Only resize if image is larger than maxDimension
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            // Create canvas and draw resized image
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url);

            // Determine output format based on input
            const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
            const outputType = isPng ? 'image/png' : 'image/jpeg';
            const outputQuality = isPng ? 1.0 : 0.92;

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                },
                outputType,
                outputQuality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}
