import HeroSection from "../components/HeroSection";
import ServicesPreview from "../components/ServicesPreview";
import CoursePreview from "../components/CoursePreview";
import TestimonialsSection from "../components/TestimonialsSection";

const heroImage = "https://media.base44.com/images/public/69c85189646ba632d738f811/6cf71133f_WhatsAppImage2026-03-29at0049111.jpg";
const courseImage = "https://media.base44.com/images/public/69c85189646ba632d738f811/6c4856f9a_WhatsAppImage2026-03-29at161158.jpg";"https://media.base44.com/images/public/69c85189646ba632d738f811/e933a3426_generated_image.png";"https://media.base44.com/images/public/69c85189646ba632d738f811/431b3cf33_generated_image.png";"https://media.base44.com/images/public/69c85189646ba632d738f811/aadef5cc4_generated_52bc3570.png";

export default function Home() {
  return (
    <div>
      <HeroSection heroImage={heroImage} />
      <ServicesPreview />
      <CoursePreview courseImage={courseImage} />
      <TestimonialsSection />
    </div>
  );
}