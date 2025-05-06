export enum UserRole {
    CUSTOMER = 'customer',
    PROVIDER = 'provider',
    SUPERADMIN = 'superadmin',
    ADMIN = 'admin',
}

export enum SubscriptionStatus {
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    ACTIVE = 'active',
}

export enum OrderStatus {
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
}

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    RESCHEDULED = 'rescheduled',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export enum ServiceProfileStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    REJECTED = 'rejected',
}

export enum Subscriptions {
    FREE = 'free',
    PREMIUM = 'premium',
}

export enum MediaTypes {
    GALLERY = 'gallery',
    CERTIFICATE = 'certificate',
    ID_DOCUMENT = 'id_document',
}

export type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: UserRole;
    imgUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    serviceProfile: ServiceProfileType | null;
    appointments: AppointmentType[];
    reviews: ReviewType[];
    interests: CategoryType[];
}

export type ServiceProfileType = {
    id: string;
    serviceTitle: string;
    userName: string;
    address: addressType;
    rating: number | null;
    description: string | null;
    appointmentPrice: number;
    phone: string;
    status: ServiceProfileStatus;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    user: UserType | null;
    subscription: SubscriptionType;
    appointments: AppointmentType[];
    reviews: ReviewType[];
    images: mediaType[];
    category: CategoryType;
}

export type ServiceRequestType = {
    serviceTitle: string;
    userName: string;
    address: addressType;
    description: string;
    appointmentPrice: number;
    phone: number;
    category: string;
}

export type addressType = {
    extNumber: string;
    intNumber: string | null;
    street: string;
    neighborhood: string | null;
    zipCode: string;
    city: string;
    state: string;
    country: string;
}

export type mediaType = {
    id: string;
    imgUrl: string;
    type: MediaTypes;
    serviceProfile: ServiceProfileType;
}

export type galleriesType = {
    id_document: File[],
    certificate: File[],
    gallery: File[],
}

export type CategoryType = {
    id: string;
    name: string;
    description: string;
    serviceProfile: ServiceProfileType[];
    users: UserType[];
}

export type AppointmentType = {
    id: string;
    date: Date;
    appointmentStatus: AppointmentStatus;
    additionalNotes: string | null;
    review: ReviewType;
    user: UserType;
    provider: ServiceProfileType;
}

export type ReviewType = {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    deletedAt: Date | null;
    appointment: AppointmentType;
    user: UserType;
    serviceProfile: ServiceProfileType;
}

export type SubscriptionType = {
    id: string;
    subscriptionType: Subscriptions;
    status: SubscriptionStatus;
    paymentDate: Date | null;
    expirationDate: Date | null;
    createdPremiumAt: Date | null;
    serviceProfile: ServiceProfileType | null;
    orders: OrderType[];
}

export type OrderType = {
    id: string;
    amount: number | false;
    paymentIntentId: string;
    status: OrderStatus;
    invoice: number;
    createdAt: Date;
    updatedAt: Date;
    subscription: SubscriptionType | null;
}

export type UpdateUserDto = {
    name?: string;
    email?: string;
    phone?: number;
    address?: string;
}

  
export type UpdateServiceProfileDto = {
    serviceTitle?: string;
    userName?: string;
    address?: AddressDto;
    description?: string;
    appointmentPrice?: number;
    phone?: number;
    category?: string;
}

export type AddressDto = {
    extNumber: string;
    intNumber?: string;
    street: string;
    neighborhood?: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  }
  