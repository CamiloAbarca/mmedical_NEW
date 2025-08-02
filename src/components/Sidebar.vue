<template>
  <b-sidebar :visible="isOpen" @hidden="emitClose" shadow>
    <div class="p-2">
      <b-nav vertical>
        <b-nav-item to="/dashboard">Dashboard</b-nav-item>
        <b-nav-item to="/equipos">Equipos</b-nav-item>
        <b-nav-item to="/clientes">Clientes</b-nav-item>
        <b-button variant="danger" block @click="logout">Cerrar Sesión</b-button>
      </b-nav>
    </div><template>
  <b-sidebar :visible="isOpen" @hidden="emitClose" shadow right bg-variant="dark" class="custom-sidebar">
    <div class="p-3 text-white h-100 d-flex flex-column justify-content-between">
      <div>
        <h4 class="text-center mb-4">Menú</h4>
        <b-nav vertical>
          <b-nav-item
            to="/dashboard"
            class="custom-link"
          >Dashboard</b-nav-item>
          <b-nav-item
            to="/equipos"
            class="custom-link"
          >Equipos</b-nav-item>
          <b-nav-item
            to="/clientes"
            class="custom-link"
          >Clientes</b-nav-item>
        </b-nav>
      </div>

      <div>
        <b-button
          variant="danger"
          block
          class="logout-btn"
          @click="logout"
        >
          Cerrar Sesión
        </b-button>
      </div>
    </div>
  </b-sidebar>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: ['isOpen'],
  methods: {
    emitClose() {
      this.$emit('update:isOpen', false)
    },
    logout() {
      localStorage.removeItem('auth')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.custom-sidebar {
  background: linear-gradient(180deg, #556270, #4ecdc4);
  width: 250px;
  border-right: 2px solid #c7f464;
  transition: all 0.3s ease;
}

.custom-link {
  color: white !important;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.4rem;
  transition: background-color 0.3s ease;
}

.custom-link:hover,
.custom-link.router-link-exact-active {
  background-color: #c7f464;
  color: #556270 !important;
  font-weight: bold;
}

.logout-btn {
  background-color: #ff6b6b;
  border: none;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c44d58;
}
</style>

  </b-sidebar>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: ['isOpen'],
  methods: {
    emitClose() {
      this.$emit('update:isOpen', false)
    },
    logout() {
      localStorage.removeItem('auth')
      this.$router.push('/login')
    }
  }
}
</script>
