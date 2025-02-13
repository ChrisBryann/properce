import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateListingDto {

    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    proposedPrice: number;

    @IsNumber()
    @IsNotEmpty()
    minThreshold: number;

    @IsDateString()
    @IsNotEmpty()
    deadline: string;

    @IsBoolean()
    @IsOptional()
    locked?: boolean;
}