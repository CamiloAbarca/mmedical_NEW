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
    // Cargar equipos solo desde API, sin dummy
    async cargarEquipos({ commit }) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/equipos", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Error al cargar equipos");
        const data = await response.json();
        commit("SET_EQUIPOS", data);
      } catch (error) {
        console.error("Error al cargar equipos desde API:", error);
        commit("SET_EQUIPOS", []);
      }
    },

    // Agregar equipo (POST API)
    async agregarEquipo({ commit }, equipo) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/equipos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(equipo),
        });
        if (!response.ok) throw new Error("Error al agregar equipo");
        const nuevoEquipo = await response.json();
        commit("ADD_EQUIPO", nuevoEquipo);
      } catch (error) {
        console.error(error);
      }
    },

    // Actualizar equipo (PUT API)
    async actualizarEquipo({ commit, dispatch }, equipo) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/equipos/${equipo.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(equipo),
          }
        );
        if (!response.ok) throw new Error("Error al actualizar equipo");
        const equipoActualizado = await response.json();
        commit("UPDATE_EQUIPO", equipoActualizado);

        const detalleHistorial = `Equipo actualizado. Estado: ${equipo.estado}, Fecha de período: ${equipo.fecha_periodo}, Fecha de entrega: ${equipo.fecha_entrega}`;
        const historial = {
          id_equipo: equipo.id,
          detalle: detalleHistorial,
          fecha: new Date().toISOString().split("T")[0],
        };
        await dispatch("agregarHistorial", historial);
      } catch (error) {
        console.error("Error al actualizar equipo y/o historial:", error);
        commit("UPDATE_EQUIPO", equipo);
      }
    },

    // Eliminar equipo (DELETE API)
    async eliminarEquipo({ commit }, id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/equipos/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!response.ok) throw new Error("Error al eliminar equipo");
        commit("DELETE_EQUIPO", id);
      } catch (error) {
        console.error(error);
        commit("DELETE_EQUIPO", id);
      }
    },

    // Acción para registrar un nuevo movimiento en el historial
    async agregarHistorial(context, historial) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/historial", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(historial),
        });
        if (!response.ok)
          throw new Error("Error al agregar registro de historial");
      } catch (error) {
        console.error("Error al registrar historial:", error);
      }
    },

    // Acción para cargar el historial de un equipo
    async cargarHistorial(context, id_equipo) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/historial/equipo/${id_equipo}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!response.ok) throw new Error("Error al cargar historial");
        const historial = await response.json();
        return historial;
      } catch (error) {
        console.error("Error al cargar historial:", error);
        return [];
      }
    },

    // Cargar clientes (puede usar dummy si quieres)
    async cargarClientes({ commit }) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/clientes", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Error al cargar clientes");
        const data = await response.json();
        commit("SET_CLIENTES", data);
      } catch (error) {
        console.error("Fetch clientes fallo, usando dummy:", error);
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
      }
    },

    async agregarCliente({ commit }, cliente) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(cliente),
        });
        if (!response.ok) throw new Error("Error al agregar cliente");
        const nuevoCliente = await response.json();
        commit("ADD_CLIENTE", nuevoCliente);
      } catch (error) {
        console.error(error);
      }
    },

    async actualizarCliente({ commit }, cliente) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/clientes/${cliente.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(cliente),
          }
        );
        if (!response.ok) throw new Error("Error al actualizar cliente");
        const clienteActualizado = await response.json();
        commit("UPDATE_CLIENTE", clienteActualizado);
      } catch (error) {
        console.error(error);
        commit("UPDATE_CLIENTE", cliente);
      }
    },

    async eliminarCliente({ commit }, id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/clientes/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!response.ok) throw new Error("Error al eliminar cliente");
        commit("DELETE_CLIENTE", id);
      } catch (error) {
        console.error(error);
        commit("DELETE_CLIENTE", id);
      }
    },
  },
});
