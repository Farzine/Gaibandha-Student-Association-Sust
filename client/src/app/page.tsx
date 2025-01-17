import { BackgroundBeamsDemo } from "@/components/BackgroundBeamsDemo";
import { BackgroundGradientDemo } from "@/components/BackgroundGradientDemo";
import { CardHoverEffectDemo } from "@/components/CardHoverEffectDemo";
import Navbar from "@/components/Navbar";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <div >
      <Navbar />
      <AnimatedTestimonials
        testimonials={[
          {
            quote:
              "I have been using it for a while now and it's great. I would recommend it to anyone.",
            name: "John Doe",
            designation: "CEO, Acme Inc.",
            src: "https://images.unsplash.com/profile-1446404465118-3a53b909cc82?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=3ef46b07bb19f68322d027cb8f9ac99f",
          },
          {
            quote:
              "I have been using it for a while now and it's great. I would recommend it to anyone.",
            name: "Jane Doe",
            designation: "CEO, Acme Inc.",
            src: "https://images.unsplash.com/profile-1446404465118-3a53b909cc82?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=3ef46b07bb19f68322d027cb8f9ac99f",
          },
          {
            quote:
              "I have been using it for a while now and it's great. I would recommend it to anyone.",
            name: "John Doe",
            designation: "CEO, Acme Inc.",
            src: "https://images.unsplash.com/profile-1446404465118-3a53b909cc82?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64&s=3ef46b07bb19f68322d027cb8f9ac99f",
          },
        ]}
        autoplay
      />
      <div className="mt-10">
        <BackgroundBeamsDemo />
      </div>
      <div className="mt-10">
        <BackgroundGradientDemo />
      </div>
      <div className="mt-10">
        <CardHoverEffectDemo />
      </div>
    </div>
  );
}
