import { useState } from "react";
import {
  GptMessage,
  GptMessageImage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleGenerateVariation = async () => {
    setIsLoading(true);
    const response = await imageVariationUseCase(
      originalImageAndMask.original!,
    );
    setIsLoading(false);
    if (!response) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la imagen", isGpt: true },
      ]);
    }
    setMessages((prev) => [
      ...prev,
      {
        text: "Variacion generada",
        isGpt: true,
        info: { imageUrl: response.url, alt: response.alt },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);

    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: "No se pudo generar la imagen", isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: { imageUrl: imageInfo.url, alt: imageInfo.alt },
      },
    ]);
  };

  return (
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            className="border rounded-xl w-36 h-36 object-contain"
            src={originalImageAndMask.original}
            alt="Original"
          />
          <button
            onClick={handleGenerateVariation}
            className="btn btn-primary mt-2"
          >
            Generar Variacion
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenida */}
            <GptMessage text="¿Que imagen deseas generar hoy?" />

            {messages.map((message, index) =>
              message.isGpt ? (
                <GptMessageImage
                  key={index}
                  imageUrl={message.info?.imageUrl || ""}
                  alt={message.info?.alt || ""}
                  onSelectedImage={(url) =>
                    setOriginalImageAndMask({
                      original: url,
                      mask: undefined,
                    })
                  }
                />
              ) : (
                <MyMessage key={index} text={message.text} />
              ),
            )}

            {isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )}
          </div>
        </div>

        <TextMessageBox
          onSendMessage={handlePost}
          placeholder="Escribe aqui tu pregunta"
          disableCorrections
        />
      </div>
    </>
  );
};
