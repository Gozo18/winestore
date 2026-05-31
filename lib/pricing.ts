// Jeden zdroj pravdy pro výpočet cen objednávky.
// Pokud se logika rozjede mezi UI (rekapitulace na /objednavka) a serverem
// (createOrder), uživatel vidí jednu cenu a v DB se uloží jiná. Tato funkce
// musí být JEDINÉ místo, kde se kombinuje doprava + dobírka + položky.

import { COD_SURCHARGE, DELIVERY_PRICES } from "./constants"

export const PICKUP_METHOD = "Osobně na prodejně"
export const COD_METHOD = "Hotovost"

export type OrderTotalsInput = {
  /** Cena všech položek košíku (string s 2 desetinnými místy, jak ji vrací Prisma Decimal). */
  itemsPrice: string | number
  /** Způsob dopravy z uživatelského profilu. */
  deliveryMethod: string | null | undefined
  /** Způsob platby z uživatelského profilu. */
  paymentMethod: string | null | undefined
}

export type OrderTotals = {
  /** Pravda, pokud je vybrán osobní odběr — doprava i dobírka jsou pak zdarma. */
  isPickup: boolean
  /** Pravda, pokud je vybrána platba na dobírku (Hotovost) mimo osobní odběr. */
  isCOD: boolean
  /** Cena samotné dopravy (bez dobírky). */
  deliveryFee: number
  /** Příplatek za dobírku. 0 pro osobní odběr nebo bezhotovostní platbu. */
  codFee: number
  /** Doprava + dobírka jako string s 2 desetinnými místy (formát do DB / Decimal). */
  shippingPrice: string
  /** Položky + doprava + dobírka jako string s 2 desetinnými místy. */
  totalPrice: string
}

/**
 * Spočítá konečné částky objednávky ze stavu košíku a metod ve user profilu.
 *
 * Vrací stringy s 2 desetinnými místy, aby pasovaly přímo do Prisma Decimal
 * sloupců i do zobrazení přes `formatCurrency`.
 */
export function calcOrderTotals({
  itemsPrice,
  deliveryMethod,
  paymentMethod,
}: OrderTotalsInput): OrderTotals {
  const isPickup = deliveryMethod === PICKUP_METHOD
  const isCOD = paymentMethod === COD_METHOD
  const codFee = isCOD && !isPickup ? COD_SURCHARGE : 0
  const deliveryFee = deliveryMethod
    ? (DELIVERY_PRICES[deliveryMethod] ?? 0)
    : 0

  const shippingPrice = (deliveryFee + codFee).toFixed(2)
  const totalPrice = (Number(itemsPrice) + deliveryFee + codFee).toFixed(2)

  return {
    isPickup,
    isCOD,
    deliveryFee,
    codFee,
    shippingPrice,
    totalPrice,
  }
}
