import {
    UserType,
    ServiceProfileType,
    AppointmentType,
    ReviewType,
    OrderType,
    mediaType,
    CategoryType,
    UserRole,
    AppointmentStatus,
    OrderStatus,
    SubscriptionStatus,
    SubscriptionType
} from './typeMock';

// Categorías
export const categoriesMock: CategoryType[] = [
    {
        id: "cat1",
        name: "Plomero",
        description: "Servicios profesionales de plomeria",
        services: [],
        user: []
    },
    {
        id: "cat2",
        name: "Electricista",
        description: "Servicios profesionales de electricidad",
        services: [],
        user: []
    },
    {
        id: "cat3",
        name: "Gasista",
        description: "Servicios profesionales de gas",
        services: [],
        user: []
    },
    {
        id: "cat4",
        name: "Carpintero",
        description: "Servicios profesionales de carpintería",
        services: [],
        user: []
    },
    {
        id: "cat5",
        name: "Mecánico",
        description: "Servicios profesionales de mecánica",
        services: [],
        user: []
    },
    {
        id: "cat6",
        name: "Jardinero",
        description: "Servicios profesionales de jardinería",
        services: [],
        user: []
    },
    {
        id: "cat7",
        name: "Servicio de limpieza",
        description: "Servicios de limpieza y mantenimiento del hogar",
        services: [],
        user: []
    },
    {
        id: "cat8",
        name: "Albañil",
        description: "Servicios profesionales de albañilería",
        services: [],
        user: []
    },
    {
        id: "cat9",
        name: "Instalador de baños",
        description: "Servicios de instalación y reparación de baños",
        services: [],
        user: []
    },
    {
        id: "cat10",
        name: "Pintor",
        description: "Servicios profesionales de pintura",
        services: [],
        user: []
    },
    {
        id: "cat11",
        name: "Reparador de electrodomésticos",
        description: "Servicios de reparación y mantenimiento de electrodomésticos",
        services: [],
        user: []
    },
    {
        id: "cat12",
        name: "Técnico en celulares",
        description: "Reparación y mantenimiento de celulares",
        services: [],
        user: []
    },
    {
        id: "cat13",
        name: "Técnico informático",
        description: "Soporte y mantenimiento de equipos informáticos",
        services: [],
        user: []
    },
    {
        id: "cat14",
        name: "Instalador de antenas",
        description: "Servicios de instalación y mantenimiento de antenas",
        services: [],
        user: []
    },
    {
        id: "cat15",
        name: "Chef",
        description: "Servicios profesionales de cocina",
        services: [],
        user: []
    },
    {
        id: "cat16",
        name: "Chofer",
        description: "Servicios de transporte y conducción",
        services: [],
        user: []
    },
    {
        id: "cat17",
        name: "Profesor particular",
        description: "Clases particulares de diversas materias",
        services: [],
        user: []
    },
    {
        id: "cat18",
        name: "Niñera",
        description: "Cuidado de niños y asistencia familiar",
        services: [],
        user: []
    }
];


// Media
export const mediaMock: mediaType[] = [
    { id: "img1", imgUrl: "https://resizer.iproimg.com/unsafe/1280x/filters:format(webp):quality(85)/https://assets.iprofesional.com/assets/jpg/2019/08/482892.jpg" },
    { id: "img2", imgUrl: "https://economis.com.ar/wp-content/uploads/2024/03/plomero.jpg.webp" },
    { id: "img3", imgUrl: "https://media.istockphoto.com/id/1372761173/es/foto/joven-embarazada-pintando-sala-de-guarder%C3%ADa.jpg?s=612x612&w=0&k=20&c=eydfddfwPqo8-fc6kAWKTcNw-IkYYPYMEJ3b4FGPYJA=" },
    { id: "img4", imgUrl: "https://www.indomio.es/news/app/uploads/2024/06/7-tonos-azules-para-pintar-las-paredes-de-tu-casa-768x432.jpeg" },
    { id: "img5", imgUrl: "https://ait.org.ar/wp-content/uploads/2024/12/electricista-trabajando.jpg" },
    { id: "img6", imgUrl: "https://electricistasadomicilio24horas.com/wp-content/uploads/2024/11/electricista-650x434.webp" },
    { id: "img7", imgUrl: "https://medac.es/sites/default/files/styles/img_blog_big/public/blog/destacadas/C%C3%B3mo%20ser%20electricista.jpg?itok=N7Sp1z5c" },
];

