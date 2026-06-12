import { HeroSection } from '@/components/home/HeroSection'
import { DiscountedVillas } from '@/components/home/DiscountedVillas'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { PopularVillas } from '@/components/home/PopularVillas'
import { HoneymoonVillas } from '@/components/home/HoneymoonVillas'
import { RegionSection } from '@/components/home/RegionSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { BlogPreview } from '@/components/home/BlogPreview'
import { WizardCTA } from '@/components/home/WizardCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DiscountedVillas />
      <CategoryGrid />
      <PopularVillas />
      <HoneymoonVillas />
      <RegionSection />
      <WizardCTA />
      <TestimonialsSection />
      <BlogPreview />
    </>
  )
}
