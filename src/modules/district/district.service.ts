import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { PrismaService } from "src/services/prisma/prisma.service";
import { RegencyService } from "../regency/regency.service";
import { paginate, PaginateOptions } from "src/common/helpers/paginate";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { Prisma } from "prisma/client";

@Injectable()
export class DistrictService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly regencyService: RegencyService,
  ) {}

  async create(dto: CreateDistrictDto) {
    const regency = await this.regencyService.findOne(dto.regency_id);

    if (!regency) {
      throw new BadRequestException({
        message: "Kabupaten/Kota tidak ditemukan",
        validation: [
          {
            field: "regency_id",
            messages: ["Kabupaten/Kota tidak ditemukan"],
          },
        ],
      });
    }

    const duplicate = await this.prisma.district.findFirst({
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

    const district = await this.prisma.district.create({
      data: {
        code: dto.code,
        name: dto.name,
        regency: {
          connect: { id: dto.regency_id },
        },
      },
      include: { regency: true },
    });

    return { message: "Kabupaten/Kota berhasil ditambahkan", data: district };
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

    const args: Prisma.DistrictFindManyArgs = {
      include: { _count: true, regency: true },
    };

    return paginate(this.prisma.district, args, options);
  }

  async findOne(id: number) {
    const district = await this.prisma.district.findUnique({
      where: { id },
      include: { _count: true, regency: true },
    });

    if (!district) {
      throw new NotFoundException("Kelurahan tidak ditemukan");
    }

    return district;
  }

  async update(id: number, dto: UpdateDistrictDto) {
    const existing = await this.prisma.district.findFirst({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Kelurahan tidak ditemukan");
    }

    const args: Prisma.DistrictUpdateArgs = {
      where: { id },
      data: dto,
    };

    if (dto.regency_id) {
      args.data.regency = {
        connect: { id: dto.regency_id },
      };
    }

    return await this.prisma.district.update(args);
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
