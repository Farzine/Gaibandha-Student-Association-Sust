"use client";
import { MorphingText } from "@/components/ui/morphing-text";
import { TextAnimate } from "@/components/ui/text-animate";
import Link from "next/link";
import { useState } from "react";

// Data for landmarks and personalities
const landmarks = [
  {
    name: "Bamondanga Zamindar Bari",
    description:
      "Historical zamindar estate showcasing traditional Bengali architecture. The estate reflects the opulence of the zamindar era with its intricate designs and sprawling grounds.",
    image: "/about/Bamondangga Jomidar Bari.jpg",
  },
  {
    name: "Balashighat",
    description:
      "Important river port and trading center with historical significance. It was a bustling hub during the British colonial period. The port continues to be a vital economic center for the region.",
    image: "/about/Balashighat.jpg",
  },
  {
    name: "Shah Sultan Gazi Mosque",
    description:
      "Ancient mosque with unique architectural features dating back centuries. It is a testament to the rich Islamic heritage of the region. The mosque is named after the revered Sufi saint Shah Sultan Gazi aslo known as Mirer Moidan.",
    image: "/about/Shah Sultan Gazi Mosque.jpg",
  },
  {
    name: "Birat Raja Dhibi",
    description:
      "Archaeological site with remnants of ancient civilization. Excavations have revealed artifacts from the pre-Mughal era. It is situated in the village of Gobindaganj.",
    image: "/about/Birat Rajar Dhibi.jpg",
  },
  {
    name: "Kadirbox Mondol Mosque",
    description:
      "Historical mosque with intricate designs and architectural significance. The mosque is named after the prominent religious leader Kadirbox Mondol. It is situated in the Nuniagari area of Palashbari upazila town. It built in 18th century.",
    image: "/about/Kadirbox Mondol mosque.jpg",
  },
  {
    name: "Kacharibari of Zamindar Rajes Kanto Roy",
    description:
      "Kacharibari of Zamindar Rajes Kanto Roy in Hat Bharatkhali of Saghata Upazila of Gaibandha stands as a witness of the times. Almost 250 years old, the building is a symbol of the zamindari era.",
    image: "/about/Kacharibari of Zamindar Rajes Kanto Roy.jpg",
  },
  {
    name: "Bardhan Kuthi",
    description:
      "Bardhan Kuthi, located in Gobindganj, Gaibandha, Bangladesh, was historically governed by Raja Harinath during British rule. The last ruler, Shailesh Chandra, moved to India during the Partition, marking its historical significance.",
    image: "/about/Bardhan Kuthi.jpg",
  },
  {
    name: "Naldanga Zamindar Bari",
    description:
      "The founder of the Zamindar house is Zamindar Kashinath Lahiri. On the advice of Sarbananda Goswami, Kashinath Lahiri was appointed as the new Khassonbish. He played a key role in the state's politics.",
    image: "/about/Naldanga Jamidar Bari.jpg",
  },
];

const personalities = [
  {
    name: "Shah Abdul Hamid",
    description:
      "Shah Abdul Hamid (1890–1972) was a prominent politician and the first Speaker of Bangladesh's National Parliament. A lawyer and social worker, he played a key role in the independence movement. He was born in Govindaganj, Gaibandha.",
    image: "/about/Shah Abdul Hamid.jpg",
  },
  {
    name: "Akhtaruzzaman Elias",
    description:
      "Akhteruzzaman Elias (1943–1997) was a renowned Bangladeshi novelist and short story writer. His notable works include Chilekothar Sepai (1987) and Khwabnama (1996), both celebrated in Bengali literature. He was born in Gotia village, Gaibandha.",
    image: "/about/Akhtaruzzaman Elias.jpg",
  },
  {
    name: "Tulsi Lahiri",
    description:
      "Tulsi Lahiri (1897–1959) was a renowned playwright, actor, and music composer. He gained fame for his contributions to Bengali theatre and cinema. His notable works include plays like Dukher Imam (1947) and Chheratar (1950).",
    image: "/about/Tulsi Lahiri.jpg",
  },
  {
    name: "Fazle Rabbi Miah",
    description:
      "Md. Fazle Rabbi Miah (1946–2022) was a prominent Bangladesh Awami League politician. He served as the Deputy Speaker of the Jatiya Sangsad and represented Gaibandha-5 for seven terms.",
    image: "/about/Fazle Rabbi Miah.jpg",
  },
];

