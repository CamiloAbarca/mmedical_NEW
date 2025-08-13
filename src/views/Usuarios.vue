<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <b-button variant="primary" @click="mostrarModal = true"
                style="background-color: #4ecdc4; border-color: #4ecdc4">
                <b-icon icon="plus-circle" class="me-1" />
                Agregar Usuario
            </b-button>
        </div>

        <TablaUsuarios />

        <b-modal id="modal-agregar-usuario" v-model="mostrarModal" title="Agregar Nuevo Usuario" @hide="resetFormulario"
            hide-footer centered size="md" :header-style="{ backgroundColor: '#556270', color: 'white' }">
            <b-form @submit.prevent="guardarUsuario" ref="form">
                <b-form-group label="Nombre" label-for="nombre">
                    <b-form-input id="nombre" v-model.trim="form.nombre" required placeholder="Ej: Juan" />
                </b-form-group>
                <b-form-group label="Apellido" label-for="apellido">
                    <b-form-input id="apellido" v-model.trim="form.apellido" required placeholder="Ej: Pérez" />
                </b-form-group>
                <b-form-group label="RUT" label-for="rut">
                    <b-form-input id="rut" v-model.trim="form.rut" required placeholder="Ej: 11.111.111-1" />
                </b-form-group>
                <b-form-group label="Email" label-for="email">
                    <b-form-input id="email" type="email" v-model.trim="form.email" required
                        placeholder="Ej: correo@empresa.cl" />
                </b-form-group>
                <b-form-group label="Contraseña" label-for="password">
                    <b-form-input id="password" type="password" v-model.trim="form.password" required />
                </b-form-group>
                <b-form-group label="Tipo de Usuario" label-for="tipo">
                    <b-form-select id="tipo" v-model="form.tipo" required>
                        <template #first>
                            <option disabled value="">-- Seleccione Tipo --</option>
                        </template>
                        <option value="super">Super Admin</option>
                        <option value="usuario">Usuario</option>
                        <option value="revisor">Revisor</option>
                    </b-form-select>
                </b-form-group>
                <div class="text-end mt-3">
                    <b-button type="submit"
                        style="background-color: #c7f464; border-color: #c7f464; color: #333; margin-right: 8px;">
                        Guardar
                    </b-button>
                    <b-button variant="danger" style="background-color: #ff6b6b; border-color: #ff6b6b"
                        @click="cerrarModal">
                        Cancelar
                    </b-button>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
import TablaUsuarios from '@/components/Usuarios/TablaUsuarios.vue';
import { mapActions } from 'vuex';

export default {
    name: 'UsuariosView',
    components: {
        TablaUsuarios,
    },
    data() {
        return {
            mostrarModal: false,
            form: {
                nombre: '',
                apellido: '',
                rut: '',
                email: '',
                password: '',
                tipo: '',
            },
        };
    },
    methods: {
        ...mapActions(['agregarUsuario', 'cargarUsuarios']),
        async guardarUsuario() {
            // Validación de todos los campos
            if (
                !this.form.nombre ||
                !this.form.apellido ||
                !this.form.rut ||
                !this.form.email ||
                !this.form.password ||
                !this.form.tipo
            ) {
                this.$bvToast.toast('Por favor, complete todos los campos.', {
                    title: 'Campos incompletos',
                    variant: 'warning',
                    solid: true
                });
                return;
            }

            // NUEVA Validación de contraseña
            if (this.form.password.length < 6) {
                this.$bvToast.toast('La contraseña debe tener al menos 6 caracteres.', {
                    title: 'Error de validación',
                    variant: 'danger',
                    solid: true
                });
                return;
            }

            const nuevoUsuario = { ...this.form };
            try {
                await this.agregarUsuario(nuevoUsuario);
                // Actualiza la tabla después de un registro exitoso
                await this.cargarUsuarios();
                this.mostrarModal = false;
                this.resetFormulario();
                this.$bvToast.toast('Usuario registrado correctamente.', {
                    title: 'Registro exitoso',
                    variant: 'success',
                    solid: true
                });
            } catch (error) {
                console.error('Error al guardar el usuario:', error);
                this.$bvToast.toast('El usuario no pudo ser registrado. Es posible que el email o RUT ya existan.', {
                    title: 'Error de registro',
                    variant: 'danger',
                    solid: true
                });
            }
        },
        cerrarModal() {
            this.mostrarModal = false;
            this.resetFormulario();
        },
        resetFormulario() {
            this.form = {
                nombre: '',
                apellido: '',
                rut: '',
                email: '',
                password: '',
                tipo: '',
            };
        },
    },
};
</script>