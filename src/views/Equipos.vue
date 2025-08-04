<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <b-button variant="primary" @click="mostrarModal = true" style="background-color: #4ecdc4; border-color: #4ecdc4">
        <b-icon icon="plus-circle" class="me-1" />
        Agregar Equipo
      </b-button>
    </div>

    <TablaEquipos />

    <b-modal id="modal-agregar-equipo" v-model="mostrarModal" title="Agregar Nuevo Equipo" @hide="resetFormulario"
      hide-footer centered size="lg" :header-style="{ backgroundColor: '#556270', color: 'white' }">
      <b-form @submit.prevent="guardarEquipo" ref="form">
        <b-row>
          <b-col md="6">
            <b-form-group label="Tipo de Equipo" label-for="tipo">
              <b-form-select id="tipo" v-model="form.tipo" :state="validarCampo('tipo')" required>
                <template #first>
                  <option disabled value="">-- Seleccione Tipo --</option>
                </template>
                <option value="Humano">Humano</option>
                <option value="Veterinario">Veterinario</option>
              </b-form-select>
              <b-form-invalid-feedback>Seleccione un tipo válido.</b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Marca" label-for="marca">
              <b-form-select id="marca" v-model="form.marca" :options="marcasDisponibles" :disabled="!form.tipo"
                :state="validarCampo('marca')" required>
                <template #first>
                  <option disabled value="">-- Seleccione Marca --</option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback>Seleccione una marca.</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <b-form-group label="Modelo" label-for="modelo">
              <b-form-select id="modelo" v-model="form.modelo" :options="modelosDisponibles" :disabled="!form.marca"
                :state="validarCampo('modelo')" required>
                <template #first>
                  <option disabled value="">-- Seleccione Modelo --</option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback>Seleccione un modelo.</b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label="Estado" label-for="estado">
              <b-form-select id="estado" v-model="form.estado" :state="validarCampo('estado')" required>
                <template #first>
                  <option disabled value="">-- Seleccione Estado --</option>
                </template>
                <option>En Revisión</option>
                <option>Cotizado</option>
                <option>OC Recibida</option>
                <option>Despachado</option>
                <option>Facturado</option>
                <option>Garantía</option>
              </b-form-select>
              <b-form-invalid-feedback>Debe seleccionar un estado.</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>

        <div v-if="form.tipo && form.marca && form.modelo">
          <b-row>
            <b-col md="6">
              <b-form-group label="Nro. de Serie" label-for="serie">
                <b-form-input id="serie" v-model.trim="form.serie" :state="validarCampo('serie')" required
                  placeholder="Ej: ABC123" />
                <b-form-invalid-feedback>Este campo es obligatorio.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Fecha Ingreso" label-for="fechaIngreso">
                <b-form-input id="fechaIngreso" type="date" v-model="form.fechaIngreso"
                  :state="validarCampo('fechaIngreso')" required />
                <b-form-invalid-feedback>Seleccione una fecha válida.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

          </b-row>

          <b-row>
            <b-col md="6">
              <b-form-group label="Fecha Inicio Periodo" label-for="fechaPeriodo">
                <b-form-input id="fechaPeriodo" type="date" v-model="form.fechaPeriodo"
                  :state="validarCampo('fechaPeriodo')" required />
                <b-form-invalid-feedback>Seleccione una fecha válida.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group label="Fecha Ingreso" label-for="fechaIngreso">
                <b-form-input id="fechaIngreso" type="date" v-model="form.fechaIngreso"
                  :state="validarCampo('fechaIngreso')" required />
                <b-form-invalid-feedback>Seleccione una fecha válida.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>


          </b-row>

          <b-row>
            <b-col md="12">
              <b-form-group label="Accesorios" label-for="accesorios">
                <b-form-textarea id="accesorios" v-model="form.accesorios"
                  placeholder="Ej: Cable, cargador, funda, etc." :state="validarCampo('accesorios')" required
                  rows="2" />
                <b-form-invalid-feedback>Describa los accesorios.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="12">
              <b-form-group label="Detalles" label-for="detalles">
                <b-form-textarea id="detalles" v-model="form.detalles" placeholder="Ej: Equipo con piezas sulfatadas."
                  :state="validarCampo('detalles')" required rows="2" />
                <b-form-invalid-feedback>Describa los accesorios.</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </div>

        <div class="text-end mt-3">
          <b-button type="submit"
            style="background-color: #c7f464; border-color: #c7f464; color: #333; margin-right: 8px;">
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
import { mapActions } from 'vuex'

