import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./styles.css";

import useScrollJourney from "./lib/useScrollJourney";
import LoadingScreen from "./components/LoadingScreen";
import AgeGate from "./components/AgeGate";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CategoryScene from "./components/CategoryScene";
import PartyEssentials from "./components/PartyEssentials";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import Location from "./components/Location";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";

const Scene3D = lazy(() => import("./components/Scene3D"));

export default function App() {
  const journeyRef = useRef(null);
  useScrollJourney(journeyRef);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1050);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [loading]);

  return (
    <>
      <LoadingScreen show={loading} />
      <AgeGate />
      <Nav />
      <Suspense fallback={<div className="scene-loading" aria-hidden="true" />}>
        <Scene3D className="scene-fixed" />
      </Suspense>

      <main ref={journeyRef} className="journey">
        <Hero />

        <CategoryScene />
        <PartyEssentials />
        <Gallery />
        <Reviews />
        <Location />
      </main>

      <Footer />
      <MobileActionBar />
    </>
  );
}
