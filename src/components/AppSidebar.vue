<template>
  <b-nav vertical class="custom-sidebar p-3">
    <!-- Dashboard -->
    <b-nav-item to="/dashboard" class="nav-link-custom">
      <b-icon icon="speedometer" class="me-2" />
      <transition name="fade">
        <span v-if="!collapsed"> Dashboard</span>
      </transition>
    </b-nav-item>

    <!-- Equipos -->
    <b-nav-item to="/equipos" class="nav-link-custom">
      <b-icon icon="cpu" class="me-2" />
      <transition name="fade">
        <span v-if="!collapsed"> Equipos</span>
      </transition>
    </b-nav-item>

    <!-- Clientes -->
    <b-nav-item to="/clientes" class="nav-link-custom">
      <b-icon icon="people-fill" class="me-2" />
      <transition name="fade">
        <span v-if="!collapsed"> Clientes</span>
      </transition>
    </b-nav-item>

    <!-- Cerrar sesión -->
    <b-button variant="danger" class="logout-btn mt-4" block @click="logout">
      <b-icon icon="box-arrow-right" />
      <transition name="fade">
        <span v-if="!collapsed" class="ms-2">Cerrar Sesión</span>
      </transition>
    </b-button>
  </b-nav>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    collapsed: Boolean,
    isMobile: Boolean
  },
  methods: {
    logout() {
      localStorage.removeItem('auth')
      this.$router.push('/login')
      if (this.isMobile) this.$emit('close')
    }
  }
}
</script>

<style scoped>
.custom-sidebar {
  background-color: #556270;
  height: 100%;
  min-height: 100vh;
  transition: all 0.3s ease;
  padding-top: 1.5rem;
}

.nav-link-custom b-icon,
.logout-btn b-icon {
  color: #c7f434 !important;
}


.nav-link-custom {
  color: white !important;
  padding: 0.20rem 0.1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.nav-link-custom span {
  color: white !important;
}

.nav-link-custom:hover {
  background-color: #c7f464;
  color: #556270 !important;
  transform: translateX(5px);
}

.logout-btn {
  background-color: #ff6b6b !important;
  border: none;
  transition: background 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn span {
  color: white !important;
}

.logout-btn:hover {
  background-color: #c44d58 !important;
  transform: scale(1.05);
}

/* Text transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
