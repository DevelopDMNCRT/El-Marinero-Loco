<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`

// --- Slider ---
const currentSlide = ref(0)
const slides = [
  { id: 1, image: '/images/ceviche.png', title: 'Frescura del Mar', subtitle: 'El mejor ceviche de la ciudad' },
  { id: 2, image: '/images/fried_fish.png', title: 'Sabor Tradicional', subtitle: 'Pescado frito crujiente al instante' },
  { id: 3, image: '/images/seafood_platter.png', title: 'Para Compartir', subtitle: 'Mariscadas que te sorprenderán' }
]
let slideInterval = null
const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % slides.length }

// --- Auth ---
const showLoginModal = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const loginLoading = ref(false)
const isLoggedIn = ref(!!localStorage.getItem('ml_token'))

const handleLogin = async () => {
  loginError.value = ''
  loginLoading.value = true
  try {
    await new Promise(r => setTimeout(r, 600)) // simula pequeña espera
    if (loginEmail.value === 'yay@ejemplo.com' && loginPassword.value === 'astro23') {
      localStorage.setItem('ml_token', 'hardcoded-admin-token')
      isLoggedIn.value = true
      showLoginModal.value = false
      loginEmail.value = ''
      loginPassword.value = ''
    } else {
      loginError.value = 'Correo o contraseña incorrectos.'
    }
  } catch (e) {
    loginError.value = 'Ocurrió un error inesperado.'
  } finally {
    loginLoading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('ml_token')
  isLoggedIn.value = false
  editingCategory.value = null
}

// --- Menu Data (reactive, loaded from backend) ---
const menuData = ref({
  'entradas': {
    'title': 'Entradas',
    'items': []
  },
  'cocteles': {
    'title': 'Cocteles',
    'items': []
  },
  'especialidades': {
    'title': 'Especialidades',
    'items': []
  },
  'torres': {
    'title': 'Torres',
    'items': []
  },
  'camarones': {
    'title': 'Camarones',
    'items': []
  },
  'caldos': {
    'title': 'Caldos',
    'items': []
  },
  'filetes': {
    'title': 'Filetes',
    'items': []
  },
  'tostadas': {
    'title': 'Tostadas',
    'items': []
  },
  'cortes': {
    'title': 'Cortes',
    'items': []
  },
  'marineritos': {
    'title': 'Marineritos',
    'items': []
  },
  'cerveza': {
    'title': 'Cerveza',
    'items': []
  },
  'refrescos': {
    'title': 'Refrescos',
    'items': []
  },
  'sinalcohol': {
    'title': 'Sin Alcohol',
    'items': []
  },
  'mezcales': {
    'title': 'Mezcales',
    'items': []
  },
  'ron': {
    'title': 'Ron',
    'items': []
  },
  'brandy': {
    'title': 'Brandy',
    'items': []
  },
  'bebidas': {
    'title': 'Bebidas',
    'items': []
  },
  'tequilas': {
    'title': 'Tequilas',
    'items': []
  },
  'whisky': {
    'title': 'Whisky',
    'items': []
  },
  'vodka': {
    'title': 'Vodka',
    'items': []
  },
  'vinos': {
    'title': 'Vinos',
    'items': []
  },
  'cocteleria': {
    'title': 'Cocteleria',
    'items': []
  },
  'postres': {
    'title': 'Postres',
    'items': []
  }
})
const menuLoading = ref(true)

const loadMenu = async () => {
  try {
    const res = await fetch(`${API}/api/menu`)
    if (res.ok) {
      const serverData = await res.json()
      menuData.value = { ...menuData.value, ...serverData }
    }
  } catch (e) {
    console.error('No se pudo cargar el menú:', e)
  } finally {
    menuLoading.value = false
  }
}

// --- Banners ---
const banners = ref({ banner1: null, banner2: null, banner3: null, banner4: null, banner5: null })

const loadBanners = async () => {
  try {
    const res = await fetch(`${API}/api/banners`)
    if (res.ok) banners.value = await res.json()
  } catch (e) { console.error('No se pudieron cargar los banners:', e) }
}

const uploadBanner = async (id, file) => {
  const token = localStorage.getItem('ml_token')
  const form = new FormData()
  form.append('image', file)
  try {
    const res = await fetch(`${API}/api/banners/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: form
    })
    const data = await res.json()
    if (res.ok) banners.value[id] = data.url + '?t=' + Date.now()
  } catch (e) { console.error('Error subiendo banner:', e) }
}

