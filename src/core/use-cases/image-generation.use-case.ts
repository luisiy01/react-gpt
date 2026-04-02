type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageGenerationUseCase = async (
  prompt: string,
  originalImage?: string,
  maskImage?: string,
): Promise<GeneratedImage> => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_API_URL}/image-generation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          originalImage,
          maskImage,
        }),
      },
    );

    if (!resp.ok) {
      throw new Error("Error al generar la imagen");
    }

    const { url, revisedPrompt: alt } = await resp.json();
    return { url, alt };
  } catch (error) {
    console.error(error);
    return null;
  }
};
