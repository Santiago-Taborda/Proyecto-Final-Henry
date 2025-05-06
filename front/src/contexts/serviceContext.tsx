"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ServiceProfileType } from "@/helpers/typeMock";
import { getServiceProfile } from "@/services/profileService";

type ServiceContextType = {
    filteredServices: ServiceProfileType[];
    setSearchQuery: (query: string) => void;
    setCategory: (category: string | null) => void;
    setSortPrice: (order: "asc" | "desc" | null) => void;
    setMinRating: (rating: number | null) => void;
    selectedCategory: string | null;
    sortPrice: "asc" | "desc" | null;
    minRating: number | null;
    fetchFilteredServices: () => void;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const [services, setServices] = useState<ServiceProfileType[]>([]);
    const [filteredServices, setFilteredServices] = useState<ServiceProfileType[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState<string | null>(null);
    const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);
    const [minRating, setMinRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            const data = await getServiceProfile();
            setServices(data);
            setFilteredServices(data);
        };

        fetchServices();
    }, []);

    const fetchFilteredServices = () => {
        let filtered = [...services];

        if (searchQuery) {
            filtered = filtered.filter(service =>
                service.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (category) {
            filtered = filtered.filter(service => service.category?.id === category);
        }

        if (minRating !== null) {
            filtered = filtered.filter(service => service.rating !== null && service.rating >= minRating);
        }

        if (sortPrice) {
            filtered = filtered.sort((a, b) =>
                sortPrice === "asc"
                    ? a.appointmentPrice - b.appointmentPrice
                    : b.appointmentPrice - a.appointmentPrice
            );
        }

        setFilteredServices(filtered);
    };

    return (
        <ServiceContext.Provider
            value={{
                filteredServices,
                setSearchQuery,
                setCategory,
                setSortPrice,
                setMinRating,
                selectedCategory: category,
                sortPrice,
                minRating,
                fetchFilteredServices,
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

export const useServiceContext = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useServiceContext must be used within a ServiceProvider");
    }
    return context;
};