// Servicios
export const servicesMock: ServiceProfileType[] = [
    {
        id: "service1",
        userName: "Raul Perez",
        userId: "user1",
        appointments: [],
        reviews: [],
        serviceTitle: "Servicio de Plomería Express",
        address: {
            extNumber: "123",
            intNumber: "",
            street: "Calle Principal",
            neighborhood: "Centro",
            zipCode: "12345",
            city: "Ciudad",
            state: "Estado",
            country: "País"
        },
        rating: 4.5,
        category: categoriesMock[0],
        description: "Servicio profesional de plomeria con atención 24/7",
        appointmentPrice: 150,
        images: [mediaMock[0], mediaMock[1]],
        subscription: null,
        orders: [],
        createdAt: new Date(2025, 0, 1),
        updatedAt: new Date(2025, 0, 1),
        deletedAt: null,
        user: {
            id: "user1",
            name: "Raul Perez",
            email: "raul@example.com",
            password: '',
            phone: '',
            address: '',
            role: UserRole.customer,
            interests: [],
            imgUrl: null,
            services: null,
            appointments: [],
            reviews: [],
            orders: [],
            createdAt: new Date(2025, 0, 1),
            updatedAt: new Date(2025, 0, 1),
            deletedAt: null
        }
    }
]

// Usuarios
export const usersMock: UserType[] = [
    {
        id: "user1",
        name: "Raul Pérez",
        email: "Raul@example.com",
        password: "hashedPassword1",
        phone: "+123456701",
        address: "Calle Principal 123",
        role: UserRole.provider,
        interests: ["Plomería", "Electricidad", "Carpintería"],
        imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2J6z_ttRcwLFMPSUoYGnwYJZ_t_Z-p4HNDA&s",
        services: servicesMock[0],
        appointments: [],
        reviews: [],
        orders: [],
        createdAt: new Date(2025, 0, 1),
        updatedAt: new Date(2025, 0, 1),
        deletedAt: null
    },
    {
        id: "user2",
        name: "Marta Diaz",
        email: "marta@example.com",
        password: "hashedPassword2",
        phone: "+123456702",
        address: "Avenida Central 456",
        role: UserRole.provider,
        interests: ["Pintor", "Carpintería"],
        imgUrl: "https://img.freepik.com/vector-premium/constructor-lindo-pincel-rodillos-cubo-pintura-personaje-pintora-nina-sombrero-duro-mono-azul-herramientas-construccion-ilustracion-vectorial-estilo-dibujos-animados_178650-40214.jpg?w=740",
        services: servicesMock[13],
        appointments: [],
        reviews: [],
        orders: [],
        createdAt: new Date(2025, 0, 2),
        updatedAt: new Date(2025, 0, 2),
        deletedAt: null
    },
    {
        id: "user3",
        name: "Luis Fernandez",
        email: "luis@example.com",
        password: "hashedPassword3",
        phone: "+123456703",
        address: "Plaza Mayor 789",
        role: UserRole.provider,
        interests: ["Electricidad", "Jardinería", "Pintura"],
        imgUrl: "https://www.yotesalvo.com/wp-content/uploads/2024/10/tecnico-electricista-a-domicilio.png.webp",
        services: servicesMock[3],
        appointments: [],
        reviews: [],
        orders: [],
        createdAt: new Date(2025, 0, 3),
        updatedAt: new Date(2025, 0, 3),
        deletedAt: null
    },
    {
        id: "user4",
        name: "Ana Martínez",
        email: "ana@example.com",
        password: "hashedPassword4",
        phone: "+123456704",
        address: "Calle Verde 321",
        role: UserRole.customer,
        interests: ["Jardinería", "Pintura", "Plomería"],
        imgUrl: "",
        services: servicesMock[3],
        appointments: [],
        reviews: [],
        orders: [],
        createdAt: new Date(2025, 0, 4),
        updatedAt: new Date(2025, 0, 4),
        deletedAt: null
    },
    {
        id: "user5",
        name: "Pedro Rodríguez",
        email: "pedro@example.com",
        password: "hashedPassword5",
        phone: "+123456705",
        address: "Avenida Color 654",
        role: UserRole.customer,
        interests: ["Pintura", "Plomería", "Electricidad"],
        imgUrl: "",
        services: servicesMock[4],
        appointments: [],
        reviews: [],
        orders: [],
        createdAt: new Date(2025, 0, 5),
        updatedAt: new Date(2025, 0, 5),
        deletedAt: null
    }
];

