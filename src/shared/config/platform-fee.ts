/** Комиссия платформы в bps (2000 = 20%). ADR 0005 / business-model. */
export const DEFAULT_PLATFORM_FEE_BPS = 2000;

export function splitWorkOrderFee(priceMinor: number, feeBps: number = DEFAULT_PLATFORM_FEE_BPS) {
  const platformFeeMinor = Math.round((priceMinor * feeBps) / 10_000);
  const masterPayoutMinor = priceMinor - platformFeeMinor;
  return { feeBps, platformFeeMinor, masterPayoutMinor };
}

export function feeBpsToPercent(feeBps: number): number {
  return feeBps / 100;
}
