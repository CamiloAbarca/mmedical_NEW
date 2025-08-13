<template>
    <div class="d-flex flex-column vh-100">
        <b-navbar type="dark" class="px-3 custom-navbar">
            <b-button variant="light" class="me-2 d-md-none" @click="mobileSidebar = true">
                ☰
            </b-button>

            <b-navbar-brand href="#">
                <img src="@/assets/logo.png" alt="Mmedical Logo" class="d-none d-sm-inline-block align-top"
                    style="height: 40px;" />
                <img src="@/assets/logo-icon.png" alt="M" class="d-inline-block d-sm-none align-top"
                    style="height: 32px;" />
            </b-navbar-brand>

            <b-button variant="light" class="me-2 d-none d-md-inline-block" @click="collapsed = !collapsed">
                <b-icon :icon="collapsed ? 'chevron-double-right' : 'chevron-double-left'" />
            </b-button>
        </b-navbar>

        <div class="d-flex flex-grow-1 overflow-hidden">
            <div :class="[
                'bg-light border-end d-none d-md-block',
                collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
            ]">
                <AppSidebar :collapsed="collapsed" />
            </div>

            <b-sidebar v-model="mobileSidebar" title="Menú" shadow class="d-md-none">
                <AppSidebar isMobile @close="mobileSidebar = false" />
            </b-sidebar>

            <div class="flex-grow-1 overflow-auto p-3">
                <router-view />
            </div>
        </div>

        <ChangePasswordModal />
    </div>
</template>

<script>
import AppSidebar from './AppSidebar.vue';
import ChangePasswordModal from './Usuarios/ChangePasswordModal.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'DashboardLayout',
    components: { AppSidebar, ChangePasswordModal },
    data() {
        return {
            mobileSidebar: false,
            collapsed: false,
        };
    },
    computed: {
        ...mapGetters(['obtenerUsuario']),
    },
    created() {
        // Restaurar el estado del usuario desde localStorage al cargar el componente
        const user = localStorage.getItem('user');
        if (user) {
            try {
                this.SET_USER(JSON.parse(user));
            } catch (e) {
                console.error("Error al parsear el usuario de localStorage:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    },
    methods: {
        ...mapMutations(['SET_USER']),
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.SET_USER(null);

            this.$bvToast.toast('Sesión cerrada correctamente.', {
                title: 'Logout',
                variant: 'info',
                solid: true,
                autoHideDelay: 2500
            });

            this.$router.push('/login');
            if (this.isMobile) this.$emit('close');
        }
    },
    watch: {
        $route() {
            this.mobileSidebar = false;
        },
    },
};
</script>

<style scoped>
/* Estilos específicos para este layout */
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