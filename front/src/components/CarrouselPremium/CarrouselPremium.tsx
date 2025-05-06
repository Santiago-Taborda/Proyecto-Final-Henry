"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { ServiceProfileType } from "@/helpers/typeMock";
import verified from "../../../public/verified.png";
import profile from "../../../public/profile.png";

type Props = {
    serviceProfile: ServiceProfileType[];
};

const CarrouselPremium = ({ serviceProfile }: Props) => {
    return (
        <section className="my-10 px-4">
            <h2 className="text-2xl font-bold text-center text-primary dark:text-secondary py-8 ">
                Los destacados del mes ⭐
            </h2>

            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                spaceBetween={20}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                loop={true}
                watchOverflow={true}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="!pb-12"
            >
                {serviceProfile.map((service) => (
                    <SwiperSlide key={service.id} className="h-full flex">
                        <div className="flex flex-col justify-between h-60 w-full border p-4 rounded-lg shadow-lg bg-amber-500">
                            <Link href={`/services/${service.id}`} className="flex flex-col h-full flex-grow justify-between">
                                <div className="flex items-center gap-2 mb-2">
                                    <Image
                                        src={service.profilePicture || profile}
                                        alt="Foto de perfil"
                                        width={100}
                                        height={100}
                                        className="w-12 h-12 object-cover rounded-full border-2 border-quaternary dark:border-quinary"
                                    />
                                    <h3 className="text-lg font-semibold">{service.serviceTitle}</h3>
                                    <Image 
                                    src={verified}
                                    alt="Verificado"
                                    width={20}
                                    height={20}
                                    className="w-6 h-6 object-cover rounded-full"
                                    priority
                                    />
                                </div>

                                <div className="flex-grow">
                                    <p>Profesional: <span className="font-bold">{service.userName}</span></p>
                                    <p>Categoría: <span className="font-bold">{service.category?.name ?? "Categoría no disponible"}</span></p>
                                    <p>Precio Base: <span className="font-bold">${service.appointmentPrice}</span></p>
                                    <p>
                                        Descripción:{" "}
                                        {service.description && service.description.length > 80
                                            ? `${service.description.slice(0, 50)}...`
                                            : service.description ?? "Descripción no disponible"}
                                    </p>
                                </div>

                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                    {service.rating
                                        ? Array.from({ length: Math.floor(service.rating) }, (_, i) => (
                                            <FaStar key={i} className="text-secondary" />
                                        ))
                                        : <span className="text-secondary">Sin calificaciones</span>}
                                </div>
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default CarrouselPremium;
