<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const slides = [
  { id: 1, image: '/images/ceviche.png', title: 'Frescura del Mar', subtitle: 'El mejor ceviche de la ciudad' },
  { id: 2, image: '/images/fried_fish.png', title: 'Sabor Tradicional', subtitle: 'Pescado frito crujiente al instante' },
  { id: 3, image: '/images/seafood_platter.png', title: 'Para Compartir', subtitle: 'Mariscadas que te sorprenderán' }
]

let slideInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})

const menuData = {
  entradas: [
    { nombre: "Aguachile", porcion: "Orden", variacion: "Verde, Negro, Rojo", precio: 170 },
    { nombre: "Aguachile Negro", porcion: "1 Lt", variacion: "Verde, Negro, Rojo", precio: 340 },
    { nombre: "Aguachile Chiltepín", porcion: "Orden", variacion: null, precio: 190 },
    { nombre: "Aguachile Chiltepín", porcion: "1 Lt", variacion: null, precio: 360 },
    { nombre: "Balazo", porcion: "Shot", variacion: null, precio: 65 },
    { nombre: "Alitas", porcion: null, variacion: "Al gusto", precio: 130 },
    { nombre: "Alitas", porcion: null, variacion: "BBQ", precio: 130 },
    { nombre: "Alitas", porcion: null, variacion: "Buffalo", precio: 130 },
    { nombre: "Almeja Reyna Preparada", porcion: null, variacion: null, precio: 95 },
    { nombre: "Camaronillas", porcion: "1 Pza", variacion: null, precio: 60 },
    { nombre: "Camaronillas", porcion: "3 Pzas", variacion: null, precio: 155 },
    { nombre: "Cecina", porcion: "Orden", variacion: null, precio: 180 },
    { nombre: "Ceviche de Camarón", porcion: "1 Lt", variacion: null, precio: 290 },
    { nombre: "Ceviche de Camarón", porcion: "Orden", variacion: null, precio: 160 },
    { nombre: "Ceviche de Pescado", porcion: "1 Lt", variacion: null, precio: 220 },
    { nombre: "Ceviche de Pescado", porcion: "Orden", variacion: null, precio: 115 },
    { nombre: "Consomé", porcion: null, variacion: null, precio: 40 },
    { nombre: "Huevera", porcion: "1 Lt", variacion: null, precio: 190 },
    { nombre: "Huevera", porcion: "Orden", variacion: null, precio: 100 },
    { nombre: "Marlin", porcion: "1 Lt", variacion: null, precio: 220 },
    { nombre: "Marlin", porcion: "Orden", variacion: null, precio: 150 },
    { nombre: "Ostiones", porcion: "1/2 Docena", variacion: null, precio: 90 },
    { nombre: "Ostiones", porcion: "Docena", variacion: null, precio: 140 },
    { nombre: "Papas a la Francesa", porcion: "Orden", variacion: null, precio: 70 },
    { nombre: "Pata de Mula", porcion: "1/2 Docena", variacion: null, precio: 70 },
    { nombre: "Pata de Mula", porcion: "Docena", variacion: null, precio: 130 },
    { nombre: "Taco Gobernador", porcion: "1 Pza", variacion: null, precio: 60 },
    { nombre: "Taco Gobernador", porcion: "3 Pzas", variacion: null, precio: 150 },
    { nombre: "Chamorro", porcion: null, variacion: null, precio: 235 }
  ],
  cocteles: [
    { nombre: "Coctel de Camarón", porcion: "Chico", variacion: null, precio: 150 },
    { nombre: "Coctel de Camarón", porcion: "Mediano", variacion: null, precio: 170 },
    { nombre: "Coctel de Camarón", porcion: "Grande", variacion: null, precio: 195 },
    { nombre: "Coctel Campechano", porcion: "Chico", variacion: null, precio: 165 },
    { nombre: "Coctel Campechano", porcion: "Mediano", variacion: null, precio: 185 },
    { nombre: "Coctel Campechano", porcion: "Grande", variacion: null, precio: 210 },
    { nombre: "Coctel de Pulpo", porcion: "Chico", variacion: null, precio: 165 },
    { nombre: "Coctel de Pulpo", porcion: "Mediano", variacion: null, precio: 185 },
    { nombre: "Coctel de Pulpo", porcion: "Grande", variacion: null, precio: 215 },
    { nombre: "Coctel Vuelve a la Vida", porcion: "Chico", variacion: null, precio: 180 },
    { nombre: "Coctel Vuelve a la Vida", porcion: "Mediano", variacion: null, precio: 205 },
    { nombre: "Coctel Vuelve a la Vida", porcion: "Grande", variacion: null, precio: 220 }
  ],
  especialidades: [
    { nombre: "Huachinango", porcion: null, variacion: "Al Gusto", precio: 350 },
    { nombre: "Huachinango", porcion: null, variacion: "Zarandeado", precio: 360 },
    { nombre: "Bagre", porcion: null, variacion: "Al Gusto", precio: 190 },
    { nombre: "Bagre", porcion: null, variacion: "Zarandeado", precio: 200 },
    { nombre: "Medallón de Atún", porcion: null, variacion: null, precio: 195 },
    { nombre: "Mojarra", porcion: null, variacion: "Al Gusto", precio: 200 },
    { nombre: "Mojarra", porcion: null, variacion: "Zarandeada", precio: 220 },
    { nombre: "Molcajete", porcion: null, variacion: "Frío", precio: 260 },
    { nombre: "Molcajete", porcion: null, variacion: "Mar y Tierra", precio: 280 },
    { nombre: "Molcajete", porcion: null, variacion: "Mixto", precio: 280 },
    { nombre: "Piña Rellena", porcion: null, variacion: null, precio: 260 },
    { nombre: "Pulpo", porcion: null, variacion: "Al Gusto", precio: 265 },
    { nombre: "Pulpo", porcion: null, variacion: "Zarandeado", precio: 285 },
    { nombre: "Rana", porcion: null, variacion: "Al Gusto", precio: 250 },
    { nombre: "Rana", porcion: null, variacion: "Zarandeada", precio: 265 },
    { nombre: "Salmón", porcion: null, variacion: "Al Gusto", precio: 265 },
    { nombre: "Salmón", porcion: null, variacion: "Zarandeado", precio: 285 },
    { nombre: "Langosta y Cola de Langosta", porcion: "Según Tamaño", variacion: "Según Temporada", precio: "Variable" }
  ]
}

