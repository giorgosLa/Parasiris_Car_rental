import { searchCarSchema } from "../validators/searchCar.validator";
import { carService } from "../services/car.service";
import { mapCarToSearchResult } from "../mappers/car.mapper";

export class CarController {
  async search(req: unknown) {
    const body = searchCarSchema.parse(req);

    const results = await carService.searchCars(body);

    return results.map((r) => mapCarToSearchResult(r.car, r.pricing));
  }
}

export const carController = new CarController();
