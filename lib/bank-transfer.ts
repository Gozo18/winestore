// Centralizované údaje pro platbu převodem.
// Sdíleno mezi e-mailem (potvrzení objednávky) a detailem objednávky,
// aby případná změna (číslo účtu, formát QR) byla na jednom místě.

export const BANK_ACCOUNT_NUMBER = "100654984"
export const BANK_CODE = "0300"
export const BANK_ACCOUNT = `${BANK_ACCOUNT_NUMBER}/${BANK_CODE}`
export const PAYMENT_MESSAGE = "Vinarstvi Celnar"

/** Posledních 6 znaků id objednávky se používá jako variabilní symbol. */
export function getVariableSymbol(orderId: string): string {
  return orderId.toString().slice(-6)
}

/**
 * URL pro generování QR Platba (český standard) přes veřejné paylibo API.
 * Vrací PNG, lze přímo vložit do `<img src=...>` v e-mailu i ve webu.
 */
export function getQrPaymentUrl({
  amount,
  variableSymbol,
  size = 220,
}: {
  amount: string | number
  variableSymbol: string
  size?: number
}): string {
  const params = new URLSearchParams({
    accountNumber: BANK_ACCOUNT_NUMBER,
    bankCode: BANK_CODE,
    amount: Number(amount).toFixed(2),
    currency: "CZK",
    vs: variableSymbol,
    message: PAYMENT_MESSAGE,
    size: String(size),
  })
  return `https://api.paylibo.com/paylibo/generator/czech/image?${params.toString()}`
}
