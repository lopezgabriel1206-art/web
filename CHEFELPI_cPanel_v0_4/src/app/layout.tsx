import type { Metadata } from 'next';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import './globals.css';
export const metadata:Metadata={title:{default:'Chefelpi | Cocina con identidad',template:'%s | Chefelpi'},description:'Descubrí la cocina de Chefelpi, sus preparaciones, recetarios digitales y contenido gastronómico.',robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="es" suppressHydrationWarning><body><Header/><main id="contenido">{children}</main><Footer/></body></html>;
}
