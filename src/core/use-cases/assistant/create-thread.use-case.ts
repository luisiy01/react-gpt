export const createThreadUseCase = async () => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/create-thread`,
      {
        method: "POST",
      },
    );

    if (!resp.ok) throw new Error("No se pudo crear el thread");

    const { id } = (await resp.json()) as { id: string };

    return id;
  } catch (error) {
    return "Error al crear el thread";
  }
};
