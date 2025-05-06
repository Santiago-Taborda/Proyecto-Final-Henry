"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { updateServiceProfileToPremium } from "@/services/profileService";
import { FormEvent } from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function SubscriptionForm() {
  const { user, updateService, token } = useAuth()
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe no está listo todavía.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("No se pudo obtener el los datos de la tarjeta.");
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      toast.error(error.message || "Error procesando la tarjeta.");
    } else if (paymentMethod && !user) {
      toast.error("Por favor registre y loguee su usuario para concretar la transacción");
    } else if (paymentMethod && user && (!user.serviceProfile || user.serviceProfile.status != "active")) {
      toast.error("Por favor registre su usuario como proveedor de servicio para concretar la transacción");
    } else if (token && paymentMethod && user && user.serviceProfile && user.serviceProfile.status == "active") {
      const response = updateServiceProfileToPremium(paymentMethod.id, 1000, token);
      
      toast.promise(response, {
        loading: "Espere mientras registramos el pago...",
        success: (subscription) => {
          
          updateService({...user.serviceProfile!, subscription })
          cardElement.clear();
          router.push("/")
          return "Se registró exitosamente como Usuario Premium";
        },
        error: (data) =>
          `Error al registrar el pago (${data || "pruebe otro método"})`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <CardElement className="p-2 border-2 bg-senary rounded-sm" />
      <button
        type="submit"
        className="w-full buttons mt-4"
      >
        Suscribirme
      </button>
    </form>
  );
}
