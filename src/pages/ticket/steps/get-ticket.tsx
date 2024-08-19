import { Ticket } from "lucide-react";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

export function GetTicket() {
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const ticketCode = form.get("ticket-code") as string;

    const checkInSchema = z.object({
      ticketCode: z.coerce
        .number()
        .int("O código do ingresso deve ser um número válido"),
    });

    const validationResult = checkInSchema.safeParse({
      ticketCode,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      errors.forEach((error) => toast.error(error.message));
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3333/attendees/${ticketCode}/badge`
      );

      if (!response.ok) {
        throw new Error("O código do ingresso não foi encontrado.");
      }

      navigate(`/ticket/${ticketCode}`);
    } catch (error) {
      console.error("Erro ao buscar os dados da credencial:", error);
      toast.error(
        "Não foi possível carregar a credencial. Verifique o código do ingresso."
      );
    }
  }

  return (
    <div className="ticket-page h-screen">
      <div className="max-w-[1216px] mx-auto px-4 flex justify-center h-full">
        <Toaster richColors theme="dark" />
        <div className="flex flex-col items-center gap-y-8 justify-center w-full max-w-sm">
          <img src="/src/assets/nlw-unite-logo.svg" alt="Logo NLW Unite" />

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-y-3"
          >
            <div className="px-3 py-4 border border-white/10 rounded-lg flex items-center gap-3">
              <label htmlFor="ticket-code" className="sr-only">
                Código do ingresso
              </label>
              <Ticket className="size-4 text-emerald-300 shrink-0" />
              <input
                id="ticket-code"
                name="ticket-code"
                className="bg-transparent placeholder:text-gray-200 outline-none border-0 p-0 text-sm focus:ring-0"
                placeholder="Código do ingresso"
                type="text"
              />
            </div>

            <button
              type="submit"
              className="bg-primary h-12 w-full font-bold text-xs hover:brightness-90 transition text-secondary rounded-md uppercase"
            >
              Acessar credencial
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
