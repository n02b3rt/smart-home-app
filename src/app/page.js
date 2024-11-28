import YeelightController from '@/components/YeelightController/YeelightController';
import SensorAndWeatherOverview from "@/components/SensorAndWeatherOverview/SensorAndWeatherOverview";
import '@/styles/homePage.scss'

export default function Home() {
  return (
    <main className="home-page">
        <SensorAndWeatherOverview/>
        <YeelightController />
    </main>
  );
}
