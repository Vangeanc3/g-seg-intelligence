<template>
  <div class="landing-page">
    <LandingNav />
    <HeroSection />
    <FeaturesSection />
    <ComoFunciona />
    <PlanosSection />
    <CtaSection />
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import LandingNav from './components/LandingNav.vue'
import HeroSection from './components/HeroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import ComoFunciona from './components/ComoFunciona.vue'
import PlanosSection from './components/PlanosSection.vue'
import CtaSection from './components/CtaSection.vue'
import LandingFooter from './components/LandingFooter.vue'
</script>

<style scoped>
.landing-page {
  background: #0f172a;
  min-height: 100vh;
  color: #e2e8f0;
}
</style>
