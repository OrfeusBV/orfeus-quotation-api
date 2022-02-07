import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';

const toNumber = ({ value }) => +value;
const toInt = ({ value }) => parseInt(value, 10);
const toBoolean = ({ value }) => value === 'true';

export class CalculateCostDto {
  @Optional()
  @Transform(toNumber)
  companySize: number;

  @Optional()
  @Transform(toInt)
  numberOfAccounts: number;

  @Optional()
  @Transform(toBoolean)
  ultrasoundModule: boolean;

  @Optional()
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
