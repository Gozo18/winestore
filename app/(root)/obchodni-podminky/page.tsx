import { Metadata } from "next"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Obchodní podmínky",
}

const ObchodniPodminkyPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold font-cairo">Obchodní podmínky</h1>
      <p className="text-muted-foreground text-sm">Platné od 1. 1. 2025</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Úvodní ustanovení</h2>
        <p>
          Tyto obchodní podmínky (dále jen „podmínky&quot;) upravují vzájemná
          práva a povinnosti mezi prodávajícím a kupujícím vzniklé v souvislosti
          nebo na základě kupní smlouvy uzavřené prostřednictvím internetového
          obchodu {APP_NAME} (dále jen „e-shop&quot;).
        </p>
        <p>
          Provozovatelem e-shopu a prodávajícím je společnost {APP_NAME} s.r.o.,
          se sídlem Podhradní 180, 692 01 Pavlov, IČO: 29273676, DIČ:
          CZ29273676, zapsaná v obchodním rejstříku vedeném Krajským soudem v
          Brně (dále jen „prodávající&quot;).
        </p>
        <p>
          Kupujícím je fyzická nebo právnická osoba, která uzavírá s
          prodávajícím kupní smlouvu prostřednictvím e-shopu. Kupující bere na
          vědomí, že nákup alkoholických nápojů je povolen pouze osobám starším
          18 let. Objednávkou kupující potvrzuje, že splňuje tuto podmínku.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Uzavření kupní smlouvy</h2>
        <p>
          Nabídka zboží prezentovaná v e-shopu je informativní a prodávající
          není povinen uzavřít kupní smlouvu ohledně tohoto zboží. Ustanovení §
          1732 odst. 2 občanského zákoníku se nepoužije.
        </p>
        <p>
          Objednávku kupující odešle vyplněním objednávkového formuláře v
          e-shopu. Před odesláním objednávky může kupující zkontrolovat a měnit
          zadané údaje. Odesláním objednávky kupující potvrzuje správnost
          uvedených údajů a souhlas s těmito podmínkami.
        </p>
        <p>
          Kupní smlouva je uzavřena okamžikem, kdy prodávající potvrdí přijetí
          objednávky e-mailem zaslaným na adresu kupujícího. Prodávající je
          oprávněn objednávku odmítnout, a to zejména v případě vyprodání zásob
          nebo zjevné chyby v ceně zboží.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          3. Cena zboží a platební podmínky
        </h2>
        <p>
          Ceny zboží jsou uváděny včetně DPH a všech zákonných poplatků. Cena
          nezahrnuje náklady na dopravu, které jsou kupujícímu sděleny v průběhu
          objednávkového procesu a jsou uvedeny v souhrnu objednávky před jejím
          odesláním.
        </p>
        <p>Kupní cenu lze uhradit následujícími způsoby:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Online platební kartou přes platební bránu Stripe</li>
          <li>Přes službu PayPal</li>
          <li>Dobírkou při převzetí zásilky (příplatek 50 Kč)</li>
        </ul>
        <p>
          Kupní cena je splatná před expedicí zboží, s výjimkou platby na
          dobírku. Zboží zůstává do úplného zaplacení kupní ceny ve vlastnictví
          prodávajícího.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Dodání zboží</h2>
        <p>
          Prodávající expeduje zboží zpravidla do 3 pracovních dnů od přijetí
          objednávky (resp. od připsání platby na účet prodávajícího u
          bezhotovostní platby). Při výpadku skladových zásob bude kupující
          neprodleně informován o náhradním termínu dodání.
        </p>
        <p>
          Zboží je doručováno prostřednictvím smluvního přepravce na adresu
          uvedenou kupujícím v objednávce. Kupující je povinen zkontrolovat
          zásilku při převzetí. Viditelné poškození obalu nebo obsahu je
          kupující povinen ihned uplatnit u přepravce a informovat
          prodávajícího.
        </p>
        <p>
          Nebezpečí škody na zboží přechází na kupujícího okamžikem převzetí
          zásilky od přepravce.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Odstoupení od smlouvy</h2>
        <p>
          Kupující, který je spotřebitelem, má právo odstoupit od kupní smlouvy
          bez udání důvodu ve lhůtě 14 dnů ode dne převzetí zboží, v souladu s §
          1829 občanského zákoníku.
        </p>
        <p>
          Odstoupení od smlouvy musí být prodávajícímu odesláno ve výše uvedené
          lhůtě, a to e-mailem na adresu{" "}
          <a href="mailto:info@vinoiris.cz" className="underline text-primary">
            info@vinoiris.cz
          </a>{" "}
          nebo poštou na adresu sídla prodávajícího. Kupující může využít
          vzorový formulář pro odstoupení od smlouvy dostupný v zákaznické
          sekci.
        </p>
        <p>
          Kupující je povinen vrátit zboží do 14 dnů od odeslání odstoupení.
          Prodávající vrátí uhrazenou kupní cenu do 14 dnů od obdržení
          odstoupení, nejpozději však do 14 dnů od vrácení zboží nebo prokázání
          jeho odeslání. Náklady na vrácení zboží nese kupující.
        </p>
        <p>
          Právo na odstoupení od smlouvy nelze uplatnit u zboží podléhajícího
          rychlé zkáze nebo u zboží, které bylo po dodání nenávratně smíseno s
          jiným zbožím.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          6. Odpovědnost za vady a reklamace
        </h2>
        <p>
          Prodávající odpovídá za to, že zboží při převzetí nemá vady. Kupující
          je oprávněn uplatnit právo z vady, která se vyskytne u spotřebního
          zboží v době 24 měsíců od převzetí.
        </p>
        <p>
          Reklamaci lze uplatnit e-mailem na adresu{" "}
          <a href="mailto:info@vinoiris.cz" className="underline text-primary">
            info@vinoiris.cz
          </a>{" "}
          nebo písemně na adresu sídla prodávajícího. Reklamace bude vyřízena
          bez zbytečného odkladu, nejpozději do 30 dnů ode dne jejího uplatnění,
          nedohodnou-li se strany jinak.
        </p>
        <p>
          V případě oprávněné reklamace má kupující právo na bezplatné
          odstranění vady, přiměřenou slevu z kupní ceny nebo na dodání
          náhradního zboží. Není-li to možné, může kupující od smlouvy
          odstoupit.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. Věkové omezení</h2>
        <p>
          V souladu s platnou právní úpravou prodávající neprodává ani nedodává
          alkoholické nápoje osobám mladším 18 let. Kupující odesláním
          objednávky prohlašuje, že je starší 18 let. Prodávající je oprávněn
          požadovat ověření věku při doručení zásilky. Pokud se zjistí, že
          kupující podmínku věku nesplňuje, prodávající je oprávněn od smlouvy
          odstoupit.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. Ochrana osobních údajů</h2>
        <p>
          Prodávající zpracovává osobní údaje kupujícího za účelem plnění kupní
          smlouvy, vedení zákaznického účtu a plnění zákonných povinností.
          Podrobné informace o zpracování osobních údajů jsou dostupné v
          Zásadách ochrany osobních údajů.
        </p>
        <p>
          Kupující má právo na přístup ke svým osobním údajům, jejich opravu,
          výmaz nebo přenositelnost, a dále právo vznést námitku proti
          zpracování. Tato práva lze uplatnit e-mailem na adresu{" "}
          <a href="mailto:info@vinoiris.cz" className="underline text-primary">
            info@vinoiris.cz
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">9. Mimosoudní řešení sporů</h2>
        <p>
          K mimosoudnímu řešení spotřebitelských sporů je příslušná Česká
          obchodní inspekce (ČOI), se sídlem Štěpánská 15, 120 00 Praha 2,
          www.coi.cz. Kupující může rovněž využít platformu pro řešení sporů
          online dostupnou na adrese{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">10. Závěrečná ustanovení</h2>
        <p>
          Tyto podmínky se řídí právním řádem České republiky, zejména zákonem
          č. 89/2012 Sb., občanský zákoník, a zákonem č. 634/1992 Sb., o ochraně
          spotřebitele.
        </p>
        <p>
          Prodávající je oprávněn tyto podmínky jednostranně měnit. Změna
          podmínek je účinná dnem jejich zveřejnění v e-shopu. Kupní smlouvy
          uzavřené před změnou podmínek se řídí podmínkami platnými v době
          jejich uzavření.
        </p>
        <p>
          Je-li nebo stane-li se některé ustanovení těchto podmínek neplatným či
          neúčinným, neplatnost nebo neúčinnost tohoto ustanovení se nedotýká
          platnosti a účinnosti ostatních ustanovení.
        </p>
      </section>
    </div>
  )
}

export default ObchodniPodminkyPage
