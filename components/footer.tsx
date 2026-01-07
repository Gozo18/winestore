import { APP_NAME } from "@/lib/constants"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mb-16 md:mb-8 p-5 flex-center">
        {currentYear} &copy; {APP_NAME}
      </div>
    </footer>
  )
}

export default Footer
