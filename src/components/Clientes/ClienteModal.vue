<template>
    <div>
        <b-modal :id="modalId" title="Detalles del Cliente" @hide="$emit('cerrar')" size="md" ok-only>
            <b-container fluid>
                <b-form @submit.prevent="guardarCambios">
                    <b-row>
                        <b-col>
                            <b-form-group label="Razón Social" label-for="razonSocial">
                                <b-form-input id="razonSocial" v-model="editableCliente.razonSocial" required />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col md="6">
                            <b-form-group label="RUT" label-for="rut">
                                <b-form-input id="rut" v-model="editableCliente.rut" required />
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group label="Email" label-for="email">
                                <b-form-input id="email" type="email" v-model="editableCliente.email" required />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col md="6">
                            <b-form-group label="Fono" label-for="fono">
                                <b-form-input id="fono" v-model="editableCliente.fono" required />
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group label="Contacto" label-for="contacto">
                                <b-form-input id="contacto" v-model="editableCliente.contacto" required />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Centro Médico" label-for="centroMedico">
                                <b-form-input id="centroMedico" v-model="editableCliente.centroMedico" required />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <hr />
                    <div class="d-flex justify-content-end">
                        <b-button variant="success" type="submit" class="mr-2">Guardar cambios</b-button>
                        <b-button variant="danger" class="mr-2" @click="eliminarCliente">Eliminar cliente</b-button>
                    </div>
                </b-form>
            </b-container>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'ClienteModal',
    props: {
        cliente: {
            type: Object,
            default: () => ({}),
        },
        modalId: {
            type: String,
            default: 'modal-cliente',
        },
    },
    data() {
        return {
            editableCliente: { ...this.cliente },
        };
    },
    watch: {
        cliente: {
            handler(nuevo) {
                if (nuevo) {
                    this.editableCliente = { ...nuevo };
                }
            },
            immediate: true,
        },
    },
    methods: {
        guardarCambios() {
            // Emite un evento 'editar' con la copia editable del cliente
            this.$emit('editar', this.editableCliente);
            // Cierra el modal
            this.$emit('cerrar');
        },
        eliminarCliente() {
            // Emite un evento 'eliminar' con el cliente a eliminar
            this.$emit('eliminar', this.editableCliente.id);
        },
    },
};
</script>