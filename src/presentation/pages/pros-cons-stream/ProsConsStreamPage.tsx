import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsStreamGeneratorUseCase, prosConsStreamUseCase } from "../../../core/use-cases";

interface Message {
    text: string;
    isGpt: boolean;
}

export const ProsConsStreamPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string) => {
        setIsLoading(true);
        setMessages(prev => [...prev, { text, isGpt: false }]);

        const stream = await prosConsStreamGeneratorUseCase(text);
        setIsLoading(false);
        setMessages(prev => [...prev, { text: '', isGpt: true }]);

        for await (const message of stream) {
            setMessages((messages) => {
                const newMessages = [...messages];
                newMessages[newMessages.length - 1].text = message;
                return newMessages;
            });
        }
    }

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                <div className='grid grid-cols-12 gap-y-2'>

                    {/* Bienvenida */}
                    <GptMessage text="¿Que deseas comparar hoy?" />

                    {messages.map((message, index) => (
                        message.isGpt ? (
                            <GptMessage key={index} text={message.text} />
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