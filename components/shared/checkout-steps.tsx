import React from "react"
import { cn } from "@/lib/utils"

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className="flex-between flex-row space-x-1 md:space-x-2 space-y-2 mb-4 md:mb-10">
      {[
        "Přihlášení",
        "Dodací adresa",
        "Platební metody",
        "Potvrdit objednávku",
      ].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-xs md:text-sm",
              index === current ? "bg-secondary" : ""
            )}
          >
            {step}
          </div>
          {step !== "Potvrdit objednávku" && (
            <hr className="w-8 md:w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CheckoutSteps
