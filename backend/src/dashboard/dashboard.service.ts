import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Project, ProjectStatus } from '../projects/project.entity';
import { Invoice, InvoiceStatus } from '../invoices/invoice.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async getDashboard(userId: string) {
    const [
      totalClients,
      projectCounts,
      invoiceCounts,
      revenueResult,
      unpaidResult,
      recentProjects,
      recentInvoices,
    ] = await Promise.all([
      // Total clients
      this.clientsRepository.count({ where: { userId } }),

      // Projects grouped by status
      this.projectsRepository
        .createQueryBuilder('project')
        .select('project.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('project.userId = :userId', { userId })
        .groupBy('project.status')
        .getRawMany<{ status: ProjectStatus; count: string }>(),

      // Invoices grouped by status
      this.invoicesRepository
        .createQueryBuilder('invoice')
        .select('invoice.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('invoice.userId = :userId', { userId })
        .groupBy('invoice.status')
        .getRawMany<{ status: InvoiceStatus; count: string }>(),

      // Total revenue (paid invoices)
      this.invoicesRepository
        .createQueryBuilder('invoice')
        .select('SUM(invoice.totalAmount)', 'total')
        .where('invoice.userId = :userId AND invoice.status = :status', {
          userId,
          status: InvoiceStatus.PAID,
        })
        .getRawOne<{ total: string | null }>(),

      // Total unpaid (sent + overdue)
      this.invoicesRepository
        .createQueryBuilder('invoice')
        .select('SUM(invoice.totalAmount)', 'total')
        .where(
          'invoice.userId = :userId AND invoice.status IN (:...statuses)',
          { userId, statuses: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
        )
        .getRawOne<{ total: string | null }>(),

      // Recent projects (last 5)
      this.projectsRepository.find({
        where: { userId },
        relations: ['client'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),

      // Recent invoices (last 5)
      this.invoicesRepository.find({
        where: { userId },
        relations: ['client'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    // Build project status map
    const projectsByStatus = Object.values(ProjectStatus).reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<ProjectStatus, number>,
    );
    for (const row of projectCounts) {
      projectsByStatus[row.status] = parseInt(row.count, 10);
    }

    // Build invoice status map
    const invoicesByStatus = Object.values(InvoiceStatus).reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<InvoiceStatus, number>,
    );
    for (const row of invoiceCounts) {
      invoicesByStatus[row.status] = parseInt(row.count, 10);
    }

    return {
      totalClients,
      projects: projectsByStatus,
      invoices: invoicesByStatus,
      totalRevenue: parseFloat(revenueResult?.total ?? '0'),
      totalUnpaid: parseFloat(unpaidResult?.total ?? '0'),
      recentProjects,
      recentInvoices,
    };
  }
}
