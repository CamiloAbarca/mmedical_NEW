<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <b-button variant="primary" @click="mostrarModal = true" style="background-color: #4ecdc4; border-color: #4ecdc4">
        <b-icon icon="plus-circle" class="me-1" />
        Agregar Equipo
      </b-button>
    </div>

    <!-- Tabla de Equipos -->
    <TablaEquipos :nuevos-equipos="nuevosEquipos" />

    <!-- Modal para agregar equipo -->
    <b-modal id="modal-agregar-equipo" v-model="mostrarModal" title="Agregar Nuevo Equipo" @hide="resetFormulario"
      hide-footer centered size="md" :header-style="{ backgroundColor: '#556270', color: 'white' }">
      <b-form @submit.prevent="guardarEquipo" ref="form">
        <b-form-group label="Nro de Serie" label-for="serie">
          <b-form-input id="serie" v-model.trim="form.serie" :state="validarCampo('serie')" required
            placeholder="Ej: ABC123" />
          <b-form-invalid-feedback>Este campo es obligatorio.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Marca" label-for="marca">
          <b-form-input id="marca" v-model.trim="form.marca" :state="validarCampo('marca')" required
            placeholder="Ej: GE, Philips" />
          <b-form-invalid-feedback>Este campo es obligatorio.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Modelo" label-for="modelo">
          <b-form-input id="modelo" v-model.trim="form.modelo" :state="validarCampo('modelo')" required
            placeholder="Ej: X200" />
          <b-form-invalid-feedback>Este campo es obligatorio.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Fecha de Revisión" label-for="revision">
          <b-form-input id="revision" type="date" v-model="form.revision" :state="validarCampo('revision')" required />
          <b-form-invalid-feedback>Seleccione una fecha válida.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group label="Estado" label-for="estado">
          <b-form-select id="estado" v-model="form.estado" :options="['Activo', 'Inactivo', 'En mantenimiento']"
            :state="validarCampo('estado')" required>
            <template #first>
              <option disabled value="">-- Seleccione estado --</option>
            </template>
          </b-form-select>
          <b-form-invalid-feedback>Debe seleccionar un estado.</b-form-invalid-feedback>
        </b-form-group>

        <!-- Botones -->
        <div class="text-end mt-3">
          <b-button type="submit" style="background-color: #c7f464; border-color: #c7f464; color: #333" class="me-2">
            Guardar
          </b-button>
          <b-button variant="danger" style="background-color: #ff6b6b; border-color: #ff6b6b" @click="cerrarModal">
            Cancelar
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import TablaEquipos from '@/components/Equipos/TablaEquipos.vue'

export default {
  name: 'EquiposView',
  components: {
    TablaEquipos
  },
  data() {
    return {
      mostrarModal: false,
      nuevosEquipos: [],
      form: {
        serie: '',
        marca: '',
        modelo: '',
        revision: '',
        estado: ''
      },
      camposValidados: false
    }
  },
  methods: {
    validarCampo(campo) {
      if (!this.camposValidados) return null
      return this.form[campo] ? true : false
    },
    guardarEquipo() {
      this.camposValidados = true

      const camposCompletos = Object.values(this.form).every(val => val)

      if (!camposCompletos) return

      const nuevo = {
        id: Date.now(),
        ...this.form
      }
      this.nuevosEquipos.push(nuevo)
      this.mostrarModal = false
      this.resetFormulario()
      this.camposValidados = false
    },
    cerrarModal() {
      this.mostrarModal = false
      this.resetFormulario()
      this.camposValidados = false
    },
    resetFormulario() {
      this.form = {
        serie: '',
        marca: '',
        modelo: '',
        revision: '',
        estado: ''
      }
    }
  }
}
</script>
