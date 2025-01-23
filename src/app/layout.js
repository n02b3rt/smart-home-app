import "../styles/globals.scss";
import Header from "../components/Header/Header";
import ClientSessionProvider from '@/components/ClientSessionProvider/ClientSessionProvider';
import { WeatherProvider } from "@/context/WeatherContext";

export const metadata = {
    title: 'Smart Home Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <WeatherProvider city="Rzeszów">
            <ClientSessionProvider>
                {children}
            </ClientSessionProvider>
        </WeatherProvider>
      </body>
    </html>
  );
}
