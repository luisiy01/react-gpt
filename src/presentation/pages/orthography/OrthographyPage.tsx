import { useState } from "react"
import { GptMessage, GptOrrthographyMessage, MyMessage, TextMessageBox, TextMessageBoxFile, TextMessageBoxSelect, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        userScore: number;
        errors: string[];
        message: string;
    }
}

export const OrthographyPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string) => {
        setIsLoading(true);
        setMessages(prev => [...prev, { text, isGpt: false }]);

        const { ok, errors, message, userScore } = await orthographyUseCase(text);

        if (!ok) {
            setMessages(prev => [...prev, { text: 'No se pudo realizar la corrección', isGpt: true }]);
        } else {
            setMessages(prev => [...prev, {
                text: message, isGpt: true, info: {
                    userScore,
                    errors,
                    message
                }
            }]);
        }

        setIsLoading(false);
    }

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                <div className='grid grid-cols-12 gap-y-2'>

                    {/* Bienvenida */}
                    <GptMessage text="Hola, puedes escribit tu texto" />

                    {messages.map((message, index) => (
                        message.isGpt ? (
                            <GptOrrthographyMessage key={index}
                                {...message.info!}
                            />
                        ) : (
                            <MyMessage key={index} text={message.text} />
                        )
                    ))}

                    {
                        isLoading && (
                            <div className="col-start-1 col-end-12 fade-in">
                                <TypingLoader />
                            </div>
                        )
                    }


                </div>
            </div>

            <TextMessageBox
                onSendMessage={handlePost}
                placeholder="Escribe aqui tu pregunta"
                disableCorrections
            />

        </div>
    )
}