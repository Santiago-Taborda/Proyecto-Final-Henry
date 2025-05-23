import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { ServiceProfile } from 'src/entities/serviceProfile.entity';
import { User } from 'src/entities/user.entity';
import { AppointmentStatus } from 'src/enums/AppointmentStatus.enum';
import { ServiceProfileStatus } from 'src/enums/serviceProfileStatus.enum';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ServiceProfile)
    private serviceProfileRepository: Repository<ServiceProfile>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async getSummaryStats() {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      activeServices,
      pendingServices,
      rejectedServices,
      totalAppointments,
      pendingAppointments,
    ] = await Promise.all([
      // Métricas de usuarios CORREGIDAS:
      this.userRepository.count(),
      this.userRepository.count({ where: { deletedAt: IsNull() } }),
      this.userRepository.count({ where: { deletedAt: Not(IsNull()) } }),

      // Métricas de servicios CORREGIDAS (eliminamos totalServices):
      this.serviceProfileRepository.count({
        where: { status: ServiceProfileStatus.ACTIVE },
      }),
      this.serviceProfileRepository.count({
        where: { status: ServiceProfileStatus.PENDING },
      }),
      this.serviceProfileRepository.count({
        where: { status: ServiceProfileStatus.REJECTED },
      }),

      // Métricas de citas CORREGIDAS:
      this.appointmentRepository.count(),
      this.appointmentRepository.count({
        where: { appointmentStatus: AppointmentStatus.PENDING },
      }),
    ]);

    return {
      // Usuarios
      totalUsers: activeUsers + inactiveUsers,
      activeUsers,
      inactiveUsers,

      // Servicios
      activeServices,
      pendingServices,
      rejectedServices,
      approvalRate:
        activeServices > 0
          ? Math.round(
              (activeServices /
                (activeServices + pendingServices + rejectedServices)) *
                100,
            )
          : 0,

      // Citas
      totalAppointments,
      pendingAppointments,
    };
  }

  async getServicesByCategory() {
    return this.serviceProfileRepository
      .createQueryBuilder('service')
      .select('category.name', 'category')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('service.category', 'category')
      .groupBy('category.name')
      .getRawMany();
  }

  async getUsersByRole() {
    const rolesData = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .where('user.role IN (:...roles)', { roles: ['customer', 'provider'] })
      .andWhere('user.deletedAt IS NULL')
      .groupBy('user.role')
      .getRawMany();

    const result = {
      clients: 0,
      providers: 0,
    };

    rolesData.forEach((item) => {
      if (item.role === 'customer') {
        result.clients = parseInt(item.count);
      } else if (item.role === 'provider') {
        result.providers = parseInt(item.count);
      }
    });

    return result;
  }
}