export default {
  name: 'EquiposView',
  components: {
    TablaEquipos
  },
  data() {
    return {
      mostrarModal: false,
      form: {
        tipo: '',
        marca: '',
        modelo: '',
        serie: '',
        estado: '',
        fechaIngreso: '',
        fechaEntrega: '',
        accesorios: '',
        detalles: ''
      },
      camposValidados: false
    }
  },
  computed: {
    marcasDisponibles() {
      //... (tu lógica original, no cambia)
      const marcasPorTipo = {
        Humano: [
          'Aerotel', 'Biester', 'BTL', 'Cardiocare', 'DATASCOPE', 'Econet', 'Enraf Nonius', 'IEM',
          'meditech', 'Mortara', 'Norav', 'Nort East Monitoring', 'Spacelabs', 'SUNTECH',
          'Track Master', 'Trismed', 'Whitehall'
        ],
        Veterinario: ['SUNTECH', 'Edan']
      }
      return this.form.tipo ? marcasPorTipo[this.form.tipo] : []
    },
    modelosDisponibles() {
      //... (tu lógica original, no cambia)
      const modelos = {
        Humano: {
          Aerotel: ['HeartView 12 l'],
          Biester: ['E-27-M'],
          BTL: ['4625 Premiun', 'BTL6000 SHORTWAVE'],
          Cardiocare: ['Cardio Care 2000'],
          DATASCOPE: ['PASSPORT2'],
          Econet: ['Proview 10L', 'Proview 10'],
          'Enraf Nonius': ['C-5', 'Endomed 982*', 'SONOPULS 490'],
          IEM: ['MOG NG'],
          meditech: ['abpm-04'],
          Mortara: ['H3+', 'TMX428220'],
          Norav: ['NR302', 'NR307', 'NR317', 'W1200'],
          'Nort East Monitoring': ['DR200'],
          Spacelabs: ['90207'],
          SUNTECH: ['oscar 2', 'bravo mini', 'bravo'],
          'Track Master': ['TM4'],
          Trismed: ['WT3000 TSM', 'Cardipia 800H'],
          Whitehall: ['ET8']
        },
        Veterinario: {
          SUNTECH: ['VET 25E', 'VET 20', 'VET 25', 'VET 30E', 'VET 40', 'VET30'],
          Edan: ['X10 VET', 'Acclarix']
        }
      }

      const tipo = this.form.tipo
      const marca = this.form.marca

      if (!tipo || !marca) return []

      return modelos[tipo][marca] || []
    }
  },
  methods: {
    ...mapActions(['agregarEquipo']),
    validarCampo(campo) {
      if (!this.camposValidados) return null
      return this.form[campo] ? true : false
    },
    guardarEquipo() {
      this.camposValidados = true
      // Validar que todos los campos obligatorios estén completos
      const camposCompletos = Object.values(this.form).every(val => val)
      if (!camposCompletos) {
        return
      }

      // Crear el objeto del nuevo equipo
      const nuevo = {
        id: Date.now(), // ID único temporal
        ...this.form
      }

      // Usar la action de Vuex para agregar el equipo
      this.agregarEquipo(nuevo)

      // Cerrar el modal y resetear el formulario
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
        tipo: '',
        marca: '',
        modelo: '',
        serie: '',
        estado: '',
        fechaIngreso: '',
        fechaEntrega: '',
        accesorios: '',
        detalles: ''
      }
    }
  }
}
</script>