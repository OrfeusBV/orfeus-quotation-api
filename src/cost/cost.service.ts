import { CalculateCostDto } from './calculate-cost.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CostService {
  private readonly licensePrices = this.loadNumbers(
    'LICENSE_PRICES_PER_HALF_COMPANY_SIZE',
  );
  private readonly accountPrices = this.loadNumbers('ACCOUNT_PRICES');

  constructor(private configService: ConfigService) {}

  calculateCost(query: CalculateCostDto) {
    const licenseCost = this.getYearlyLicenseCost(
      query.companySize,
      this.licensePrices,
    );
    const ultrasoundCost = this.getUltrasoundCost(query, licenseCost);
    const appPlusCost = this.getAppPlusCost(query, licenseCost);
    const accountsCost = this.getYearlyAccountsCost(
      query.numberOfAccounts,
      this.accountPrices,
    );
    const total = licenseCost + ultrasoundCost + appPlusCost + accountsCost;
    return {
      input: query,
      yearlyCost: {
        licenses: licenseCost,
        ultrasoundModule: ultrasoundCost,
        appPlusModule: appPlusCost,
        accounts: accountsCost,
        total: total,
      },
    };
  }

  private getAppPlusCost(query: CalculateCostDto, licenseCost: number) {
    return query.appPlusModule
      ? this.getLicenseCostFraction({
          licenseCost,
          fraction: 0.15,
        })
      : 0;
  }

  private getUltrasoundCost(query: CalculateCostDto, licenseCost: number) {
    return query.ultrasoundModule
      ? this.getLicenseCostFraction({
          licenseCost,
          fraction: 0.25,
        })
      : 0;
  }

  private getYearlyLicenseCost(companySize = 1, prices: number[]): number {
    const sizeRoundedToHalf = Math.round(companySize * 2) / 2;
    const index = sizeRoundedToHalf * 2 - 1;
    const max = prices[prices.length - 1];
    const smallestStep = max - prices[prices.length - 2];
    return prices[index] || max + smallestStep * (index + 1 - prices.length);
  }

  private getLicenseCostFraction({
    licenseCost,
    fraction = 0,
  }: {
    licenseCost: number;
    fraction: number;
  }): number {
    return licenseCost * fraction;
  }

  private getMonthlyAccountsCost(
    numberOfAccounts = 1,
    accountPrices: number[],
  ): number {
    const [first, second, thirdAndUp] = accountPrices;
    if (numberOfAccounts === 1) {
      return first;
    }
    if (numberOfAccounts === 2) {
      return first + second;
    }
    return first + second + thirdAndUp * (numberOfAccounts - 2);
  }

  private getYearlyAccountsCost(numberOfAccounts, accountPrices: number[]) {
    return (
      Math.round(
        this.getMonthlyAccountsCost(numberOfAccounts, accountPrices) * 12 * 100,
      ) / 100
    );
  }

  private loadNumbers(propertyPath: string) {
    return this.configService
      .get<string>(propertyPath)
      .split(',')
      .map((str) => +str);
  }
}
