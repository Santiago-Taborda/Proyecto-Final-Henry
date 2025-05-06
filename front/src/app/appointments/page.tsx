import AppointmentForm from "@/components/AppointmentForm/AppointmentForm";
import RouteProtect from "@/components/RouteProtect/RouteProtect";

export const metadata = {
  title: "Agendar Turno | TecniClick",
};

export default function Page() {
  return (
    <RouteProtect>
      <AppointmentForm />
    </RouteProtect>
  );
}
