import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChangeEvent, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { IconButton } from "./icon-button";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

interface AttendeeListProps {
  eventId: string;
}

export function AttendeeList({ eventId }: AttendeeListProps) {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());
    return url.searchParams.get("search") ?? "";
  });

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());
    return Number(url.searchParams.get("page")) || 1;
  });

  const [totalAttendees, setTotalAttendees] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const totalPages = Math.ceil(totalAttendees / 10);

  useEffect(() => {
    const url = new URL(`http://localhost:3333/events/${eventId}/attendees`);

    url.searchParams.set("pageIndex", String(page - 1));

    if (search.length > 0) {
      url.searchParams.set("query", search);
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do participante");
        }
        return response.json();
      })
      .then((data) => {
        setAttendees(data.attendees);
        setTotalAttendees(data.total);
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados do participante:", error);
        toast.error("Não foi possível carregar os dados.");
      });
  }, [eventId, page, search]);

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString());

    url.searchParams.set("search", search);

    window.history.pushState({}, "", url);

    setSearch(search);
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString());

    url.searchParams.set("page", String(page));

    window.history.pushState({}, "", url);
    setPage(page);
  }

  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToLastPage() {
    setCurrentPage(totalPages);
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1);
  }

  function goToNextPage() {
    setCurrentPage(page + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 md:items-center flex-col md:flex-row">
        <h2 className="text-2xl font-bold">Participantes</h2>
        <div className="px-3 max-w-full w-72 py-2 border border-white/10 rounded-lg flex items-center gap-3">
          <Search className="size-4 text-emerald-300 shrink-0" />
          <input
            value={search}
            onChange={onSearchInputChanged}
            className="bg-transparent placeholder:text-gray-200 flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Buscar participante..."
            type="text"
          />
          <Toaster richColors theme="dark" />
        </div>
      </div>

      <div className="border border-white/10 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-foreground">Código</TableHead>
              <TableHead className="text-foreground">Participante</TableHead>
              <TableHead className="text-foreground">
                Data da inscrição
              </TableHead>
              <TableHead className="text-foreground">
                Data do check-in
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell className="text-muted-foreground">
                  {attendee.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold capitalize">
                      {attendee.name}
                    </span>
                    <span className="text-muted-foreground lowercase">
                      {attendee.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {dayjs().to(attendee.createdAt)}
                </TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <a
                      href="/ticket"
                      className="text-emerald-300 transition hover:brightness-90"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Confirmar check-in
                    </a>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-transparent">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="text-muted-foreground">
                Mostrando {attendees.length} de {totalAttendees} itens
              </TableCell>
              <TableCell className="text-right" colSpan={3}>
                <div className="inline-flex items-center gap-8">
                  <span className="text-muted-foreground">
                    Página {page} de {totalPages}
                  </span>
                  <div className="flex gap-1.5">
                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                      <ChevronsLeft className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={goToPreviousPage}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={goToNextPage}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={goToLastPage}
                      disabled={page === totalPages}
                    >
                      <ChevronsRight className="size-4" />
                    </IconButton>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
