import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateRegencyDto } from "./dto/create-regency.dto";
import { UpdateRegencyDto } from "./dto/update-regency.dto";
import { PrismaService } from "src/services/prisma/prisma.service";
import { ProvinceService } from "../province/province.service";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { paginate, PaginateOptions } from "src/common/helpers/paginate";
import { Prisma } from "prisma/client";

@Injectable()
export class RegencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly provinceService: ProvinceService,
  ) {}

  async create(dto: CreateRegencyDto) {
    const province = await this.provinceService.findOne(dto.province_id);

    if (!province) {
      throw new BadRequestException({
        message: "Provinsi tidak ditemukan",
        validation: [
          {
            field: "province_id",
            messages: ["Provinsi tidak ditemukan"],
          },
        ],
      });
    }

    const duplicate = await this.prisma.regency.findFirst({
      where: {
        OR: [{ code: dto.code }, { name: dto.name }],
      },
    });

    if (duplicate) {
      const isCodeDuplicate = duplicate.code === dto.code;
      const field = isCodeDuplicate ? "code" : "name";
      const value = isCodeDuplicate ? dto.code : dto.name;
      const label = isCodeDuplicate ? "Kode" : "Kbupaten/Kota";

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

    const regency = await this.prisma.regency.create({
      data: {
        code: dto.code,
        name: dto.name,
        province: {
          connect: { id: dto.province_id },
        },
      },
      include: { province: true },
    });

    return { message: "Kabupaten/Kota berhasil ditambahkan", data: regency };
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

    const args: Prisma.RegencyFindManyArgs = {
      include: { _count: true, province: true },
    };

    return paginate(this.prisma.regency, args, options);
  }

  async findOne(id: number) {
    const regency = await this.prisma.regency.findUnique({
      where: { id },
      include: { _count: true, province: true },
    });

    if (!regency) {
      throw new NotFoundException("Kabupaten/Kota tidak ditemukan");
    }

    return regency;
  }

  async update(id: number, dto: UpdateRegencyDto) {
    const existing = await this.prisma.regency.findFirst({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Kabupaten/Kota tidak ditemukan");
    }

    const args: Prisma.RegencyUpdateArgs = {
      where: { id },
      data: dto,
    };

    if (dto.province_id) {
      args.data.province = {
        connect: { id: dto.province_id },
      };
    }

    return await this.prisma.regency.update(args);
  }

  remove(id: number) {
    return `This action removes a #${id} regency`;
  }
}
