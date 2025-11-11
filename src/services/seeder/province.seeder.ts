import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "prisma/client";
import { provinceData } from "./data/province";

@Injectable()
export class ProvinceSeeder {
  private readonly logger = new Logger("ProvinceSeeder");

  constructor(private readonly prisma: PrismaService) {}

  async run() {
    this.logger.log("...");
    this.logger.log("================= PROVINCE SEEDER START =================");

    const provinces = await this.prisma.province.count();

    if (provinces) {
      this.logger.log("Province already seeded.");
    } else {
      const data: Prisma.ProvinceCreateManyInput[] = provinceData.map((province) => ({
        code: province.kode_bps,
        name: province.nama_bps,
      }));

      const result = await this.prisma.province.createMany({
        data,
        skipDuplicates: true,
      });

      this.logger.log(`Inserted ${result.count} provinces.`);
    }

    this.logger.log("================= PROVINCE SEEDER END =================");
    this.logger.log("...");
  }
}
