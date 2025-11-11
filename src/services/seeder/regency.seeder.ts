import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "prisma/client";
import { provinceData } from "./data/province";

@Injectable()
export class RegencySeeder {
  private readonly logger = new Logger("RegencySeeder");

  constructor(private readonly prisma: PrismaService) {}

  async run() {
    this.logger.log("...");
    this.logger.log("================= REGENCY SEEDER START =================");

    const regencyCount = await this.prisma.regency.count();

    if (regencyCount) {
      this.logger.log("Regency already seeded.");
    } else {
      const data: Prisma.ProvinceCreateManyInput[] = provinceData.map((province) => ({
        code: province.kode_bps,
        name: province.nama_bps,
      }));

      const result = await this.prisma.province.createMany({
        data,
        skipDuplicates: true,
      });

      this.logger.log(`Inserted ${result.count} regencies.`);
    }

    this.logger.log("================= REGENCY SEEDER END =================");
    this.logger.log("...");
  }
}
