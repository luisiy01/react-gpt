import type { TranslateResponse } from "../../interfaces";

export const translateTextUseCase = async (prompt: string, lan: string) => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, lan })
        });

        if (!resp.ok) throw new Error('No se pudo realizar la traduccion');

        const { message } = await resp.json() as TranslateResponse;

        return {
            ok: true,
            message,
        }

    } catch (error) {
        console.error(error);
        return {
            ok: false,
            message: 'Error al traducir el texto',
        }
    }
}