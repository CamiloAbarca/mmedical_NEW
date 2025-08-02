<template>
  <div id="app" class="d-flex flex-column vh-100">
    <!-- Navbar (oculto en /login) -->
    <b-navbar v-if="showSidebar" type="dark" class="px-3 custom-navbar">

      <!-- Botón para abrir sidebar en móvil -->
      <b-button variant="light" class="me-2 d-md-none" @click="mobileSidebar = true">
        ☰
      </b-button>

      <b-navbar-brand href="#">
        <img src="@/assets/logo.png" alt="Mmedical Logo" class="d-none d-sm-inline-block align-top"
          style="height: 40px;" />
        <img src="@/assets/logo-icon.png" alt="M" class="d-inline-block d-sm-none align-top" style="height: 32px;" />
      </b-navbar-brand>

      <!-- Botón para colapsar sidebar en desktop -->
      <b-button variant="light" class="me-2 d-none d-md-inline-block" v-if="showSidebar"
        @click="collapsed = !collapsed">
        <b-icon :icon="collapsed ? 'chevron-double-right' : 'chevron-double-left'" />
      </b-button>

    </b-navbar>

    <!-- Layout -->
    <div class="d-flex flex-grow-1 overflow-hidden">
      <!-- Sidebar (Desktop) -->
      <div v-if="showSidebar" :class="[
        'bg-light border-end d-none d-md-block',
        collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      ]">
        <AppSidebar :collapsed="collapsed" />
      </div>

      <!-- Sidebar (Mobile) -->
      <b-sidebar v-model="mobileSidebar" title="Menú" shadow class="d-md-none">
        <AppSidebar isMobile @close="mobileSidebar = false" />
      </b-sidebar>

      <!-- Main content -->
      <div class="flex-grow-1 overflow-auto p-3">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from './components/AppSidebar.vue'

export default {
  components: { AppSidebar },
  data() {
    return {
      mobileSidebar: false,
      collapsed: false
    }
  },
  computed: {
    showSidebar() {
      return this.$route.path !== '/login'
    }
  },
  watch: {
    $route() {
      this.mobileSidebar = false
    }
  }
}
</script>

<style>
.sidebar-expanded {
  width: 250px;
  min-width: 250px;
  transition: width 0.3s;
}

.sidebar-collapsed {
  width: 80px;
  min-width: 80px;
  transition: width 0.3s;
}

.custom-navbar {
  background-color: #556270;
  color: #ffffff;
}

.custom-navbar .navbar-brand,
.custom-navbar .navbar-nav .nav-link {
  color: #ffffff !important;
}
</style>
