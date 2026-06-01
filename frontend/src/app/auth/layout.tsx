import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-screen overflow-hidden grid-cols-1 lg:grid-cols-2">
      {/* Columna Izquierda: Branding */}
      <div className="relative flex flex-col items-center justify-center bg-primary p-8 text-primary-foreground lg:p-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center space-y-8">
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md shadow-2xl overflow-hidden p-3">
            <Image 
              src="/ips-logo.png" 
              alt="Logo del Instituto Politécnico Superior" 
              width={104} 
              height={104} 
              className="object-contain rounded-xl"
              priority
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">
              Instituto Politécnico Superior
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Sistema de Gestión de Mapas y Aulas
            </p>
          </div>
        </div>
      </div>
      
      {/* Columna Derecha: Auth Forms */}
      <div className="flex items-center justify-center bg-background p-4 lg:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
