<template>
  <div :class="['sidebar-modern', { 'collapsed-sidebar': collapsed }]">
    <!-- Logo -->
    <div class="sidebar-logo">
      <img src="@/assets/logo-icon.png" alt="M" style="height: 32px;" />
      <transition name="fade">
        <span v-if="!collapsed">Control de Equipos</span>
      </transition>
    </div>

    <!-- Menú -->
    <b-nav vertical class="flex-grow-1 px-2">
      <b-nav-item to="/dashboard" class="sidebar-item">
        <b-icon icon="speedometer" class="iconos" />
        <transition name="fade">
          <span v-if="!collapsed" class="iconos"> Dashboard</span>
        </transition>
      </b-nav-item>

      <b-nav-item to="/equipos" class="sidebar-item">
        <b-icon icon="cpu" class="iconos"/>
        <transition name="fade">
          <span v-if="!collapsed" class="iconos"> Equipos</span>
        </transition>
      </b-nav-item>

      <b-nav-item to="/clientes" class="sidebar-item">
        <b-icon icon="people-fill" class="iconos"/>
        <transition name="fade">
          <span v-if="!collapsed" class="iconos"> Clientes</span>
        </transition>
      </b-nav-item>

      <b-nav-item to="/usuarios" class="sidebar-item">
        <b-icon icon="person-lines-fill" class="iconos"/>
        <transition name="fade">
          <span v-if="!collapsed" class="iconos"> Usuarios</span>
        </transition>
      </b-nav-item>
    </b-nav>

    <!-- Usuario -->
    <div class="sidebar-user">
      <b-icon icon="person-circle" font-scale="1.5" class="iconos"/>
      <transition name="fade">
        <div v-if="!collapsed" class="user-info">
          <strong>{{ obtenerUsuario?.nombre || 'Usuario' }}</strong>
          <small>Cuenta Free</small>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppSidebar',
  props: {
    collapsed: Boolean,
    isMobile: Boolean
  },
  computed: {
    ...mapGetters(['obtenerUsuario'])
  }
}
</script>

<style scoped>
.sidebar-modern {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 240px;
  transition: width 0.3s ease, padding 0.3s ease;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.collapsed-sidebar {
  width: 80px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #111827;
}

.sidebar-item {
  display: flex !important;
  /* forzamos flex */
  flex-direction: column !important;
  /* icono arriba, texto abajo */
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.8rem 0.9rem;
  color: #dc2626 !important;
  /* Rojo base */
  border-radius: 8px;
  text-align: center;
  /* centra el texto */
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.sidebar-item span {
  display: block;
  font-size: 0.85rem;
}

.sidebar-item:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444 !important;
  transform: translateY(-2px);
}

.sidebar-item b-icon {
  font-size: 1.4rem;
  transition: color 0.25s ease;
  color: #dc2626;
}

.sidebar-item:hover b-icon {
  color: #3b453f;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
}

.iconos {
  color: #667385 !important;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-user b-icon {
  color: #dc2626;
}

.user-info {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

.user-info small {
  color: #0f53c954;
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
