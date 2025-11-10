import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProvinceDto } from "./dto/create-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { PrismaService } from "src/services/prisma/prisma.service";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { paginate, PaginateOptions } from "src/common/helpers/paginate";
import { Prisma } from "prisma/client";

@Injectable()
export class ProvinceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProvinceDto) {
    const duplicate = await this.prisma.province.findFirst({
      where: {
        OR: [{ code: dto.code }, { name: dto.name }],
      },
    });

    if (duplicate) {
      const isCodeDuplicate = duplicate.code === dto.code;
      const field = isCodeDuplicate ? "code" : "name";
      const value = isCodeDuplicate ? dto.code : dto.name;
      const label = isCodeDuplicate ? "Kode" : "Provinsi";

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

    const province = await this.prisma.province.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });

    return { message: "Provinsi berhasil ditambahkan", data: province };
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

    const args: Prisma.ProvinceFindManyArgs = {
      include: { _count: true },
    };

    return paginate(this.prisma.province, args, options);
  }

  async findOne(id: number) {
    const province = await this.prisma.province.findUnique({
      where: { id },
      include: { _count: true },
    });

    if (!province) {
      throw new NotFoundException("Provinsi tidak ditemukan");
    }

    return province;
  }

  async update(id: number, dto: UpdateProvinceDto) {
    const existing = await this.prisma.province.findFirst({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException("Provinsi tidak ditemukan");
    }

    return await this.prisma.province.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
