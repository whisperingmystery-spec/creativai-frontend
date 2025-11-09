export function calculateMonthlyRate(annualRatePercent: number): number {
  if (!isFinite(annualRatePercent) || annualRatePercent < 0) return 0
  return (annualRatePercent / 12) / 100
}

export function calculateEmi(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (!isFinite(principal) || principal <= 0 || !isFinite(tenureMonths) || tenureMonths <= 0) return 0
  const r = calculateMonthlyRate(annualRatePercent)
  if (r === 0) return +(principal / tenureMonths).toFixed(2)
  const factor = Math.pow(1 + r, tenureMonths)
  return +((principal * r * factor) / (factor - 1)).toFixed(2)
}