const deleteBanner = async (id) => {
  const token = localStorage.getItem('ml_token')
  try {
    const res = await fetch(`${API}/api/banners/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) banners.value[id] = null
  } catch (e) { console.error('Error eliminando banner:', e) }
}

const triggerBannerUpload = (id) => {
  document.getElementById(`banner-input-${id}`).click()
}

const onBannerFileChange = (id, event) => {
  const file = event.target.files[0]
  if (file) uploadBanner(id, file)
  event.target.value = ''
}

// --- Edit Mode ---
const editingCategory = ref(null) // 'entradas' | 'cocteles' | 'especialidades' | null
const savingCategory = ref(null)
const saveSuccess = ref(null)

const toggleEdit = (cat) => {
  editingCategory.value = editingCategory.value === cat ? null : cat
}

const saveCategory = async (cat) => {
  savingCategory.value = cat
  const token = localStorage.getItem('ml_token')
  try {
    const res = await fetch(`${API}/api/menu/${cat}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: menuData.value[cat].title, items: menuData.value[cat].items })
    })
    if (res.ok) {
      saveSuccess.value = cat
      setTimeout(() => { saveSuccess.value = null }, 2500)
      editingCategory.value = null
    }
  } catch (e) {
    console.error('Error guardando:', e)
  } finally {
    savingCategory.value = null
  }
}

const deleteItem = (cat, index) => {
  menuData.value[cat].items.splice(index, 1)
}

// --- Item Edit Modal ---
const showItemModal = ref(false)
const itemModalCat = ref(null)
const itemModalIndex = ref(null) // null = new item
const itemForm = ref({ nombre: '', porcion: '', variacion: '', precio: '' })

const openAddItem = (cat) => {
  itemModalCat.value = cat
  itemModalIndex.value = null
  itemForm.value = { nombre: '', porcion: '', variacion: '', precio: '' }
  showItemModal.value = true
}

const openEditItem = (cat, index) => {
  itemModalCat.value = cat
  itemModalIndex.value = index
  const item = menuData.value[cat].items[index]
  itemForm.value = {
    nombre: item.nombre || '',
    porcion: item.porcion || '',
    variacion: item.variacion || '',
    precio: item.precio || ''
  }
  showItemModal.value = true
}

const saveItemModal = () => {
  const cat = itemModalCat.value
  const newItem = {
    nombre: itemForm.value.nombre.trim(),
    porcion: itemForm.value.porcion.trim() || null,
    variacion: itemForm.value.variacion.trim() || null,
    precio: isNaN(Number(itemForm.value.precio)) ? itemForm.value.precio : Number(itemForm.value.precio)
  }
  if (!newItem.nombre) return
  if (itemModalIndex.value === null) {
    menuData.value[cat].items.push(newItem)
  } else {
    menuData.value[cat].items[itemModalIndex.value] = newItem
  }
  showItemModal.value = false
}

// --- Helpers ---
const formatName = (item) => {
  let text = item.nombre
  if (item.porcion) text += ` ${item.porcion}`
  return text.toUpperCase()
}

