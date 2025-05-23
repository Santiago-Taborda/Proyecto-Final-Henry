import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsType } from 'src/enums/Subscriptions.enum';
import { SubscriptionStatus } from 'src/enums/subscriptionStatus.enum';
import { ServiceProfileRepository } from 'src/service-profile/service-profile.repository';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { Subscriptions } from 'src/entities/subcriptions.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly serviceProfileRepository: ServiceProfileRepository,
  ) {}

  // OBTENER TODAS LAS SUBSCRIPCIONES EXISTENTES
  async getAllSubscriptionsService() {
    return await this.subscriptionsRepository.getAllSubscriptionsRepository();
  }

  // OBTENER TODAS LAS SUBSCRIPCIONES PREMIUM EXISTENTES
  async getAllPremiumSubscriptionsService() {
    return await this.subscriptionsRepository.getAllPremiumSubscriptionsRepository();
  }

  // OBTENER TODAS LAS SUBSCRIPCIONES FREE EXISTENTES
  async getAllFreeSubscriptionsService() {
    return await this.subscriptionsRepository.getAllFreeSubscriptionsRepository();
  }

  // OBTENER SUBSCRIPCIÓN POR ID
  async getSubscriptionByIdService(id: string) {
    const subscription: Subscriptions =
      await this.subscriptionsRepository.getSubscriptionByIdRepository(id);

    if (!subscription) {
      throw new NotFoundException(
        `Subscripción con id ${id} no fue encontrada`,
      );
    }
    return subscription;
  }

  async createFreeSubscriptionService(serviceProfileId: string) {
    const serviceProfile: ServiceProfile =
      await this.serviceProfileRepository.getServiceProfileByIdRepository(
        serviceProfileId,
      );

    if (!serviceProfile) {
      throw new NotFoundException(
        `Perfil de servicio con id ${serviceProfileId} no fue encontrado`,
      );
    }

    const subscriptionType = SubscriptionsType.FREE;
    const status = SubscriptionStatus.PENDING;
    const paymentDate = null;
    const expirationDate = null;
    const createdPremiumAt = null;

    const subscriptionToCreate = {
      subscriptionType,
      status,
      paymentDate,
      expirationDate,
      createdPremiumAt,
      serviceProfile,
    };

    const newSubscription =
      this.subscriptionsRepository.createSubscriptionRepository(
        subscriptionToCreate,
      );
    const savedSuscription =
      await this.subscriptionsRepository.saveSubscriptionRepository(
        newSubscription,
      );

    if (!savedSuscription)
      throw new InternalServerErrorException(
        `La suscripción no pudo ser creada`,
      );

    return savedSuscription;
  }

  // async createSubscriptionService(subscriptionData: CreateSubscriptionDto) {
  //   const paymentDate = new Date();

  //   const expirationDate = new Date();
  //   expirationDate.setMonth(expirationDate.getMonth() + 1);

  //   const subscriptionToCreate = {
  //     ...subscriptionData,
  //     paymentDate,
  //     expirationDate: expirationDate,
  //     status: 'pending',
  //   };

  //   return await this.subscriptionsRepository.createSubscriptionRepository(
  //     subscriptionToCreate,
  //   );
  // }
}
