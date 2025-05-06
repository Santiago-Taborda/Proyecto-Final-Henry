import ServicesPage from "@/components/ServicesPage/ServicesPage";

export const metadata = {
    title: "Buscar Servicio | TecniClick",
};
  

export default function Services() {
    return (
        <div>
            <div>
                <h2 className="font-semibold dark:bg-tertiary text-center py-2">Servicios</h2>
            </div>
            <div className="bg-gradient-banner flex items-center justify-center w-full">
                <ServicesPage />
            </div>

        </div>

    );
};