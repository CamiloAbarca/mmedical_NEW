<template>
    <b-modal id="modal-change-password" title="Cambiar Contraseña" hide-footer centered>
        <b-alert show variant="info" class="text-center">
            Funcionalidad pendiente: La API para cambiar la contraseña no está implementada.
        </b-alert>
        <b-form @submit.prevent="changePassword">
            <b-form-group label="Contraseña actual" label-for="current-password">
                <b-form-input id="current-password" type="password" v-model="form.currentPassword" required
                    placeholder="Ingresa tu contraseña actual"></b-form-input>
            </b-form-group>

            <b-form-group label="Nueva contraseña (mínimo 6 caracteres)" label-for="new-password">
                <b-form-input id="new-password" type="password" v-model="form.newPassword" required
                    placeholder="Ingresa tu nueva contraseña"></b-form-input>
            </b-form-group>

            <b-form-group label="Confirmar nueva contraseña" label-for="confirm-password">
                <b-form-input id="confirm-password" type="password" v-model="form.confirmPassword" required
                    placeholder="Confirma tu nueva contraseña"></b-form-input>
            </b-form-group>

            <div class="d-flex justify-content-end mt-3">
                <b-button type="submit" variant="primary" style="background-color: #4ecdc4; border-color: #4ecdc4"
                    class="me-2" disabled>
                    Cambiar Contraseña
                </b-button>
                <b-button variant="secondary" @click="$bvModal.hide('modal-change-password')">
                    Cancelar
                </b-button>
            </div>
        </b-form>
    </b-modal>
</template>

<script>
export default {
    name: 'ChangePasswordModal',
    data() {
        return {
            form: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
        };
    },
    methods: {
        changePassword() {
            // Validaciones básicas
            if (this.form.newPassword.length < 6) {
                this.$bvToast.toast('La nueva contraseña debe tener al menos 6 caracteres.', {
                    title: 'Error de validación',
                    variant: 'danger',
                    solid: true
                });
                return;
            }
            if (this.form.newPassword !== this.form.confirmPassword) {
                this.$bvToast.toast('Las contraseñas no coinciden.', {
                    title: 'Error de validación',
                    variant: 'danger',
                    solid: true
                });
                return;
            }

            // Lógica de cambio de contraseña (PENDIENTE DE LA API)
            this.$bvToast.toast('Funcionalidad pendiente: la API para cambiar la contraseña no está implementada.', {
                title: 'Atención',
                variant: 'warning',
                solid: true
            });
            this.$bvModal.hide('modal-change-password');
            this.resetForm();
        },
        resetForm() {
            this.form.currentPassword = '';
            this.form.newPassword = '';
            this.form.confirmPassword = '';
        }
    }
};
</script>