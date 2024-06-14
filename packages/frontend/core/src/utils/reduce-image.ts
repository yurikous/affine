import reduce from 'image-blob-reduce';

// validate and reduce image size and return as file
export const validateAndReduceImage = async (file: File): Promise<File> => {
  // Declare a new async function that wraps the decode logic
  const decodeAndReduceImage = async (): Promise<Blob> => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    await img.decode().catch(() => {
      URL.revokeObjectURL(url);
      throw new Error('Image could not be decoded');
    });

    img.onload = img.onerror = () => {
      URL.revokeObjectURL(url);
    };

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10 || img.width > 4000 || img.height > 4000) {
      // Compress the file to less than 10MB
      const compressedImg = await reduce().toBlob(file, {
        max: 4000,
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      });
      return compressedImg;
    }

    return file;
  };

  try {
    const reducedBlob = await decodeAndReduceImage();

    return new File([reducedBlob], file.name, { type: file.type });
  } catch (error) {
    throw new Error('Image could not be reduce :' + error);
  }
};
