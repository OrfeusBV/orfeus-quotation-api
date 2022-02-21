import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

const toNumber = ({ value }) => +value;
const toInt = ({ value }) => parseInt(value, 10);
const toBoolean = ({ value }) => value === 'true';

export class CalculateCostDto {
  @IsNumber()
  @Transform(toNumber)
  companySize: number;

  @IsNumber()
  @Transform(toInt)
  numberOfAccounts: number;

  @Transform(toBoolean)
  ultrasoundModule: boolean;

  @Transform(toBoolean)
  appPlusModule: boolean;
}

export class CalculateCostResponseDto {
  input: CalculateCostDto;
  yearlyCost: {
    licenses: number;
    appPlusModule: number;
    ultrasoundModule: number;
    accounts: number;
    total: number;
  };
}