const formatName = (item) => {
  let text = item.nombre;
  if (item.porcion) {
    text += ` ${item.porcion}`;
  }
  return text.toUpperCase();
}
</script>

<template>
  <div class="min-h-screen font-sans">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20 relative">
          
          <!-- Logo Badge overlapping navbar -->
          <div class="absolute left-4 top-2 bg-white p-1.5 md:p-2 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-slate-100 z-50 transition-transform duration-300 hover:scale-105 hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
            <div class="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img src="/images/logo.png" alt="El Marinero Loco Logo" class="w-full h-full object-cover" />
            </div>
          </div>

          <!-- Spacer to center navigation -->
          <div class="ml-24 md:ml-36 flex-shrink-0 flex items-center">
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#inicio" class="text-slate-900 hover:text-[#38B6FF] inline-flex items-center px-1 pt-1 font-medium transition-colors">Inicio</a>
            <a href="#carta" class="text-slate-900 hover:text-[#38B6FF] inline-flex items-center px-1 pt-1 font-medium transition-colors">Carta</a>
            <a href="#contacto" class="text-slate-900 hover:text-[#38B6FF] inline-flex items-center px-1 pt-1 font-medium transition-colors">Contacto</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Slider -->
    <section id="inicio" class="relative w-full h-[500px] md:h-[650px] mt-20 overflow-hidden bg-slate-900">
      <div v-for="(slide, index) in slides" :key="slide.id" 
           class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
           :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'">
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        <img :src="slide.image" class="absolute inset-0 w-full h-full object-cover" :alt="slide.title" />
        <div class="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-lg">{{ slide.title }}</h1>
          <p class="text-lg md:text-xl text-slate-200 font-light drop-shadow-md max-w-2xl">{{ slide.subtitle }}</p>
        </div>
      </div>
      
      <!-- Slider Controls -->
      <div class="absolute bottom-6 left-0 right-0 z-40 flex justify-center space-x-3">
        <button v-for="(_, index) in slides" :key="index" @click="currentSlide = index"
                class="w-3 h-3 rounded-full transition-colors"
                :class="currentSlide === index ? 'bg-[#E65100]' : 'bg-white/50 hover:bg-white'"></button>
      </div>

      <!-- Wave SVG -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30 pointer-events-none h-[60px] md:h-[100px]">
        <!-- Slower, translucent background wave -->
        <svg class="absolute bottom-0 left-0 w-[200%] h-full animate-[moveWave_15s_linear_infinite] opacity-60" viewBox="0 0 2400 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60 C1500,120 1500,0 1800,60 C2100,120 2100,0 2400,60 L2400,120 L0,120 Z" fill="#38B6FF" />
        </svg>
        <!-- Foreground wave -->
        <svg class="absolute bottom-0 left-0 w-[200%] h-full animate-[moveWave_10s_linear_infinite]" viewBox="0 0 2400 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C300,100 300,0 600,40 C900,100 900,0 1200,40 C1500,100 1500,0 1800,40 C2100,100 2100,0 2400,40 L2400,120 L0,120 Z" fill="#38B6FF" />
        </svg>
      </div>
    </section>

    <!-- Menu Section -->
    <section id="carta" class="py-16 bg-[#38B6FF]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-12">
          <h2 class="text-5xl md:text-7xl font-extrabold text-white italic tracking-wide" style="font-family: 'Brush Script MT', cursive, sans-serif;">Menú</h2>
          <p class="text-2xl text-slate-800 font-medium italic mt-2" style="font-family: 'Brush Script MT', cursive, sans-serif;">Alimentos</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          
          <!-- Column 1: Entradas -->
          <div>
            <h3 class="text-4xl font-black text-[#E65100] mb-6 uppercase tracking-wider text-center lg:text-left drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">Entradas</h3>
            <ul class="space-y-2">
              <li v-for="(item, index) in menuData.entradas" :key="'ent-'+index" class="flex flex-col">
                <div class="flex justify-between items-end border-b border-white/20 pb-1">
                  <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight pr-4">
                    {{ formatName(item) }}
                    <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                  </div>
                  <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                    {{ typeof item.precio === 'number' ? `$${item.precio}` : item.precio }}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Column 2: Cocteles & Especialidades -->
          <div class="flex flex-col space-y-12">
            <!-- Cocteles -->
            <div>
              <h3 class="text-4xl font-black text-[#E65100] mb-6 uppercase tracking-wider text-center lg:text-left drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">Cocteles</h3>
              <ul class="space-y-2">
                <li v-for="(item, index) in menuData.cocteles" :key="'coc-'+index" class="flex flex-col">
                  <div class="flex justify-between items-end border-b border-white/20 pb-1">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight pr-4">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? `$${item.precio}` : item.precio }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Especialidades -->
            <div>
              <h3 class="text-4xl font-black text-[#E65100] mb-6 uppercase tracking-wider text-center lg:text-left drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">Especialidades</h3>
              <ul class="space-y-2">
                <li v-for="(item, index) in menuData.especialidades" :key="'esp-'+index" class="flex flex-col">
                  <div class="flex justify-between items-end border-b border-white/20 pb-1">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight pr-4">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? `$${item.precio}` : item.precio }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contacto" class="py-24 bg-white relative flex flex-col items-center">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        <h2 class="text-5xl font-black text-slate-900 tracking-tight mb-4">Contáctanos</h2>
        <p class="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">Reserva tu mesa o haznos un pedido especial. ¡Te esperamos!</p>
        
        <!-- Main WhatsApp CTA -->
        <a href="https://wa.me/525551234567" target="_blank" rel="noopener noreferrer" 
           class="group relative inline-flex items-center justify-center px-8 py-5 text-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:-rotate-1 mb-16">
          <div class="absolute inset-0 bg-[#25D366] rounded-2xl shadow-[0_15px_30px_rgba(37,211,102,0.3)] transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(37,211,102,0.4)]"></div>
          <div class="absolute inset-0 border-4 border-slate-900 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <span class="relative flex items-center space-x-4">
            <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Reservar por WhatsApp</span>
          </span>
        </a>

        <!-- Other Links Distributed nicely -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto items-center">
          
          <!-- Instagram -->
          <a href="#" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 mb-4 text-slate-800 group-hover:text-[#E1306C] transition-colors">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <span class="text-slate-600 font-medium group-hover:text-slate-900">Instagram</span>
          </a>

          <!-- Facebook -->
          <a href="#" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 mb-4 text-slate-800 group-hover:text-[#1877F2] transition-colors">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <span class="text-slate-600 font-medium group-hover:text-slate-900">Facebook</span>
          </a>

          <!-- Google Maps -->
          <a href="#" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 mb-4 text-slate-800 group-hover:text-[#EA4335] transition-colors">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <span class="text-slate-600 font-medium group-hover:text-slate-900">Google Maps</span>
          </a>

          <!-- Email -->
          <a href="mailto:hola@elmarineroloco.com" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 mb-4 text-slate-800 group-hover:text-[#38B6FF] transition-colors">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <span class="text-slate-600 font-medium group-hover:text-slate-900">Correo</span>
          </a>

        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 py-12 text-center text-slate-400">
      <div class="max-w-7xl mx-auto px-4">
        <p class="text-lg font-bold text-white mb-2 uppercase tracking-wide">El Marinero Loco</p>
        <p>© 2026 Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>
