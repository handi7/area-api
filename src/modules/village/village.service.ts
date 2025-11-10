import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateVillageDto } from "./dto/create-village.dto";
import { UpdateVillageDto } from "./dto/update-village.dto";
import { PrismaService } from "src/services/prisma/prisma.service";
import { DistrictService } from "../district/district.service";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { paginate, PaginateOptions } from "src/common/helpers/paginate";
import { Prisma } from "prisma/client";

@Injectable()
export class VillageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly districtService: DistrictService,
  ) {}

  async create(dto: CreateVillageDto) {
    const district = await this.districtService.findOne(dto.district_id);

    if (!district) {
      throw new BadRequestException({
        message: "Kecamatan tidak ditemukan",
        validation: [
          {
            field: "district_id",
            messages: ["Kecamatan tidak ditemukan"],
          },
        ],
      });
    }

    const duplicate = await this.prisma.village.findFirst({
      where: {
        OR: [{ code: dto.code }, { name: dto.name }],
      },
    });

    if (duplicate) {
      const isCodeDuplicate = duplicate.code === dto.code;
      const field = isCodeDuplicate ? "code" : "name";
      const value = isCodeDuplicate ? dto.code : dto.name;
      const label = isCodeDuplicate ? "Kode" : "Kelurahan";

      throw new ConflictException({
        message: `${label} ${value} sudah terdaftar`,
        validation: [
          {
            field,
            messages: [`${label} ${value} sudah terdaftar`],
          },
        ],
      });
    }

    const village = await this.prisma.village.create({
      data: {
        code: dto.code,
        name: dto.name,
        district: {
          connect: { id: dto.district_id },
        },
      },
      include: { district: true },
    });

    return { message: "Kelurahan berhasil ditambahkan", data: village };
  }

  async findAll(query: GetAllQuery) {
    const options: PaginateOptions = {
      page: Number(query.page),
      size: Number(query.size),
      searchFields: ["code", "name"],
      s: query.s,
      allowedSortBy: ["code", "name"],
      sortBy: query.sortBy,
      desc: query.desc === "true",
    };

    const args: Prisma.VillageFindManyArgs = {
      include: { district: true },
    };

    return paginate(this.prisma.village, args, options);
  }

  async findOne(id: number) {
    const village = await this.prisma.village.findUnique({
      where: { id },
      include: { district: true },
    });

    if (!village) {
      throw new NotFoundException("Kelurahan tidak ditemukan");
    }

    return village;
  }

  async update(id: number, dto: UpdateVillageDto) {
    const existing = await this.prisma.village.findFirst({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Kelurahan tidak ditemukan");
    }

    const args: Prisma.DistrictUpdateArgs = {
      where: { id },
      data: dto,
    };

    if (dto.district_id) {
      args.data.regency = {
        connect: { id: dto.district_id },
      };
    }

    return await this.prisma.district.update(args);
  }

  remove(id: number) {
    return `This action removes a #${id} village`;
  }
}
