import TickerBar from "@/components/landing/TickerBar";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import MarketBoard from "@/components/landing/MarketBoard";
import Pillars from "@/components/landing/Pillars";
import Sponsors from "@/components/landing/Sponsors";
import JoinCTA from "@/components/landing/JoinCTA";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <TickerBar />
      <Navbar />
      <main>
        <Hero />
        <MarketBoard />
        <Pillars />
        <Sponsors />
        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
