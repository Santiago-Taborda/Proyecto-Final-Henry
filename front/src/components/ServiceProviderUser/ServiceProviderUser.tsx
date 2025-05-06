"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { mediaType, ReviewType, ServiceProfileType } from "@/helpers/typeMock";
import profile from "../../../public/profile.png";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AppointmentHandler from "./AppointmentHandler";
import { getGalleryByProfileId } from "@/services/profileService";
import { getReviewsByServiceProfile } from "@/services/reviewServices";

const ServiceProviderUser: React.FC<ServiceProfileType> = ({
  userName,
  serviceTitle,
  category,
  description,
  profilePicture,
  appointmentPrice,
  id
}) => {
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);
  const [fetchedReviews, setFetchedReviews] = useState<ReviewType[]>([]);
  const [galleryImages, setGalleryImages] = useState<mediaType[]>([]);
  const { isAuthenticated } = useAuth();
  const router = useRouter();


  useEffect(() => {
    const fetchGalleryAndReviews = async () => {
      const images = await getGalleryByProfileId(id);
      setGalleryImages(images);

      const reviews = await getReviewsByServiceProfile(id);
      setFetchedReviews(reviews);
    };

    if (id) fetchGalleryAndReviews();
  }, [id]);

  const promedioRating =
    Array.isArray(fetchedReviews) && fetchedReviews.length > 0
      ? fetchedReviews.reduce((acc, r) => acc + r.rating, 0) / fetchedReviews.length
      : 0;

  // const currentImageUrl =
  //   modalImageIndex !== null ? galleryImages?.[modalImageIndex]?.type : null;

  const showPrevImage = () => {
    if (modalImageIndex !== null && modalImageIndex > 0) {
      setModalImageIndex(modalImageIndex - 1);
    }
  };

  const showNextImage = () => {
    if (
      modalImageIndex !== null &&
      galleryImages &&
      modalImageIndex < galleryImages.length - 1
    ) {
      setModalImageIndex(modalImageIndex + 1);
    }
  };

  return (
    <div className="bg-secondary pb-8 w-3/4 dark:bg-tertiary shadow-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b border-senbg-senary items-center justify-center">
        <div
          className="w-24 h-24 rounded-full overflow-hidden bg-senary relative cursor-pointer hover:scale-105 transition"
          onClick={() => setModalImageIndex(-1)} // -1 representa la imagen de perfil
        >
          <Image
            src={profilePicture || profile}
            alt={userName}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">{userName}</h2>
          <p className="text-sm font-semibold text-tertiary dark:text-secondary mt-1 capitalize">
            {serviceTitle || "Sin servicio"} - {category.name}
          </p>
          <p className="text-lg text-secondary dark:text-secondary font-extrabold border rounded text-center bg-primary dark:bg-quinary">
            ${appointmentPrice}
          </p>

          <div className="flex items-center justify-center sm:justify-start mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={`text-yellow-400 ${i < Math.round(promedioRating)
                  ? "opacity-100"
                  : "opacity-50"
                  }`}
              />
            ))}
            <span className="ml-2 text-sm text-tertiary dark:text-senary">
              {promedioRating.toFixed(1)} / 5
            </span>
          </div>

          <div className="mt-4 sm:mt-2">
          
            <AppointmentHandler
              isAuthenticated={isAuthenticated}  // Pasar el estado de autenticación
              onClick={(event) => {
                event.preventDefault(); // Para evitar el comportamiento predeterminado
                if (!isAuthenticated) {
                  toast.error("Debes iniciar sesión para poder reservar un turno!");
                  return;
                }
                router.push(`/appointments?id=${id}`);
              }}
            />
          </div>
        </div>
      </div>

      {/* Sobre mí */}
      {description && (
        <section className="py-4">
          <h3 className="text-lg font-semibold mb-2">Sobre mí</h3>
          <p className="text-sm text-tertiary dark:text-secondary">
            {description}
          </p>
        </section>
      )}
      {/* Galería */}
      <section className="py-4">
        <h3 className="text-lg font-semibold mb-2">
          Galería de trabajos realizados
        </h3>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded shadow-xl bg-primary dark:bg-quinary"
        >
          {galleryImages?.length ? (
            galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative w-full aspect-square rounded-md overflow-hidden cursor-pointer hover:scale-105 transition shadow-sm"
                onClick={() => setModalImageIndex(index)}
              >
                <Image
                  src={image.imgUrl}
                  alt={`${userName} - Imagen ${index + 1}`}
                  layout="fill"
                  priority
                  className="object-cover bg-black"
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-senary col-span-full text-center">
              El profesional no ha publicado imágenes
            </p>
          )}
        </div>
      </section>
¿¿


      {/* Comentarios */}
      <section className="py-4">
        <h3 className="text-lg font-semibold mb-2">Opiniones de clientes</h3>
        {Array.isArray(fetchedReviews) && fetchedReviews.length > 0 ? (
          fetchedReviews.map((review, i) => (
            <div
              key={i}
              className="mb-3 p-3 bg-secondary dark:bg-quinary shadow-lg rounded-md border border-tertiary"
            >
              <div className="flex text-yellow-500 text-sm">
                {Array.from({ length: review.rating }, (_, j) => (
                  <FaStar key={j} />
                ))}
              </div>
              <p className="text-sm text-tertiary dark:text-secondary mb-1">{review.comment}</p>
              <p className="text-sm text-tertiary dark:text-secondary mb-1">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-tertiary dark:text-senary">No hay reseñas disponibles.</p>
        )}
      </section>

      {/* Modal de imagen */}
      {modalImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4"
          onClick={() => setModalImageIndex(null)}
        >
          <div
            className="bg-secondary p-4 rounded-lg max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square bg-gray-300 rounded-md overflow-hidden">
              <Image
                src={
                  modalImageIndex === -1
                    ? profilePicture || profile
                    : galleryImages[modalImageIndex]?.imgUrl || profile
                }
                alt="Imagen ampliada"
                fill
              />
            </div>

            {/* Botones de navegación */}
            {modalImageIndex !== -1 && galleryImages?.length > 1 && (
              <div className="flex justify-between mt-4">
                <button
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                  onClick={showPrevImage}
                  disabled={modalImageIndex === 0}
                >
                  Anterior
                </button>
                <button
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                  onClick={showNextImage}
                  disabled={modalImageIndex === galleryImages.length - 1}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderUser;