// Citas
export const appointmentsMock: AppointmentType[] = [
    {
        id: "appointment1",
        user: usersMock[3],
        service: servicesMock[0],
        date: new Date(2025, 3, 1),
        status: AppointmentStatus.pending,
        note: "Reparación de fuga en baño"
    },
    {
        id: "appointment2",
        user: usersMock[4],
        service: servicesMock[1],
        date: new Date(2025, 3, 2),
        status: AppointmentStatus.confirmed,
        note: "Instalación de luces LED"
    },
    {
        id: "appointment3",
        user: usersMock[3],
        service: servicesMock[2],
        date: new Date(2025, 3, 3),
        status: AppointmentStatus.canceled,
        note: "Reparación de puerta"
    },
    {
        id: "appointment4",
        user: usersMock[4],
        service: servicesMock[3],
        date: new Date(2025, 3, 4),
        status: AppointmentStatus.confirmed,
        note: "Mantenimiento de jardín"
    },
    {
        id: "appointment5",
        user: usersMock[3],
        service: servicesMock[4],
        date: new Date(2025, 3, 5),
        status: AppointmentStatus.pending,
        note: "Pintura de interiores"
    }
];

// Reseñas
export const reviewsMock: ReviewType[] = [
    {
        id: "review1",
        appointment: appointmentsMock[0],
        user: usersMock[3],
        service: servicesMock[0],
        rating: 5,
        comment: "Excelente servicio de plomería, muy profesional",
        createdAt: new Date(2025, 3, 2)
    },
    {
        id: "review2",
        appointment: appointmentsMock[1],
        user: usersMock[4],
        service: servicesMock[1],
        rating: 4,
        comment: "Buen trabajo con la instalación eléctrica",
        createdAt: new Date(2025, 3, 3)
    },
    {
        id: "review3",
        appointment: appointmentsMock[2],
        user: usersMock[3],
        service: servicesMock[2],
        rating: 5,
        comment: "Excelente trabajo de carpintería",
        createdAt: new Date(2025, 3, 4)
    },
    {
        id: "review4",
        appointment: appointmentsMock[3],
        user: usersMock[4],
        service: servicesMock[3],
        rating: 4,
        comment: "Muy buen servicio de jardinería",
        createdAt: new Date(2025, 3, 5)
    },
    {
        id: "review5",
        appointment: appointmentsMock[4],
        user: usersMock[3],
        service: servicesMock[4],
        rating: 5,
        comment: "Excelente trabajo de pintura",
        createdAt: new Date(2025, 3, 6)
    }
];

// Suscripciones
export const subscriptionsMock: SubscriptionType[] = [
    {
        id: "subscription1",
        service: servicesMock[0],
        premium: "premium",
        status: SubscriptionStatus.active,
        startDate: new Date(2025, 3, 1),
        endDate: new Date(2025, 3, 30),
        createdAt: new Date(2025, 3, 1)
    },
    {
        id: "subscription2",
        service: servicesMock[1],
        premium: "premium",
        status: SubscriptionStatus.pending,
        startDate: new Date(2025, 3, 2),
        endDate: new Date(2025, 3, 30),
        createdAt: new Date(2025, 3, 2)
    },
    {
        id: "subscription3",
        service: servicesMock[2],
        premium: "premium",
        status: SubscriptionStatus.active,
        startDate: new Date(2025, 3, 3),
        endDate: new Date(2025, 3, 30),
        createdAt: new Date(2025, 3, 3)
    },
    {
        id: "subscription4",
        service: servicesMock[3],
        premium: "premium",
        status: SubscriptionStatus.pending,
        startDate: new Date(2025, 3, 4),
        endDate: new Date(2025, 3, 30),
        createdAt: new Date(2025, 3, 4)
    },
    {
        id: "subscription5",
        service: servicesMock[4],
        premium: "premium",
        status: SubscriptionStatus.active,
        startDate: new Date(2025, 3, 5),
        endDate: new Date(2025, 3, 30),
        createdAt: new Date(2025, 3, 5)
    }
];

// Órdenes
export const ordersMock: OrderType[] = [
    {
        id: "order1",
        subscription: subscriptionsMock[0],
        service: servicesMock[0],
        price: 150,
        invoice: 10001,
        status: OrderStatus.active,
        createdAt: new Date(2025, 3, 1)
    },
    {
        id: "order2",
        subscription: subscriptionsMock[1],
        service: servicesMock[1],
        price: 200,
        invoice: 10002,
        status: OrderStatus.pending,
        createdAt: new Date(2025, 3, 2)
    },
    {
        id: "order3",
        subscription: subscriptionsMock[2],
        service: servicesMock[2],
        price: 250,
        invoice: 10003,
        status: OrderStatus.active,
        createdAt: new Date(2025, 3, 3)
    },
    {
        id: "order4",
        subscription: subscriptionsMock[3],
        service: servicesMock[3],
        price: 180,
        invoice: 10004,
        status: OrderStatus.pending,
        createdAt: new Date(2025, 3, 4)
    },
    {
        id: "order5",
        subscription: subscriptionsMock[4],
        service: servicesMock[4],
        price: 220,
        invoice: 10005,
        status: OrderStatus.active,
        createdAt: new Date(2025, 3, 5)
    }
];
