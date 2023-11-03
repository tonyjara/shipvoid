import Decimal from "decimal.js";
import DecimalFormat from "decimal-format";

export const decimalFormatUSD = (x: Decimal) => {
  const df = new DecimalFormat(`$ #,##0.00#`);
  return df.format(x.toDecimalPlaces(2).toString());
};

export const decimalFormat = (x: Decimal | undefined) => {
  if (!x) return "0";

  const df = new DecimalFormat("#,###");
  return df.format(x.toDecimalPlaces(0).toString());
};
export function kFormatter(num: number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(num);
}
export function thousandsFormatter(num: number) {
  const formatter = Intl.NumberFormat("en");
  return formatter.format(num);
}

export const decimalDivBy100 = (str: string | null | undefined) => {
  return new Decimal(str ?? "0").div(100).toString();
};

export const decimalTimes100 = (str: string | null | undefined) => {
  return new Decimal(str ?? "0").times(100).toString();
};
