<template>
    <b-modal id="modal-change-password" title="Cambiar Contraseña" hide-footer centered>
        <b-form @submit.prevent="handlePasswordChange">
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
                <b-button type="submit" variant="primary"
                    style="background-color: #c7f464; border-color: #c7f464; color: #333; margin-right: 8px;"
                    class="me-2" :disabled="loading">
                    <b-spinner v-if="loading" small />
                    <span v-else>Cambiar Contraseña</span>
                </b-button>
                <b-button variant="secondary" @click="$bvModal.hide('modal-change-password')">
                    Cancelar
                </b-button>
            </div>
        </b-form>
    </b-modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'ChangePasswordModal',
    data() {
        return {
            form: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            loading: false,
        };
    },
    computed: {
        ...mapGetters(['obtenerUsuario']),
    },
    methods: {
        ...mapActions(['changePassword']),
        async handlePasswordChange() {
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

            this.loading = true;

            try {
                await this.changePassword({
                    id: this.obtenerUsuario.id,
                    currentPassword: this.form.currentPassword,
                    newPassword: this.form.newPassword
                });
                this.$bvToast.toast('Contraseña cambiada con éxito.', {
                    title: 'Éxito',
                    variant: 'success',
                    solid: true
                });
                this.$bvModal.hide('modal-change-password');
                this.resetForm();
            } catch (error) {
                this.$bvToast.toast(error.message, {
                    title: 'Error',
                    variant: 'danger',
                    solid: true
                });
            } finally {
                this.loading = false;
            }
        },
        resetForm() {
            this.form.currentPassword = '';
            this.form.newPassword = '';
            this.form.confirmPassword = '';
        }
    }
};
</script>