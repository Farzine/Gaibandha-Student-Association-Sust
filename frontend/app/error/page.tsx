"use client";
import { useState } from "react";

// Data for landmarks and personalities
const landmarks = [
  {
    name: "Bamondanga and Noldanga Zamindar Bari",
    description:
      "Historical zamindar estate showcasing traditional Bengali architecture. The estate reflects the opulence of the zamindar era with its intricate designs and sprawling grounds.",
    image: "/images/landmark1.jpg",
  },
  {
    name: "Balashighat",
    description:
      "Important river port and trading center with historical significance. It was a bustling hub during the British colonial period.",
    image: "/images/landmark2.jpg",
  },
  {
    name: "Shah Sultan Gazi Mosque",
    description:
      "Ancient mosque with unique architectural features dating back centuries. It is a testament to the rich Islamic heritage of the region.",
    image: "/images/landmark3.jpg",
  },
  {
    name: "Birat Raja Dhibi",
    description:
      "Archaeological site with remnants of ancient civilization. Excavations have revealed artifacts from the pre-Mughal era.",
    image: "/images/landmark4.jpg",
  },
];

const personalities = [
  {
    name: "Shah Abdul Hamid",
    description:
      "First Speaker of independent Bangladesh, played a crucial role in the country's early parliamentary system.",
    image: "/images/person1.jpg",
  },
  {
    name: "Akhtaruzzaman Elias",
    description:
      "Renowned Bangladeshi writer and novelist, known for his contributions to Bengali literature.",
    image: "/images/person2.jpg",
  },
  {
    name: "Tulsi Lahiri",
    description:
      "Famous dramatist and theater personality, instrumental in promoting cultural arts in the region.",
    image: "/images/person3.jpg",
  },
  {
    name: "Fazle Rabbi Miah",
    description:
      "Honourable Deputy Speaker of Parliament, a prominent political figure from Gaibandha.",
    image: "/images/person4.jpg",
  },
];

// FlipCard Component
const FlipCard = ({ name, description, image }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => setIsFlipped(!isFlipped);

  return (
    <div
      className={`flip-card w-full ${isFlipped ? "flipped" : ""}`}
      onClick={handleClick}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front flex items-center justify-center rounded-lg bg-white p-6 text-black shadow-md transition-transform duration-300 dark:bg-[#1f2937] dark:text-white">
          <h4 className="text-center text-lg font-semibold">{name}</h4>
        </div>
        <div className="flip-card-back rounded-lg bg-white p-4 text-black shadow-md dark:bg-[#1f2937] dark:text-white">
          <div className="relative mb-4 h-0 pb-[56.25%]">
            <img
              src={image}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              alt={name}
              className="rounded-t-lg"
            />
          </div>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

const HistoryOfGaibandha = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openImageModal = (imageSrc) => {
    setModalImage(imageSrc);
    setIsImageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] transition-colors duration-300 dark:bg-[#111827]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#dbeafe] to-[#bfdbfe] py-20 dark:from-[#1e3a8a] dark:to-[#1e40af]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="animate-fade-in mb-6 text-5xl font-extrabold text-[#1e40af] dark:text-[#bfdbfe]">
            History of Gaibandha District
          </h2>
          <p className="mb-8 text-lg text-[#374151] dark:text-[#d1d5db]">
            Discover the rich heritage and vibrant journey of Gaibandha
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-20">
          <h3 className="mb-6 text-3xl font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
            Introduction
          </h3>
          <p className="leading-relaxed text-[#374151] dark:text-[#d1d5db]">
            Gaibandha, a northern district of Bangladesh established in 1984,
            lies within the Rangpur Division. Spanning 2,179 square kilometers
            along the Ghaghot River, it supports a population of approximately
            2.83 million (2011 census) across seven upazilas. The river shapes
            its geography and economy, fostering a rich cultural legacy.
          </p>
        </section>

        {/* Geography Section */}
        <section className="mb-20">
          <h3 className="mb-6 text-3xl font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
            Geography
          </h3>
          <div className="flex flex-col items-start gap-10 md:flex-row">
            <div className="md:w-1/2">
              <p className="leading-relaxed text-[#374151] dark:text-[#d1d5db]">
                Located along the Ghaghot River, Gaibandha’s fertile plains and
                riverine landscapes drive its agricultural economy. These
                natural features have historically supported the district&apos;s
                growth and sustenance.
              </p>
            </div>
            <div className="md:w-1/2">
              <div
                className="group relative h-72 cursor-pointer overflow-hidden rounded-xl shadow-xl"
                onClick={() => openImageModal("/images/cards/cards-01.png")}
              >
                <img
                  src="/images/cards/cards-01.png"
                  alt="Gaibandha Map"
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-60">
                  <span className="text-lg font-medium text-white">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Landmarks */}
        <section className="mb-20">
          <h3 className="mb-6 text-3xl font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
            Historical & Cultural Landmarks
          </h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {landmarks.map((landmark, index) => (
              <FlipCard
                key={index}
                name={landmark.name}
                description={landmark.description}
                image={landmark.image}
              />
            ))}
          </div>
        </section>

        {/* Notable Personalities */}
        <section className="mb-20">
          <h3 className="mb-6 text-3xl font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
            Notable Personalities
          </h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {personalities.map((person, index) => (
              <FlipCard
                key={index}
                name={person.name}
                description={person.description}
                image={person.image}
              />
            ))}
          </div>
        </section>

        {/* Development Section */}
        <section className="mb-20">
          <h3 className="mb-6 text-3xl font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
            Development and Economy
          </h3>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 leading-relaxed text-[#374151] dark:text-[#d1d5db]">
                Agriculture, including rice, wheat, and vegetables, sustains
                most of Gaibandha’s population. The district has advanced in
                education, healthcare, and infrastructure while preserving its
                cultural heritage.
              </p>
              <p className="leading-relaxed text-[#374151] dark:text-[#d1d5db]">
                The Gaibandha Student Association at SUST fosters community,
                cultural preservation, and academic excellence among students
                from the region.
              </p>
            </div>
            <div>
              <div
                className="group relative h-72 cursor-pointer overflow-hidden rounded-xl shadow-xl"
                onClick={() => openImageModal("/images/cards/cards-01.png")}
              >
                <img
                  src="/images/cards/cards-01.png"
                  alt="Gaibandha Agriculture"
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-60">
                  <span className="text-lg font-medium text-white">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="mb-20">
          <h3 className="mb-6 text-3xl font-bold text-[#1d4ed8] dark:text-[#93c5fd]">
            Gallery
          </h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {[
              "/images/cards/cards-01.png",
              "/images/cards/cards-01.png",
              "/images/cards/cards-01.png",
              "/images/cards/cards-01.png",
            ].map((src, index) => (
              <div
                key={index}
                className="group relative h-48 cursor-pointer overflow-hidden rounded-lg shadow-md"
                onClick={() => openImageModal(src)}
              >
                <img
                  src={src}
                  alt={`Gallery Image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative w-full max-w-4xl p-4">
            <img
              src={modalImage}
              style={{ objectFit: "contain", maxWidth: "100%" }}
              alt="Enlarged Image"
              className="rounded-lg w-full h-auto"
            />
            <button
              className="absolute right-2 top-2 rounded-full bg-[#dc2626] p-2 text-white hover:bg-[#b91c1c]"
              onClick={() => setIsImageModalOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryOfGaibandha;
