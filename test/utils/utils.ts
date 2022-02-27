// remove decimal
import { BigNumber } from "ethers";

const Decimal: BigNumber = BigNumber.from(10).pow(18);

export function rd(amount: BigNumber) {
  return BigNumber.from(amount).div(Decimal);
}

// to decimal
export function td(amount: Number) {
  return Decimal.mul(BigNumber.from(amount));
}
