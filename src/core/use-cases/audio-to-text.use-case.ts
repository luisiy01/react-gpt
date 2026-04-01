import type { AudioToTextResponse } from "../../interfaces";
import type { OrthographyResponse } from "../../interfaces/orthography.response";

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {

    try {

        const formData = new FormData();
        formData.append('file', audioFile);
        if (prompt) {
            formData.append('prompt', prompt);
        }

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`, {
            method: 'POST',
            body: formData
        });

        if (!resp.ok) throw new Error('No se pudo realizar la correción');

        const data = await resp.json() as AudioToTextResponse;

        return {
            ok: true,
            ...data
        }

    } catch (error) {
        console.log(error);
        return null
    }
}