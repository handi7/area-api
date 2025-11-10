import { IsNotEmpty } from "class-validator";

export class CreateDistrictDto {
  @IsNotEmpty({ message: "Kabupaten/Kota harus diisi" })
  regency_id: number;

  @IsNotEmpty({ message: "Kode harus diisi" })
  code: string;

  @IsNotEmpty({ message: "Nama harus diisi" })
  name: string;
}
