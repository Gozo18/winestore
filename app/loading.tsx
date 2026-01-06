import { Spinner } from "@/components/ui/spinner"

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Spinner className="size-8" />
    </div>
  )
}

export default Loading
