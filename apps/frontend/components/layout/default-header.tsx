interface DefaultHeaderProps {
  title: string
}

export function DefaultHeader({ title }: DefaultHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-20 bg-white">
      <h1 className="mx-auto h-10 text-center text-lg font-semibold">{title}</h1>
    </header>
  )
}
