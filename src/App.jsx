import { useEffect, useRef, useState } from "react";
import "./styles.css";

import useScrollJourney from "./lib/useScrollJourney";
import Scene3D from "./components/Scene3D";
import LoadingScreen from "./components/LoadingScreen";
import AgeGate from "./components/AgeGate";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import RotateScene from "./components/RotateScene";
import Marquee from "./components/Marquee";
import CategoryScene from "./components/CategoryScene";
import SpinMoment from "./components/SpinMoment";
import PartyEssentials from "./components/PartyEssentials";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Location from "./components/Location";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  const journeyRef = useRef(null);
  useScrollJourney(journeyRef);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [loading]);

  return (
    <>
      <LoadingScreen show={loading} />
      <AgeGate />
      <CustomCursor />
      <Nav />

      <Scene3D className="scene-fixed" />

      <main ref={journeyRef} className="journey">
        <Hero />
        <RotateScene />

        <Marquee text="BEER • WINE • LIQUOR • LOTTO • SNACKS • COLD DRINKS • PARTY ESSENTIALS" direction="left" speed={30} />

        <CategoryScene />
        <SpinMoment />
        <PartyEssentials />

        <Marquee text="LIQUOR • BEER • WINE • LOTTO" direction="right" speed={24} />

        <About />
        <Gallery />
        <Reviews />
        <Location />
      </main>

      <Footer />
      <MobileActionBar />
    </>
  );
}
