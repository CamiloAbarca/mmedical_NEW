<template>
    <div>
        <h3 class="text-primary mb-3">Usuarios</h3>

        <b-skeleton-table v-if="cargandoUsuarios" :rows="5" :columns="fields.length" animation="wave" class="mb-3" />

        <b-table v-else :items="paginatedUsuarios" :fields="fields" responsive striped hover small>
            <template #cell(acciones)="row">
                <b-button size="sm" :title="'Editar usuario ' + row.item.id" class="btn-icono me-2" disabled>
                    <b-icon icon="pencil" font-scale="1" />
                </b-button>
                <b-button size="sm" :title="'Eliminar usuario ' + row.item.id" class="btn-icono" disabled>
                    <b-icon icon="trash" font-scale="1" />
                </b-button>
            </template>
        </b-table>

        <b-pagination v-if="!cargandoUsuarios" v-model="paginaActual" :total-rows="usuarios.length"
            :per-page="porPagina" align="center" class="mt-3" pills variant="primary" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'TablaUsuarios',
    data() {
        return {
            cargandoUsuarios: true,
            paginaActual: 1,
            porPagina: 15,
            fields: [
                { key: 'id', label: 'ID', sortable: true },
                { key: 'nombre', label: 'Nombre', sortable: true },
                { key: 'apellido', label: 'Apellido', sortable: true },
                { key: 'rut', label: 'RUT', sortable: true },
                { key: 'email', label: 'Email', sortable: true },
                { key: 'tipo', label: 'Tipo', sortable: true },
                { key: 'acciones', label: 'Acciones' }
            ],
        };
    },
    computed: {
        ...mapGetters(['obtenerUsuarios']),
        usuarios() {
            return this.obtenerUsuarios;
        },
        paginatedUsuarios() {
            const start = (this.paginaActual - 1) * this.porPagina;
            return this.usuarios.slice(start, start + this.porPagina);
        },
    },
    methods: {
        ...mapActions(['cargarUsuarios']),
        async cargarDatos() {
            this.cargandoUsuarios = true;
            await this.cargarUsuarios();
            this.cargandoUsuarios = false;
        },
    },
    created() {
        this.cargarDatos();
    }
};
</script>