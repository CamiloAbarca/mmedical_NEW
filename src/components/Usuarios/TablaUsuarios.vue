<template>
    <div>
        <h3 class="text-primary mb-3">Usuarios</h3>

        <b-skeleton-table v-if="cargandoUsuarios" :rows="5" :columns="fields.length" animation="wave" class="mb-3" />

        <b-table v-else :items="paginatedUsuarios" :fields="fields" responsive striped hover small>
            <template #cell(acciones)="row">
                <b-button size="sm" :title="'Editar usuario ' + row.item.id" class="btn-icono me-2"
                    @click="abrirModalEditar(row.item)"
                    style="background-color: #c7f464; border-color: #c7f464; color: #333; margin-right: 8px;">
                    <b-icon icon="pencil" font-scale="1" />
                </b-button>
                <b-button size="sm" :title="'Eliminar usuario ' + row.item.id" class="btn-icono"
                    @click="abrirModalEliminar(row.item)" style="background-color: #ff6b6b; border-color: #ff6b6b">
                    <b-icon icon="trash" font-scale="1" />
                </b-button>
            </template>
        </b-table>

        <b-pagination v-if="!cargandoUsuarios" v-model="paginaActual" :total-rows="usuarios.length"
            :per-page="porPagina" align="center" class="mt-3" pills variant="primary" />

        <b-modal id="modal-editar-usuario" v-model="mostrarModalEditar" title="Editar Usuario" @hide="resetFormulario"
            hide-footer centered size="md" :header-style="{ backgroundColor: '#556270', color: 'white' }">
            <b-form @submit.prevent="editarUsuario">
                <b-form-group label="Nombre" label-for="edit-nombre">
                    <b-form-input id="edit-nombre" v-model.trim="editableUsuario.nombre" required />
                </b-form-group>
                <b-form-group label="Apellido" label-for="edit-apellido">
                    <b-form-input id="edit-apellido" v-model.trim="editableUsuario.apellido" required />
                </b-form-group>
                <b-form-group label="RUT" label-for="edit-rut">
                    <b-form-input id="edit-rut" v-model.trim="editableUsuario.rut" required />
                </b-form-group>
                <b-form-group label="Email" label-for="edit-email">
                    <b-form-input id="edit-email" type="email" v-model.trim="editableUsuario.email" required />
                </b-form-group>
                <b-form-group label="Tipo de Usuario" label-for="edit-tipo">
                    <b-form-select id="edit-tipo" v-model="editableUsuario.tipo" required>
                        <option value="super">Super Admin</option>
                        <option value="usuario">Usuario</option>
                        <option value="revisor">Revisor</option>
                    </b-form-select>
                </b-form-group>
                <div class="text-end mt-3">
                    <b-button variant="success" type="submit" class="me-2" style="background-color: #c7f464; border-color: #c7f464; color: #333; margin-right: 8px;">Guardar cambios</b-button>
                    <b-button variant="danger" @click="cerrarModalEditar" style="background-color: #ff6b6b; border-color: #ff6b6b">Cancelar</b-button>
                </div>
            </b-form>
        </b-modal>

        <b-modal id="modal-eliminar-usuario" ref="modal-eliminar-usuario" title="Confirmar Eliminación" hide-footer
            centered>
            <div class="d-flex align-items-center">
                <b-icon icon="exclamation-triangle-fill" variant="danger" font-scale="2" class="me-3" />
                <div>
                    <div class="font-weight-bold mb-2 text-danger">¿Estás seguro de que deseas eliminar este usuario?
                    </div>
                    <div class="small text-muted">Esta acción no se puede deshacer.</div>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <b-button variant="secondary" class="me-2" @click="cerrarModalEliminar" style="margin-right: 8px;">Cancelar</b-button>
                <b-button variant="danger" @click="confirmarEliminarUsuario">Eliminar</b-button>
            </div>
        </b-modal>
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
            mostrarModalEditar: false,
            editableUsuario: {},
            usuarioAEliminar: null,
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
        ...mapActions(['cargarUsuarios', 'actualizarUsuario', 'eliminarUsuario']),
        async cargarDatos() {
            this.cargandoUsuarios = true;
            await this.cargarUsuarios();
            this.cargandoUsuarios = false;
        },
        abrirModalEditar(usuario) {
            this.editableUsuario = { ...usuario };
            this.mostrarModalEditar = true;
        },
        cerrarModalEditar() {
            this.mostrarModalEditar = false;
            this.resetFormulario();
        },
        resetFormulario() {
            this.editableUsuario = {};
        },
        async editarUsuario() {
            try {
                await this.actualizarUsuario(this.editableUsuario);
                this.$bvToast.toast('Usuario actualizado correctamente.', {
                    title: 'Éxito',
                    variant: 'success',
                    solid: true
                });
                this.cerrarModalEditar();
                await this.cargarUsuarios(); // Recarga los datos para reflejar los cambios
            } catch (error) {
                this.$bvToast.toast('Error al actualizar el usuario.', {
                    title: 'Error',
                    variant: 'danger',
                    solid: true
                });
            }
        },
        abrirModalEliminar(usuario) {
            this.usuarioAEliminar = usuario;
            this.$refs['modal-eliminar-usuario'].show();
        },
        cerrarModalEliminar() {
            this.usuarioAEliminar = null;
            this.$refs['modal-eliminar-usuario'].hide();
        },
        async confirmarEliminarUsuario() {
            try {
                await this.eliminarUsuario(this.usuarioAEliminar.id);
                this.$bvToast.toast('Usuario eliminado correctamente.', {
                    title: 'Éxito',
                    variant: 'success',
                    solid: true
                });
                this.cerrarModalEliminar();
                await this.cargarUsuarios(); // Recarga los datos para reflejar los cambios
            } catch (error) {
                this.$bvToast.toast('Error al eliminar el usuario.', {
                    title: 'Error',
                    variant: 'danger',
                    solid: true
                });
            }
        },
    },
    created() {
        this.cargarDatos();
    }
};
</script>