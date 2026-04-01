import type { ProsConsResponse } from "../../interfaces";

export const prosConsStreamUseCase = async (prompt: string) => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!resp.ok) throw new Error('No se pudo realizar la comparacion');

        const reader = resp.body?.getReader();

        if (!reader) {
            console.log('No se pudo obtener el reader');
            return null
        }

        return reader;

        /*  const decoder = new TextDecoder();
         let text = '';
 
         while (true) {
             const { done, value } = await reader.read();
             if (done) break;
 
             const chunk = decoder.decode(value, { stream: true });
             text += chunk;
             console.log(chunk);
         } */
    } catch (error) {
        console.log(error)
        return null
    }
}