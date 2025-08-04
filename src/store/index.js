import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    equipos: [],
    clientes: [],
  },

  getters: {
    obtenerEquipos: (state) => state.equipos,
    obtenerEquipoPorId: (state) => (id) =>
      state.equipos.find((e) => e.id === id),
    obtenerClientes: (state) => state.clientes,
  },

  mutations: {
    // Equipos
    SET_EQUIPOS(state, equipos) {
      state.equipos = equipos;
    },
    ADD_EQUIPO(state, equipo) {
      state.equipos.push(equipo);
    },
    UPDATE_EQUIPO(state, equipoActualizado) {
      const index = state.equipos.findIndex(
        (e) => e.id === equipoActualizado.id
      );
      if (index !== -1) {
        Vue.set(state.equipos, index, equipoActualizado);
      }
    },
    DELETE_EQUIPO(state, id) {
      state.equipos = state.equipos.filter((e) => e.id !== id);
    },

    // Clientes
    SET_CLIENTES(state, clientes) {
      state.clientes = clientes;
    },
    ADD_CLIENTE(state, cliente) {
      state.clientes.push(cliente);
    },
    UPDATE_CLIENTE(state, clienteActualizado) {
      const index = state.clientes.findIndex(
        (c) => c.id === clienteActualizado.id
      );
      if (index !== -1) {
        Vue.set(state.clientes, index, clienteActualizado);
      }
    },
    DELETE_CLIENTE(state, id) {
      state.clientes = state.clientes.filter((c) => c.id !== id);
    },
  },

  actions: {
    // Equipos
    cargarEquipos({ commit }) {
      const equiposDummy = [
        {
          id: 1,
          tipo: "Humano",
          marca: "GE",
          modelo: "X200",
          serie: "ABC123",
          estado: "En Revisión",
          fechaIngreso: "2025-01-10",
          fechaEntrega: "2025-04-01",
          fechaPeriodo: "2025-04-01",
          accesorios: "Cable de poder",
          detalles: "Chequeo general",
        },
        {
          id: 2,
          tipo: "Veterinario",
          marca: "Philips",
          modelo: "UltraScan",
          serie: "XYZ456",
          estado: "Facturado",
          fechaIngreso: "2025-04-01",
          fechaEntrega: "2025-06-15",
          fechaPeriodo: "2025-04-01",
          accesorios: "Transductor",
          detalles: "Mantenimiento preventivo",
        },
      ];
      commit("SET_EQUIPOS", equiposDummy);
    },
    agregarEquipo({ commit }, equipo) {
      commit("ADD_EQUIPO", equipo);
    },
    actualizarEquipo({ commit }, equipo) {
      commit("UPDATE_EQUIPO", equipo);
    },
    eliminarEquipo({ commit }, id) {
      commit("DELETE_EQUIPO", id);
    },

    // ✅ Clientes (aquí es donde deben estar)
    cargarClientes({ commit }) {
      const clientesDummy = [
        {
          id: 1,
          razonSocial: "Vidaintegra",
          rut: "96.617.350-5",
          email: "cjaques@vidaintegra.cl",
          fono: "996560489",
          contacto: "Cristobal Jaques",
          centroMedico: "Alameda",
        },
        {
          id: 2,
          razonSocial: "Vidaintegra",
          rut: "96.617.350-5",
          email: "iprecarchile@vidaintegra.cl",
          fono: "923456791",
          contacto: "Ana Maria Ossandon",
          centroMedico: "Puente Alto",
        },
      ];
      commit("SET_CLIENTES", clientesDummy);
    },
    agregarCliente({ commit }, cliente) {
      commit("ADD_CLIENTE", cliente);
    },
    actualizarCliente({ commit }, cliente) {
      commit("UPDATE_CLIENTE", cliente);
    },
    eliminarCliente({ commit }, id) {
      commit("DELETE_CLIENTE", id);
    },
  },
});