const categories = ['entradas', 'cocteles', 'especialidades', 'torres', 'camarones', 'caldos', 'filetes', 'tostadas', 'cortes', 'marineritos', 'cerveza', 'refrescos', 'sinalcohol', 'mezcales', 'ron', 'brandy', 'bebidas', 'tequilas', 'whisky', 'vodka', 'vinos', 'cocteleria', 'postres']

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
  loadMenu()
  loadBanners()
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
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
          <div class="ml-auto flex items-center space-x-3 sm:space-x-8 text-sm sm:text-base">
            <a href="#inicio" class="text-slate-900 hover:text-[#38B6FF] inline-flex items-center px-1 pt-1 font-medium transition-colors">Inicio</a>
            <a href="#carta" class="text-slate-900 hover:text-[#38B6FF] inline-flex items-center px-1 pt-1 font-medium transition-colors">Carta</a>
            <a href="#contacto" class="text-slate-900 hover:text-[#38B6FF] inline-flex items-center px-1 pt-1 font-medium transition-colors">Contacto</a>
            
            <!-- User Icon -->
            <button v-if="!isLoggedIn" @click="showLoginModal = true" class="text-[#0F3057] hover:text-[#38B6FF] transition-colors pl-4 focus:outline-none flex items-center justify-center" title="Iniciar sesión">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
            <button v-else @click="handleLogout" class="text-[#38B6FF] hover:text-red-500 transition-colors pl-4 focus:outline-none flex items-center gap-1 text-sm font-medium" title="Cerrar sesión">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Salir
            </button>
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
    <section id="carta" class="py-16 bg-gradient-to-b from-[#38B6FF] via-[#00587A] to-[#0F3057] relative overflow-hidden">
      <!-- Bubbles -->
      <div class="absolute inset-0 pointer-events-none z-0">
        <div class="bubble absolute bottom-[-5%] left-[10%] w-6 h-6 rounded-full border border-white/30 bg-white/10" style="animation-duration: 15s; animation-delay: 0s;"></div>
        <div class="bubble absolute bottom-[-5%] left-[25%] w-8 h-8 rounded-full border border-white/20 bg-white/5" style="animation-duration: 25s; animation-delay: 2s;"></div>
        <div class="bubble absolute bottom-[-5%] left-[50%] w-4 h-4 rounded-full border border-white/30 bg-white/10" style="animation-duration: 20s; animation-delay: 5s;"></div>
        <div class="bubble absolute bottom-[-5%] left-[75%] w-10 h-10 rounded-full border border-white/20 bg-white/5" style="animation-duration: 30s; animation-delay: 1s;"></div>
        <div class="bubble absolute bottom-[-5%] left-[85%] w-5 h-5 rounded-full border border-white/30 bg-white/10" style="animation-duration: 18s; animation-delay: 7s;"></div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div class="text-center mb-12">
          <h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white italic tracking-wide" style="font-family: 'Brush Script MT', cursive, sans-serif;">Menú</h2>
          <p class="text-2xl text-slate-800 font-medium italic mt-2" style="font-family: 'Brush Script MT', cursive, sans-serif;">Alimentos</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
          
          <!-- Column 1: Entradas -->
          <div>
            <!-- Category Header -->
            <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
              <input v-if="editingCategory === 'entradas'" v-model="menuData.entradas.title"
                class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md"
                style="[text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]" />
              <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                {{ menuData.entradas.title }}
              </h3>
              <button v-if="isLoggedIn" @click="editingCategory === 'entradas' ? saveCategory('entradas') : toggleEdit('entradas')"
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                :class="editingCategory === 'entradas' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'"
                :title="editingCategory === 'entradas' ? 'Guardar cambios' : 'Editar categoría'">
                <svg v-if="editingCategory !== 'entradas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </button>
            </div>

            <ul class="space-y-0">
              <li v-for="(item, index) in menuData.entradas.items" :key="'ent-'+index" class="group/row flex flex-col">
                <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2"
                  :class="editingCategory === 'entradas' ? 'hover:bg-white/5 rounded px-1 cursor-pointer' : ''">
                  <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                    {{ formatName(item) }}
                    <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                  </div>
                  <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                    {{ typeof item.precio === 'number' ? `$${item.precio}` : item.precio }}
                  </div>
                  <!-- Edit/Delete row actions -->
                  <div v-if="editingCategory === 'entradas'" class="flex items-center gap-1 shrink-0">
                    <button @click="openEditItem('entradas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors" title="Editar">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button @click="deleteItem('entradas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors" title="Eliminar">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Add item button -->
            <button v-if="editingCategory === 'entradas'" @click="openAddItem('entradas')"
              class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Agregar platillo
            </button>

            <!-- Banner 1 -->
            <div class="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mt-10 group/banner">
              <!-- Hidden file input -->
              <input :id="'banner-input-banner1'" type="file" accept="image/*" class="hidden" @change="onBannerFileChange('banner1', $event)" />
              
              <!-- Image or placeholder -->
              <div v-if="banners.banner1" class="w-full h-full">
                <img :src="banners.banner1.startsWith('http') ? banners.banner1 : API + banners.banner1" class="w-full h-full object-cover" alt="Banner publicitario 1" />
              </div>
              <div v-else class="w-full h-full bg-slate-300 border-2 border-dashed border-slate-400 flex items-center justify-center shadow-inner">
                <div class="flex flex-col items-center">
                  <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
                  <span class="text-slate-400 text-xs mt-1 font-medium">(Recomendado: 800x200 px)</span>
                </div>
              </div>

              <!-- Edit Controls (only when logged in) -->
              <div v-if="isLoggedIn" class="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button @click="triggerBannerUpload('banner1')" class="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Subir imagen">
                  <svg class="w-5 h-5 text-[#0F3057]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button v-if="banners.banner1" @click="deleteBanner('banner1')" class="w-12 h-12 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Eliminar imagen">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Column 2: Cocteles & Especialidades -->
          <div class="flex flex-col space-y-6">

            <!-- Cocteles -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'cocteles'" v-model="menuData.cocteles.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.cocteles.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'cocteles' ? saveCategory('cocteles') : toggleEdit('cocteles')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'cocteles' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'cocteles'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>

              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.cocteles.items" :key="'coc-'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? `$${item.precio}` : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'cocteles'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('cocteles', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('cocteles', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

              <button v-if="editingCategory === 'cocteles'" @click="openAddItem('cocteles')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>

              <!-- Banner 2 -->
              <div class="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mt-10 group/banner">
                <input :id="'banner-input-banner2'" type="file" accept="image/*" class="hidden" @change="onBannerFileChange('banner2', $event)" />
                <div v-if="banners.banner2" class="w-full h-full">
                  <img :src="banners.banner2.startsWith('http') ? banners.banner2 : API + banners.banner2" class="w-full h-full object-cover" alt="Banner publicitario 2" />
                </div>
                <div v-else class="w-full h-full bg-slate-300 border-2 border-dashed border-slate-400 flex items-center justify-center shadow-inner">
                  <div class="flex flex-col items-center">
                  <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
                  <span class="text-slate-400 text-xs mt-1 font-medium">(Recomendado: 800x200 px)</span>
                </div>
                </div>
                <div v-if="isLoggedIn" class="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button @click="triggerBannerUpload('banner2')" class="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Subir imagen">
                    <svg class="w-5 h-5 text-[#0F3057]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button v-if="banners.banner2" @click="deleteBanner('banner2')" class="w-12 h-12 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Eliminar imagen">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Especialidades -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'especialidades'" v-model="menuData.especialidades.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.especialidades.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'especialidades' ? saveCategory('especialidades') : toggleEdit('especialidades')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'especialidades' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'especialidades'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>

              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.especialidades.items" :key="'esp-'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? `$${item.precio}` : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'especialidades'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('especialidades', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('especialidades', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

              <button v-if="editingCategory === 'especialidades'" @click="openAddItem('especialidades')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>

              <!-- Banner 3 -->
              <div class="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mt-10 group/banner">
                <input :id="'banner-input-banner3'" type="file" accept="image/*" class="hidden" @change="onBannerFileChange('banner3', $event)" />
                <div v-if="banners.banner3" class="w-full h-full">
                  <img :src="banners.banner3.startsWith('http') ? banners.banner3 : API + banners.banner3" class="w-full h-full object-cover" alt="Banner publicitario 3" />
                </div>
                <div v-else class="w-full h-full bg-slate-300 border-2 border-dashed border-slate-400 flex items-center justify-center shadow-inner">
                  <div class="flex flex-col items-center">
                  <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
                  <span class="text-slate-400 text-xs mt-1 font-medium">(Recomendado: 800x200 px)</span>
                </div>
                </div>
                <div v-if="isLoggedIn" class="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button @click="triggerBannerUpload('banner3')" class="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Subir imagen">
                    <svg class="w-5 h-5 text-[#0F3057]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button v-if="banners.banner3" @click="deleteBanner('banner3')" class="w-12 h-12 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Eliminar imagen">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <!-- ===== SEGUNDA PARTE DE LA CARTA ===== -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mt-8">
          <!-- Col 1 -->
          <div class="flex flex-col space-y-6">
            
            <!-- torres -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'torres'" v-model="menuData.torres.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.torres.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'torres' ? saveCategory('torres') : toggleEdit('torres')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'torres' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'torres'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.torres.items" :key="'tor'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'torres'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('torres', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('torres', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'torres'" @click="openAddItem('torres')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- camarones -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'camarones'" v-model="menuData.camarones.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.camarones.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'camarones' ? saveCategory('camarones') : toggleEdit('camarones')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'camarones' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'camarones'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.camarones.items" :key="'cam'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'camarones'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('camarones', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('camarones', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'camarones'" @click="openAddItem('camarones')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- caldos -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'caldos'" v-model="menuData.caldos.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.caldos.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'caldos' ? saveCategory('caldos') : toggleEdit('caldos')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'caldos' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'caldos'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.caldos.items" :key="'cal'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'caldos'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('caldos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('caldos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'caldos'" @click="openAddItem('caldos')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- Banner banner4 -->
            <div class="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mt-4 group/banner">
              <input :id="'banner-input-banner4'" type="file" accept="image/*" class="hidden" @change="onBannerFileChange('banner4', $event)" />
              <div v-if="banners.banner4" class="w-full h-full">
                <img :src="banners.banner4.startsWith('http') ? banners.banner4 : API + banners.banner4" class="w-full h-full object-cover" alt="Banner publicitario" />
              </div>
              <div v-else class="w-full h-full bg-slate-300 border-2 border-dashed border-slate-400 flex items-center justify-center shadow-inner">
                <div class="flex flex-col items-center">
                  <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
                  <span class="text-slate-400 text-xs mt-1 font-medium">(Recomendado: 800x200 px)</span>
                </div>
              </div>
              <div v-if="isLoggedIn" class="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button @click="triggerBannerUpload('banner4')" class="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Subir imagen">
                  <svg class="w-5 h-5 text-[#0F3057]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button v-if="banners.banner4" @click="deleteBanner('banner4')" class="w-12 h-12 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Eliminar imagen">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Col 2 -->
          <div class="flex flex-col space-y-6">
            
            <!-- filetes -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'filetes'" v-model="menuData.filetes.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.filetes.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'filetes' ? saveCategory('filetes') : toggleEdit('filetes')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'filetes' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'filetes'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.filetes.items" :key="'fil'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'filetes'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('filetes', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('filetes', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'filetes'" @click="openAddItem('filetes')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- tostadas -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'tostadas'" v-model="menuData.tostadas.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.tostadas.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'tostadas' ? saveCategory('tostadas') : toggleEdit('tostadas')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'tostadas' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'tostadas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.tostadas.items" :key="'tos'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'tostadas'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('tostadas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('tostadas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'tostadas'" @click="openAddItem('tostadas')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- cortes -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'cortes'" v-model="menuData.cortes.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.cortes.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'cortes' ? saveCategory('cortes') : toggleEdit('cortes')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'cortes' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'cortes'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.cortes.items" :key="'cor'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'cortes'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('cortes', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('cortes', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'cortes'" @click="openAddItem('cortes')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- marineritos -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'marineritos'" v-model="menuData.marineritos.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.marineritos.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'marineritos' ? saveCategory('marineritos') : toggleEdit('marineritos')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'marineritos' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'marineritos'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.marineritos.items" :key="'mar'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'marineritos'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('marineritos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('marineritos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'marineritos'" @click="openAddItem('marineritos')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- Banner banner5 -->
            <div class="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mt-4 group/banner">
              <input :id="'banner-input-banner5'" type="file" accept="image/*" class="hidden" @change="onBannerFileChange('banner5', $event)" />
              <div v-if="banners.banner5" class="w-full h-full">
                <img :src="banners.banner5.startsWith('http') ? banners.banner5 : API + banners.banner5" class="w-full h-full object-cover" alt="Banner publicitario" />
              </div>
              <div v-else class="w-full h-full bg-slate-300 border-2 border-dashed border-slate-400 flex items-center justify-center shadow-inner">
                <div class="flex flex-col items-center">
                  <span class="text-slate-500 font-bold uppercase tracking-widest text-sm md:text-base">Espacio Publicitario</span>
                  <span class="text-slate-400 text-xs mt-1 font-medium">(Recomendado: 800x200 px)</span>
                </div>
              </div>
              <div v-if="isLoggedIn" class="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button @click="triggerBannerUpload('banner5')" class="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Subir imagen">
                  <svg class="w-5 h-5 text-[#0F3057]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button v-if="banners.banner5" @click="deleteBanner('banner5')" class="w-12 h-12 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110" title="Eliminar imagen">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== SECCION BEBIDAS ===== -->
        <div class="text-center mb-12 mt-28">
          <h2 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white italic tracking-wide" style="font-family: 'Brush Script MT', cursive, sans-serif;">Menú</h2>
          <p class="text-2xl text-slate-800 font-medium italic mt-2" style="font-family: 'Brush Script MT', cursive, sans-serif;">Bebidas & Postres</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          <!-- Columna 1 -->
          <div class="flex flex-col space-y-6">
            
            <!-- cerveza -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'cerveza'" v-model="menuData.cerveza.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.cerveza.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'cerveza' ? saveCategory('cerveza') : toggleEdit('cerveza')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'cerveza' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'cerveza'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.cerveza.items" :key="'cer'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'cerveza'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('cerveza', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('cerveza', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'cerveza'" @click="openAddItem('cerveza')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- refrescos -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'refrescos'" v-model="menuData.refrescos.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.refrescos.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'refrescos' ? saveCategory('refrescos') : toggleEdit('refrescos')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'refrescos' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'refrescos'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.refrescos.items" :key="'ref'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'refrescos'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('refrescos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('refrescos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'refrescos'" @click="openAddItem('refrescos')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- sinalcohol -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'sinalcohol'" v-model="menuData.sinalcohol.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.sinalcohol.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'sinalcohol' ? saveCategory('sinalcohol') : toggleEdit('sinalcohol')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'sinalcohol' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'sinalcohol'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.sinalcohol.items" :key="'sin'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'sinalcohol'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('sinalcohol', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('sinalcohol', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'sinalcohol'" @click="openAddItem('sinalcohol')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- mezcales -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'mezcales'" v-model="menuData.mezcales.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.mezcales.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'mezcales' ? saveCategory('mezcales') : toggleEdit('mezcales')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'mezcales' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'mezcales'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.mezcales.items" :key="'mez'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'mezcales'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('mezcales', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('mezcales', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'mezcales'" @click="openAddItem('mezcales')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- ron -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'ron'" v-model="menuData.ron.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.ron.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'ron' ? saveCategory('ron') : toggleEdit('ron')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'ron' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'ron'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.ron.items" :key="'ron'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'ron'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('ron', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('ron', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'ron'" @click="openAddItem('ron')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- brandy -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'brandy'" v-model="menuData.brandy.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.brandy.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'brandy' ? saveCategory('brandy') : toggleEdit('brandy')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'brandy' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'brandy'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.brandy.items" :key="'bra'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'brandy'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('brandy', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('brandy', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'brandy'" @click="openAddItem('brandy')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

          </div>
          <!-- Columna 2 -->
          <div class="flex flex-col space-y-6">
            
            <!-- bebidas -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'bebidas'" v-model="menuData.bebidas.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.bebidas.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'bebidas' ? saveCategory('bebidas') : toggleEdit('bebidas')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'bebidas' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'bebidas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.bebidas.items" :key="'beb'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'bebidas'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('bebidas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('bebidas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'bebidas'" @click="openAddItem('bebidas')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- tequilas -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'tequilas'" v-model="menuData.tequilas.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.tequilas.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'tequilas' ? saveCategory('tequilas') : toggleEdit('tequilas')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'tequilas' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'tequilas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.tequilas.items" :key="'teq'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'tequilas'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('tequilas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('tequilas', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'tequilas'" @click="openAddItem('tequilas')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- whisky -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'whisky'" v-model="menuData.whisky.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.whisky.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'whisky' ? saveCategory('whisky') : toggleEdit('whisky')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'whisky' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'whisky'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.whisky.items" :key="'whi'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'whisky'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('whisky', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('whisky', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'whisky'" @click="openAddItem('whisky')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

          </div>
          <!-- Columna 3 -->
          <div class="flex flex-col space-y-6">
            
            <!-- vodka -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'vodka'" v-model="menuData.vodka.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.vodka.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'vodka' ? saveCategory('vodka') : toggleEdit('vodka')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'vodka' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'vodka'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.vodka.items" :key="'vod'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'vodka'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('vodka', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('vodka', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'vodka'" @click="openAddItem('vodka')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- vinos -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'vinos'" v-model="menuData.vinos.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.vinos.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'vinos' ? saveCategory('vinos') : toggleEdit('vinos')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'vinos' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'vinos'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.vinos.items" :key="'vin'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'vinos'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('vinos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('vinos', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'vinos'" @click="openAddItem('vinos')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

            
            <!-- cocteleria -->
            <div>
              <div class="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <input v-if="editingCategory === 'cocteleria'" v-model="menuData.cocteleria.title"
                  class="text-4xl font-black text-[#E65100] uppercase tracking-wider bg-transparent border-b-2 border-[#E65100] outline-none w-full drop-shadow-md" />
                <h3 v-else class="text-4xl font-black text-[#E65100] uppercase tracking-wider drop-shadow-md [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                  {{ menuData.cocteleria.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'cocteleria' ? saveCategory('cocteleria') : toggleEdit('cocteleria')"
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'cocteleria' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'cocteleria'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-0">
                <li v-for="(item, index) in menuData.cocteleria.items" :key="'coc'+index" class="flex flex-col">
                  <div class="flex justify-between items-center border-b border-white/20 pb-1 gap-2">
                    <div class="text-white font-semibold text-lg md:text-xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-xs font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-bold text-lg md:text-xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'cocteleria'" class="flex items-center gap-1 shrink-0">
                      <button @click="openEditItem('cocteleria', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-blue-400/60 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('cocteleria', index)" class="w-6 h-6 rounded flex items-center justify-center bg-white/20 hover:bg-red-500/70 text-white transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'cocteleria'" @click="openAddItem('cocteleria')"
                class="mt-4 w-full border-2 border-dashed border-white/40 rounded-xl py-2 text-white/70 hover:text-white hover:border-white/70 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar platillo
              </button>
            </div>

                        <!-- postres -->
            <div class="bg-[#E65100] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
              <!-- Decoración interna -->
              <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 pointer-events-none"></div>
              <div class="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-white opacity-5 pointer-events-none"></div>
              
              <div class="flex items-center gap-3 mb-4 justify-center relative z-10">
                <input v-if="editingCategory === 'postres'" v-model="menuData.postres.title"
                  class="text-3xl md:text-5xl font-black text-white uppercase tracking-wider bg-transparent border-b-2 border-white/50 outline-none w-full text-center placeholder-white/50" />
                <h3 v-else class="text-3xl md:text-5xl font-black text-white uppercase tracking-wider text-center drop-shadow-md">
                  {{ menuData.postres.title }}
                </h3>
                <button v-if="isLoggedIn" @click="editingCategory === 'postres' ? saveCategory('postres') : toggleEdit('postres')"
                  class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  :class="editingCategory === 'postres' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/40'">
                  <svg v-if="editingCategory !== 'postres'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
              </div>
              <ul class="space-y-1 relative z-10">
                <li v-for="(item, index) in menuData.postres.items" :key="'pos'+index" class="flex flex-col group/item">
                  <div class="flex justify-between items-center border-b border-white/20 pb-2 gap-4 transition-colors group-hover/item:border-white/40">
                    <div class="text-white font-bold text-xl md:text-2xl font-sans tracking-tight flex-1">
                      {{ formatName(item) }}
                      <span v-if="item.variacion" class="text-sm font-normal text-white/80 block -mt-1">({{ item.variacion.toUpperCase() }})</span>
                    </div>
                    <div class="text-white font-black text-2xl md:text-3xl font-sans shrink-0">
                      {{ typeof item.precio === 'number' ? '$' + item.precio : item.precio }}
                    </div>
                    <div v-if="editingCategory === 'postres'" class="flex items-center gap-2 shrink-0">
                      <button @click="openEditItem('postres', index)" class="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-blue-400 text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button @click="deleteItem('postres', index)" class="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-red-500 text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button v-if="editingCategory === 'postres'" @click="openAddItem('postres')"
                class="mt-6 w-full border-2 border-dashed border-white/50 rounded-xl py-3 text-white hover:bg-white/10 transition-colors text-base font-bold flex items-center justify-center gap-2 relative z-10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Agregar Postre
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Item Edit Modal -->
    <div v-if="showItemModal" class="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-[#0F3057]/80 backdrop-blur-sm" @click="showItemModal = false"></div>
      <div class="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-[#38B6FF] to-[#00587A] px-8 py-5 flex items-center justify-between">
          <h3 class="text-xl font-black text-white uppercase tracking-wide">
            {{ itemModalIndex === null ? 'Agregar Platillo' : 'Editar Platillo' }}
          </h3>
          <button @click="showItemModal = false" class="text-white/70 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <!-- Form -->
        <div class="p-8">
          <form @submit.prevent="saveItemModal" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Nombre <span class="text-red-500">*</span></label>
              <input v-model="itemForm.nombre" type="text" required
                class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 transition-colors outline-none"
                placeholder="Ej: Ceviche de Camarón" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Porción <span class="text-slate-400 font-normal">(opcional)</span></label>
              <input v-model="itemForm.porcion" type="text"
                class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 transition-colors outline-none"
                placeholder="Ej: Orden, 1 Lt, Chico..." />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Variación <span class="text-slate-400 font-normal">(opcional)</span></label>
              <input v-model="itemForm.variacion" type="text"
                class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 transition-colors outline-none"
                placeholder="Ej: Verde, Negro, Rojo..." />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1">Precio <span class="text-red-500">*</span></label>
              <input v-model="itemForm.precio" required
                class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 transition-colors outline-none"
                placeholder="Ej: 150 o Variable" />
            </div>
            <button type="submit"
              class="w-full bg-[#0F3057] hover:bg-[#0a2040] text-white font-bold py-4 rounded-xl transition-colors shadow-lg mt-2 flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Guardar Platillo
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <section id="contacto" class="py-24 bg-white relative flex flex-col items-center">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        <h2 class="text-5xl font-black text-slate-900 tracking-tight mb-4">Contáctanos</h2>
        <p class="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">Reserva tu mesa o haznos un pedido especial. ¡Te esperamos!</p>
        
        <!-- Main WhatsApp CTA -->
        <a href="https://wa.me/5213511092057" target="_blank" rel="noopener noreferrer" 
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
          <a href="https://www.instagram.com/elmarinero.loco?utm_source=qr" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
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
          <a href="https://www.facebook.com/share/1ER3v8Kv1K/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 mb-4 text-slate-800 group-hover:text-[#1877F2] transition-colors">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <span class="text-slate-600 font-medium group-hover:text-slate-900">Facebook</span>
          </a>

          <!-- Google Maps -->
          <a href="https://maps.app.goo.gl/CLKYXygMrEUdfzdS7?g_st=ic" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 mb-4 text-slate-800 group-hover:text-[#EA4335] transition-colors">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <span class="text-slate-600 font-medium group-hover:text-slate-900">Google Maps</span>
          </a>

          <!-- Email -->
          <!-- TikTok -->
          <a href="https://www.tiktok.com/@elmarineroloco?_r=1&_t=ZS-96y18ECYJ5Y" target="_blank" rel="noopener noreferrer" class="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300">
            <div class="w-16 h-16 mb-4 text-slate-800 group-hover:text-[#010101] transition-colors">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.16 8.16 0 0 0 4.77 1.52V7.01a4.85 4.85 0 0 1-1-.32z"/>
              </svg>
            </div>
            <span class="text-slate-600 font-medium group-hover:text-slate-900">TikTok</span>
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

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#0F3057]/80 backdrop-blur-sm" @click="showLoginModal = false"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-visible mt-12">
        <!-- Shield/Badge Header -->
        <div class="bg-gradient-to-b from-[#38B6FF] to-[#00587A] pt-14 pb-6 px-8 relative flex flex-col items-center rounded-t-3xl">
          <button @click="showLoginModal = false" class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div class="absolute -top-12 bg-white p-2 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-slate-100">
            <div class="w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img src="/images/logo.png" alt="El Marinero Loco Logo" class="w-full h-full object-cover" />
            </div>
          </div>
          
          <h3 class="text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">Acceso</h3>
        </div>
        
        <!-- Form -->
        <div class="p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
              <input v-model="loginEmail" type="email" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 transition-colors outline-none" placeholder="correo@elmarineroloco.com" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
              <input v-model="loginPassword" type="password" class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 transition-colors outline-none" placeholder="••••••••" required />
            </div>

            <!-- Error message -->
            <p v-if="loginError" class="text-red-500 text-sm text-center font-medium -mt-2">{{ loginError }}</p>
            
            <button type="submit" :disabled="loginLoading" class="w-full bg-[#E65100] hover:bg-[#cc4800] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#E65100]/30 uppercase tracking-widest mt-4">
              {{ loginLoading ? 'Verificando...' : 'Iniciar Sesión' }}
            </button>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    bottom: -5%;
    transform: translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  50% {
    transform: translateX(20px);
  }
  90% {
    opacity: 0.6;
  }
  100% {
    bottom: 105%;
    transform: translateX(-20px);
    opacity: 0;
  }
}

.bubble {
  animation: float linear infinite;
}
</style>
