<template>
    <div class="d-flex flex-column vh-100">
        <b-navbar type="dark" class="px-3 custom-navbar">
            <b-button variant="light" class="me-2 d-md-none" @click="mobileSidebar = true">
                ☰
            </b-button>
            <b-button variant="light" class="d-none d-md-inline-block" @click="collapsed = !collapsed"
                style="margin-right: 10px;">
                <b-icon :icon="collapsed ? 'chevron-double-right' : 'chevron-double-left'" />
            </b-button>

            <b-navbar-brand href="#">
                <img src="@/assets/logo.png" alt="Mmedical Logo" class="d-none d-sm-inline-block align-top"
                    style="height: 40px;" />
                <img src="@/assets/logo-icon.png" alt="M" class="d-inline-block d-sm-none align-top"
                    style="height: 32px;" />
            </b-navbar-brand>

            <b-navbar-nav class="ml-auto" v-if="obtenerUsuario">
                <b-dropdown dropdown variant="dark" class="user-dropdown mt-1" right>
                    <template #button-content>
                        <b-icon icon="person-fill" class="me-2" />
                        <span> {{ obtenerUsuario.nombre }}</span>
                    </template>
                    <b-dropdown-item @click="$bvModal.show('modal-change-password')">
                        Cambiar Contraseña
                    </b-dropdown-item>
                </b-dropdown>
                <b-button variant="danger" class="logout-btn mt-1 ml-3" @click="logout">
                    <b-icon icon="box-arrow-right" class="me-2" />
                </b-button>
            </b-navbar-nav>

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
import { mapGetters, mapMutations, mapActions } from 'vuex';

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
    async created() {
        const user = sessionStorage.getItem('user');
        if (user) {
            try {
                this.SET_USER(JSON.parse(user));
                await this.cargarEquipos();
            } catch (e) {
                console.error("Error al parsear el usuario de sessionStorage:", e);
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token');
            }
        }
    },
    methods: {
        ...mapMutations(['SET_USER']),
        ...mapActions(['cargarEquipos']),
        logout() {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
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
    background-color: rgba(0, 0, 0, 0.59);
    color: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    height: 50px;
}

.custom-navbar .navbar-brand,
.custom-navbar .navbar-nav .nav-link {
    color: #ffffff !important;
}

.logout-btn {
    background-color: #ff6b6b !important;
    border-color: #ff6b6b !important;
    color: #ffffff !important;
}
</style>