import { useState } from "react"
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBox, TextMessageBoxSelect, TypingLoader } from "../../components"
import { textToAudioUseCase } from "../../../core/use-cases";

const disclaimer = `## ¿Que audio quieres generar hoy?
* Todo el audio generado es por IA`

const voices = [
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
]

interface TextMessage {
    text: string;
    isGpt: boolean;
    type: 'text'
}

interface AudioMessage {
    text: string;
    audioUrl: string;
    isGpt: boolean;
    type: 'audio'
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string, selectedVoice: string) => {
        setIsLoading(true);
        setMessages(prev => [...prev, { text, isGpt: false, type: 'text' }]);

        const { ok, audioUrl, message } = await textToAudioUseCase(text, selectedVoice);

        setIsLoading(false);

        if (!ok) return;

        setMessages(prev => [...prev, { text: `${selectedVoice} - ${message}`, audioUrl: audioUrl!, isGpt: true, type: 'audio' }]);



    }

    return (
        <div className='chat-container'>
            <div className='chat-messages'>
                <div className='grid grid-cols-12 gap-y-2'>

                    {/* Bienvenida */}
                    <GptMessage text={disclaimer} />

                    {messages.map((message, index) => (
                        message.isGpt ? (

                            message.type === 'audio'
                                ? <GptMessageAudio key={index} text={message.text} audioUrl={message.audioUrl} />
                                : <GptMessage key={index} text={message.text} />

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

            <TextMessageBoxSelect
                onSendMessage={handlePost}
                placeholder="Escribe aqui tu pregunta"
                options={voices}
            />
        </div>
    )
}