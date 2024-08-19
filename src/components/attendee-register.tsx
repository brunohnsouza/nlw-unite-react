import { CircleUserRound, AtSign } from "lucide-react";
import { z } from "zod";
import { Toaster, toast } from "sonner";

interface AttendeeRegisterProps {
  eventId: string;
}

export function AttendeeRegister({ eventId }: AttendeeRegisterProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const name = form.get("name") as string;
    const email = form.get("email") as string;

    const attendeeSchema = z.object({
      name: z.string().min(4, "O nome deve ter pelo menos 4 caracteres"),
      email: z.string().email("E-mail inválido"),
    });

    const validationResult = attendeeSchema.safeParse({ name, email });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      errors.forEach((error) => toast.error(error.message));
      return;
    }

    const url = new URL(`http://localhost:3333/events/${eventId}/attendees`);

    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        console.error(data);
        toast.error("Erro ao realizar inscrição.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao realizar a inscrição.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold">Inscrição</h2>

        <Toaster richColors theme="dark" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start md:flex-row md:items-center gap-3"
      >
        <div className="px-3 py-2 border border-white/10 rounded-lg max-w-full w-72 flex items-center gap-3">
          <label htmlFor="name" className="sr-only">
            Nome do participante
          </label>
          <CircleUserRound className="size-4 text-emerald-300 shrink-0" />
          <input
            id="name"
            name="name"
            className="bg-transparent placeholder:text-gray-200 flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Nome completo"
            type="text"
          />
        </div>

        <div className="px-3 py-2 border border-white/10 rounded-lg max-w-full w-72 flex items-center gap-3">
          <label htmlFor="email" className="sr-only">
            E-mail do participante
          </label>
          <AtSign className="size-4 text-emerald-300 shrink-0" />
          <input
            id="email"
            name="email"
            className="bg-transparent placeholder:text-gray-200 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="E-mail"
            type="email"
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-5 h-9 font-bold text-xs hover:brightness-90 transition text-secondary rounded-md uppercase"
        >
          Realizar inscrição
        </button>
      </form>
    </div>
  );
}
