import type { OrthographyResponse } from "../../interfaces/orthography.response";

export const audioToTextUseCase = async (prompt?: string, audioFile: File) => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: JSON.stringify({ prompt })
        });

        if (!resp.ok) throw new Error('No se pudo realizar la correción');

        const data = await resp.json() as OrthographyResponse;

        return {
            ok: true,
            ...data
        }

    } catch (error) {

        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No se pudo realizar la correción'
        }
    }
}