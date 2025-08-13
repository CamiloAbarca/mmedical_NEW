<template>
  <b-nav vertical class="custom-sidebar p-3">
    <b-nav-item to="/dashboard" class="nav-link-custom">
      <b-icon icon="speedometer" class="me-2 iconos" />
      <transition name="fade">
        <span v-if="!collapsed"> Dashboard</span>
      </transition>
    </b-nav-item>

    <b-nav-item to="/equipos" class="nav-link-custom">
      <b-icon icon="cpu" class="me-2 iconos" />
      <transition name="fade">
        <span v-if="!collapsed"> Equipos</span>
      </transition>
    </b-nav-item>

    <b-nav-item to="/clientes" class="nav-link-custom">
      <b-icon icon="people-fill" class="me-2 iconos" />
      <transition name="fade">
        <span v-if="!collapsed"> Clientes</span>
      </transition>
    </b-nav-item>

    <b-nav-item to="/usuarios" class="nav-link-custom">
      <b-icon icon="person-lines-fill" class="me-2 iconos" />
      <transition name="fade">
        <span v-if="!collapsed"> Usuarios</span>
      </transition>
    </b-nav-item>
  </b-nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AppSidebar',
  props: {
    collapsed: Boolean,
    isMobile: Boolean
  },
  computed: {
    ...mapGetters(['obtenerUsuario']),
  },
  methods: {
    // La lógica de logout ya no es necesaria aquí.
  }
}
</script>

<style scoped>
.custom-sidebar {
  background-color: #888a8d;
  height: 100%;
  min-height: 100vh;
  transition: all 0.3s ease;
  padding-top: 1.5rem;
}

.nav-link-custom b-icon,
.logout-btn b-icon {
  color: #c7f464 !important;
  /* Cambiado a tu color de éxito */
}

.iconos {
  color: #2a2a2a !important;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}


.nav-link-custom {
  color: white !important;
  padding: 0.50rem 0.1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.nav-link-custom span {
  color: #2a2a2a !important;
  font-weight: 500;
}

.nav-link-custom:hover {
  background-color: #757678;
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

.user-dropdown .btn-primary {
  background-color: #4ecdc4;
  border-color: #4ecdc4;
  color: white !important;
  text-align: left;
}

.user-dropdown .btn-primary:hover {
  background-color: #3b9f98;
  border-color: #3b9f98;
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