import { Metadata } from "next"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Kontakt",
}

const KontaktPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-cairo">Kontakt</h1>
        <p className="text-muted-foreground">
          Najdete nás v srdci Pálavy. Rádi vás přivítáme v našem vinařství.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold mb-1">Adresa</h2>
              <p className="text-muted-foreground">
                Podhradní 180
                <br />
                692 01 Pavlov
                <br />
                Česká republika
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold mb-1">Telefon</h2>
              <a
                href="tel:+420602528545"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                +420 602 528 545
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold mb-1">E-mail</h2>
              <a
                href="mailto:info@vinoiris.cz"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                info@vinoiris.cz
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold mb-1">Otevírací doba</h2>
              <div className="text-muted-foreground space-y-0.5">
                <p>Pondělí – Pátek: 9:00 – 17:00</p>
                <p>Sobota - Neděle: 10:00 – 17:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border shadow-sm min-h-[400px]">
          <iframe
            src="https://www.google.com/maps?q=V%C3%ADno+Iris,+Podhradn%C3%AD+180,+692+01+Pavlov&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "400px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa – Vinařství Víno Iris, Podhradní 180, Pavlov"
          />
        </div>
      </div>
    </div>
  )
}

export default KontaktPage
