import { Controller, Get, Query } from '@nestjs/common';
import {
  CalculateCostDto,
  CalculateCostResponseDto,
} from './calculate-cost.dto';
import { CostService } from './cost.service';

@Controller('cost')
export class CostController {
  constructor(private costService: CostService) {}

  @Get()
  calculateCost(
    @Query()
    query: CalculateCostDto,
  ): CalculateCostResponseDto {
    return this.costService.calculateCost(query);
  }
}