// FlipCard Component
const FlipCard = ({ name, description, image }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => setIsFlipped(!isFlipped);

  return (
    <div
      className="flip-card h-80 w-full cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && handleClick()}
      role="button"
      aria-label={`Card for ${name}`}
    >
      <div className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}>
        {/* Front Side - Image with Title overlay */}
        <div className="flip-card-front relative h-full overflow-hidden rounded-xl shadow-lg transition-all">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-5">
            <h4 className="text-lg font-bold text-white">{name}</h4>
            <div className="mt-2 flex items-center">
              <span className="mr-2 h-0.5 w-10 bg-primary"></span>
              <span className="text-sm text-white/80">Learn more</span>
            </div>
          </div>
        </div>

        {/* Back Side - Description with elegant styling */}
        <div className="flip-card-back flex h-full flex-col rounded-xl bg-white p-0 shadow-lg dark:bg-[#1f2937]">
          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <h4 className="mb-4 text-base font-bold text-[#1f2937] dark:text-white">
                {name}
              </h4>
              <div className="mb-3 h-0.5 w-16 bg-primary"></div>
              <p className="text-xs leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                {description}
              </p>
            </div>

            <button
              className="mt-6 self-start rounded-full bg-white/30 px-4 py-2 text-sm font-medium text-[#2563eb] transition-all hover:bg-[#2563eb] hover:text-white dark:bg-[#2563eb]/20 dark:text-[#60a5fa] dark:hover:bg-[#60a5fa] dark:hover:text-[#1f2937]"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scoped CSS for Flip Effect */}
      <style jsx>{`
        .flip-card {
          perspective: 1500px;
          transform-style: preserve-3d;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        @media (hover: hover) {
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
        }
        .flip-card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          overflow: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

const HistoryOfGaibandha = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const texts = ["Gaibandha", "The Jewel of the North"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);

  const galleryImagesList = [
    "/about/Balashighat.jpg",
    "/about/SKS Inn.jpg",
    "/about/SKS Inn 2.jpg",
    "/about/Saghata_Gaibandha.jpg",
    "/about/Friendship Center.jpg",
    "/about/Dream Land.jpg",
    "/about/Gaibandha River Port.jpg",
    "/about/Gaibandha Powro Park.jpg",
    "about/Fulsori_Ghat_Gaibandha.jpg",
    "/about/Gaibandha Railway Station.jpg",
    "/about/Gaibandha Govt. College.jpg",
    "/about/Gaibandha Govt. Boys High School.jpg",
  ];
  const introduction = [
    "/about/Gaibandha Railway Station.jpg",
    "/about/Gaibandha Govt. College.jpg",
    "/about/Gaibandha Govt. Boys High School.jpg",
    "/about/Gaibandha Govt. Girls High School.jpg",
    "/about/Ahammad Uddin Shah Shishu Niketon School and College.jpg",
  ];

  const geography = [
    "/about/Gaibandha District Locator Map.png",
    "/about/Gaibandha Map.GIF",
  ];

  const openImageModal = (imageSrc, imagesArray = [imageSrc]) => {
    setGalleryImages(imagesArray);
    const index = imagesArray.indexOf(imageSrc);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setIsImageModalOpen(true);
  };

  const navigateImage = (direction) => {
    const newIndex =
      (currentImageIndex + direction + galleryImages.length) %
      galleryImages.length;
    setCurrentImageIndex(newIndex);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fde68a] to-[#eef2ff] mix-blend-multiply"></div>
          <img
            src="/about/Fulsori_Ghat_Gaibandha.jpg"
            alt="Fulsori Ghat, Gaibandha"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
          <div className="absolute bottom-4 right-4 rounded bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
            Fulsori Ghat, Gaibandha
          </div>
        </div>
        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="mt-50 max-w-3xl text-white md:mt-44">
            <MorphingText texts={texts} />
            <TextAnimate
              animation="blurInUp"
              by="character"
              once
              className="bg-transparent text-base text-white dark:text-white md:text-lg"
            >
              Discover the rich heritage and vibrant history of this cultural
              gem in northern Bangladesh
            </TextAnimate>
            <div className="animate-fade-in-up animation-delay-300 mt-8 flex space-x-4">
              <Link
                href="#history"
                className="rounded border-2 border-white bg-graydark bg-opacity-50 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                Explore History
              </Link>
              <Link
                href="#Gallery"
                className="rounded border-2 border-white bg-body-color bg-transparent px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Introduction */}
        <section className="mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-8 pr-0 md:mb-0 md:w-1/2 md:pr-16">
              <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">
                Our History
              </span>
              <h3 className="mb-6 text-3xl font-bold leading-tight text-[#1f2937] dark:text-white md:text-4xl">
                A Northern Jewel of Bangladesh
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                Gaibandha, a northern district of Bangladesh established in
                1984, lies within the Rangpur Division. Spanning 2,179 square
                kilometers along the Ghaghot River. According to the 2022
                census, Gaibandha district had a population of 2,562,232, with
                1,238,621 males, 1,317,944 females, and 195 third genders.
              </p>
              <p className="text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                The river shapes its geography and economy, fostering a rich
                cultural legacy that continues to influence the region today.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -right-5 -top-5 h-20 w-20 animate-pulse rounded-full bg-meta-5 opacity-20"></div>
                <div className="absolute -bottom-5 -left-5 h-32 w-32 animate-pulse rounded-full bg-[#2563eb] opacity-10"></div>
                <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="/about/Gaibandha Powro Park.jpg"
                    alt="Gaibandha Overview"
                    className="h-auto w-full"
                    onClick={() =>
                      openImageModal(
                        "/about/Gaibandha Powro Park.jpg",
                        introduction,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Geography Section */}
        <section className="relative mb-24 md:mb-32">
          <div className="flex flex-col gap-12 md:flex-row md:items-center">
            <div className="order-2 md:order-1 md:w-1/2">
              <div
                className="group transform cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                onClick={() =>
                  openImageModal("/about/Gaibandha District Locator Map.png", geography)
                }
              >
                <img
                  src="/about/Gaibandha District Locator Map.png"
                  alt="Gaibandha Map"
                  className="h-auto w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span className="translate-y-6 transform rounded bg-white/30 px-6 py-3 text-lg font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                    View Full Map
                  </span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 md:w-1/2">
              <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">
                Geography
              </span>
              <h3 className="mb-6 text-3xl font-bold leading-tight text-[#1f2937] dark:text-white md:text-4xl">
                Riverine Landscapes
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                Located along the majestic Ghaghot River, Gaibandha's fertile
                plains and unique riverine landscapes drive its agricultural
                economy and shape the daily lives of its inhabitants.
              </p>
              <p className="text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                These natural features have historically supported the
                district's growth and cultural development, creating a unique
                regional identity characterized by its close relationship with
                water.
              </p>
              <div className="mt-8 flex space-x-3">
                <div className="rounded-lg bg-[#e5e7eb] px-4 py-2 font-medium text-[#1d4ed8] dark:bg-white/10 dark:text-primary">
                  River Systems
                </div>
                <div className="rounded-lg bg-[#e5e7eb] px-4 py-2 font-medium text-[#1d4ed8] dark:bg-white/10 dark:text-primary">
                  Fertile Plains
                </div>
                <div className="rounded-lg bg-[#e5e7eb] px-4 py-2 font-medium text-[#1d4ed8] dark:bg-white/10 dark:text-primary">
                  Agriculture
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Landmarks */}
        <section id="history" className="mb-24 md:mb-32">
          <div className="mb-16 text-center">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">
              Our Heritage
            </span>
            <h3 className="mb-6 text-3xl font-bold leading-tight text-[#1f2937] dark:text-white md:text-4xl">
              Historical & Cultural Landmarks
            </h3>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
              Gaibandha is home to numerous historical sites that tell the story
              of Bangladesh's rich cultural past
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        <section className="relative mb-24 md:mb-32">

          <div className="mb-16 text-center">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">
              Inspiring Figures
            </span>
            <h3 className="mb-6 text-3xl font-bold leading-tight text-[#1f2937] dark:text-white md:text-4xl">
              Notable Personalities
            </h3>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
              Distinguished individuals who have brought pride and recognition
              to Gaibandha through their achievements
            </p>
          </div>

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
        <section className="mb-24 md:mb-32">
          <div className="dark:to-[#c7d2fe ] rounded-3xl bg-gradient-to-br md:p-12">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div>
                <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">
                  Progress & Growth
                </span>
                <h3 className="mb-6 text-3xl font-bold leading-tight text-[#1f2937] dark:text-white md:text-4xl">
                  Development and Economy
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                  Agriculture, including rice, wheat, corn and vegetables, sustains
                  most of Gaibandha's population. The district has made
                  significant strides in education, healthcare, and
                  infrastructure while preserving its cultural heritage.
                </p>
                <p className="mb-8 text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                It was said that "The scent of Rasmanjuri, full of flavor, the corn and chilies of the Char region are the lifeblood of Gaibandha."
                </p>
                <p className="mb-8 text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
                  The Gaibandha Student Association at SUST fosters community,
                  cultural preservation, and academic excellence among students
                  from the region.
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col items-center rounded-xl bg-white p-4 text-center shadow-md dark:bg-[#1f2937]">
                    <span className="text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                      7
                    </span>
                    <span className="mt-2 text-sm text-[#4b5563] dark:text-[#d1d5db]">
                      Upazilas
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-white p-4 text-center shadow-md dark:bg-[#1f2937]">
                    <span className="text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                      2.56M
                    </span>
                    <span className="mt-2 text-sm text-[#4b5563] dark:text-[#d1d5db]">
                      Population
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-white p-4 text-center shadow-md dark:bg-[#1f2937]">
                    <span className="text-3xl font-bold text-[#2563eb] dark:text-[#60a5fa]">
                      2,179
                    </span>
                    <span className="mt-2 text-sm text-[#4b5563] dark:text-[#d1d5db]">
                      sq. km
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl"
                  onClick={() =>
                    openImageModal("/about/Gaibandha River Port.jpg")
                  }
                >
                  <img
                    src="/about/Gaibandha River Port.jpg"
                    alt="Gaibandha Agriculture"
                    className="h-auto w-full transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Link href={"https://en.wikipedia.org/wiki/Gaibandha_District"} className="translate-y-6 transform rounded bg-white/30 px-6 py-3 font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                      Explore Economy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section id="Gallery" className="mb-16">
          <div className="mb-16 text-center">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-primary">
              Visual Journey
            </span>
            <h3 className="mb-6 text-3xl font-bold leading-tight text-[#1f2937] dark:text-white md:text-4xl">
              Gallery
            </h3>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#4b5563] dark:text-[#d1d5db]">
              Experience the beauty and diversity of Gaibandha through our
              curated collection of images
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
            {galleryImagesList.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square transform cursor-pointer overflow-hidden rounded-xl shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                onClick={() => openImageModal(src, galleryImagesList)}
              >
                <img
                  src={src}
                  alt={`Gallery Image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="p-4 text-sm font-medium text-white">
                    Gaibandha Scene {index + 1}
                  </span>
                  <span className="p-4">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative w-full max-w-5xl p-4 md:p-0">
            <img
              src={galleryImages[currentImageIndex]}
              alt="Enlarged Image"
              className="mx-auto max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            <div className="absolute bottom-4 right-4 rounded bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {galleryImages[currentImageIndex].split("/").pop()}
            </div>
            <button
              className="absolute right-4 top-4 transform rounded-full bg-[#dc2626] p-2 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#b91c1c]"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage(-1);
                }}
                className="rounded-full bg-white/30 p-2 text-black backdrop-blur-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage(1);
                }}
                className="rounded-full bg-white/30 p-2 text-black backdrop-blur-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryOfGaibandha;
