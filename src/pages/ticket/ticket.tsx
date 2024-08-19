import Arrow from "@/icons/arrow";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { z } from "zod";
import { DialogDescription } from "@radix-ui/react-dialog";

export function Ticket() {
  const [attendeeId, setAttendeeId] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeeName, setAttendeeName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [attendeeCheckInUrl, setAttendeeCheckInUrl] = useState("");

  async function handleShare() {
    const url = window.location.href;
    const title = `Minha credencial do ${eventTitle}`;
    const text = `Confira minha credencial do ${eventTitle}!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        toast.success("Credencial compartilhada com sucesso!");
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("URL copiada para a área de transferência!");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast.error("Não foi possível compartilhar a credencial.");
    }
  }

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const id = url.pathname.split("/").pop();

    const idSchema = z.object({
      id: z.coerce
        .number()
        .int("O ID do participante deve ser um número válido"),
    });

    const validationResult = idSchema.safeParse({
      id,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      errors.forEach((error) => toast.error(error.message));
      return;
    }

    if (id) {
      setAttendeeId(id);
    }

    // URL da API usando a variável de ambiente para definir o IP local
    const apiUrl = new URL(
      `http://${import.meta.env.VITE_LOCAL_IP}:3333/attendees/${id}/badge`
    );

    try {
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar os dados do participante");
          }
          return response.json();
        })
        .then((data) => {
          const { name, email, eventTitle, checkInURL } = data.badge;
          setAttendeeName(name);
          setAttendeeEmail(email);
          setEventTitle(eventTitle);
          setAttendeeCheckInUrl(checkInURL);
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados da credencial:", error);
          toast.error("Não foi possível carregar a credencial.");
        });
    } catch (error) {
      console.error("Erro ao buscar os dados da credencial:", error);
      toast.error("Não foi possível carregar a credencial.");
    }
  }, []);

  return (
    <div className="ticket-page min-h-screen relative">
      <header className="absolute bg-black/20 top-0 h-24 pb-7 z-20 flex items-end justify-center border-b border-foreground/10 w-full">
        <span className="font-medium md:text-lg">Minha credencial</span>
        <Toaster richColors theme="dark" />
      </header>

      <div className="max-w-[1216px] mx-auto px-4 pb-10 flex flex-col items-center gap-y-8">
        <div className="bg-black/20 mt-48 w-full max-w-sm min-h-[500px] border border-foreground/10 rounded-2xl overflow-hidden">
          <img
            src="/src/assets/nlw-unite-track.svg"
            className="w-24 mx-auto absolute inset-0 z-10"
            alt="Faixa do crachá"
          />

          <div className="px-6 py-8 bg-[url('/src/assets/nlw-unite-bg-ticket.svg')] border-b border-foreground/10 h-40 bg-no-repeat bg-center bg-cover flex flex-col justify-start">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm">{eventTitle}</span>
              <span className="font-bold text-sm">#{attendeeId}</span>
            </div>

            <div className="relative">
              <img
                src="/src/assets/nlw-unite-subtract.svg"
                className="h-24 absolute inset-0 mx-auto"
                alt=""
              />
              <img
                className="absolute inset-0 top-2 rounded-full size-32 mx-auto"
                src="/src/assets/nlw-unite-avatar.svg"
                alt="Avatar do participante"
              />
            </div>
          </div>

          <div className="flex items-center justify-center pt-20 pb-6">
            <div className="space-y-7 text-center">
              <div className="flex flex-col gap-y-1">
                <h1 className="text-2xl font-bold capitalize">
                  {attendeeName}
                </h1>
                <p className="text-muted-foreground lowercase">
                  {attendeeEmail}
                </p>
              </div>

              <div className="flex justify-center">
                <QRCode
                  value={attendeeCheckInUrl}
                  bgColor="transparent"
                  fgColor="#FFFFFF"
                  className="rounded-sm"
                  size={120}
                />
              </div>

              <Dialog>
                <DialogTrigger className="text-primary text-sm transition hover:brightness-90">
                  Ampliar QRCode
                </DialogTrigger>

                <DialogContent className="flex flex-col justify-center border-none shadow-none">
                  <DialogHeader className="text-start">
                    <DialogTitle>QRCode da credencial</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Aponte a câmera do seu celular para realizar o check-in no
                    evento.
                  </DialogDescription>

                  <QRCode
                    value={attendeeCheckInUrl}
                    bgColor="transparent"
                    fgColor="#FFFFFF"
                    className="rounded-sm mx-auto"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Arrow className="animate-bounce" />

        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="font-bold text-2xl">Compartilhar credencial</h2>
            <p className="text-muted-foreground text-sm">
              Mostre ao mundo que você vai participar do {eventTitle}!
            </p>
          </div>

          <button
            onClick={handleShare}
            className="bg-primary h-12 w-full font-bold text-xs hover:brightness-90 transition text-secondary rounded-md uppercase"
          >
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
