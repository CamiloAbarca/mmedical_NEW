import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Función auxiliar para normalizar la fecha a 'YYYY-MM-DD' para una comparación precisa.
function normalizeDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
}

// Función auxiliar para formatear la fecha a 'dd/mm/yyyy' para su visualización.
function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Mapeo de nombres de campos para un historial más legible
const fieldLabels = {
  estado: "Estado",
  fecha_entrega: "Fecha Entrega",
  fecha_periodo: "Fecha inicio Periodo",
  accesorios: "Accesorios",
  detalle: "Detalles",
};

export default new Vuex.Store({
  state: {
    equipos: [],
    clientes: [],
    usuarios: [],
    user: null, // Estado para el usuario autenticado
  },

  getters: {
    obtenerEquipos: (state) => state.equipos,
    obtenerEquipoPorId: (state) => (id) =>
      state.equipos.find((e) => e.id === id),
    obtenerClientes: (state) => state.clientes,
    obtenerUsuarios: (state) => state.usuarios,
    obtenerUsuario: (state) => state.user, // Getter para el usuario
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

    // Usuarios
    SET_USUARIOS(state, usuarios) {
      state.usuarios = usuarios;
    },
    ADD_USUARIO(state, usuario) {
      state.usuarios.push(usuario);
    },
    UPDATE_USUARIO(state, usuarioActualizado) {
      const index = state.usuarios.findIndex(
        (c) => c.id === usuarioActualizado.id
      );
      if (index !== -1) {
        Vue.set(state.usuarios, index, usuarioActualizado);
      }
    },
    DELETE_USUARIO(state, id) {
      state.usuarios = state.usuarios.filter((c) => c.id !== id);
    },

    // Mutación para establecer el usuario
    SET_USER(state, user) {
      state.user = user;
    },
  },

  actions: {
    // Cargar equipos solo desde API
    async cargarEquipos({ commit, dispatch }) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://mmedical.cl/api/equipos", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Error al cargar equipos");
        const data = await response.json();

        const hoy = new Date();
        const dosSemanas = 14 * 24 * 60 * 60 * 1000;

        // Recorremos los equipos
        for (let equipo of data) {
          if (equipo.fecha_mantencion) {
            const fechaMantencion = new Date(equipo.fecha_mantencion);
            const diferencia = fechaMantencion.getTime() - hoy.getTime();

            // Si faltan <= 14 días y el estado NO es "Necesita mantención"
            if (
              diferencia > 0 &&
              diferencia <= dosSemanas &&
              equipo.estado !== "Necesita mantención"
            ) {
              equipo.estado = "Necesita mantención";
              // Actualizar en la API
              await dispatch("actualizarEquipo", equipo);
            }
          }
        }

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
        const response = await fetch("https://mmedical.cl/api/equipos", {
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
    async actualizarEquipo({ commit, dispatch, state }, equipo) {
      try {
        const token = localStorage.getItem("token");
        const equipoAnterior = state.equipos.find((e) => e.id === equipo.id);

        if (!equipoAnterior) {
          throw new Error("Equipo no encontrado en el estado local");
        }

        const cambios = [];
        const fieldsToCompare = [
          "estado",
          "fecha_entrega",
          "fecha_periodo",
          "accesorios",
          "detalle",
        ];

        fieldsToCompare.forEach((key) => {
          const oldValue = key.startsWith("fecha")
            ? normalizeDate(equipoAnterior[key])
            : equipoAnterior[key];
          const newValue = key.startsWith("fecha")
            ? normalizeDate(equipo[key])
            : equipo[key];

          if (oldValue !== newValue) {
            const oldFormattedValue = key.startsWith("fecha")
              ? formatDateToDDMMYYYY(oldValue)
              : oldValue;
            const newFormattedValue = key.startsWith("fecha")
              ? formatDateToDDMMYYYY(newValue)
              : newValue;
            const label = fieldLabels[key] || key;
            cambios.push(
              `${label}: "${oldFormattedValue}" a "${newFormattedValue}"`
            );
          }
        });

        // Si hay cambios, enviar la actualización a la API y registrar el historial
        if (cambios.length > 0) {
          const response = await fetch(
            `https://mmedical.cl/api/equipos/${equipo.id}`,
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

          // Actualizar el estado local con la respuesta de la API
          commit("UPDATE_EQUIPO", equipoActualizado);

          const historial = {
            id_equipo: equipo.id,
            detalle: cambios.join(", "),
            fecha: new Date().toISOString().split("T")[0],
          };
          await dispatch("agregarHistorial", historial);
        }
      } catch (error) {
        console.error("Error al actualizar equipo y/o historial:", error);
      }
    },

    // Eliminar equipo (DELETE API)
    async eliminarEquipo({ commit }, id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://mmedical.cl/api/equipos/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
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
        const response = await fetch("https://mmedical.cl/api/historial", {
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
          `https://mmedical.cl/api/historial/equipo/${id_equipo}`,
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

    // Cargar clientes
    async cargarClientes({ commit }) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://mmedical.cl/api/clientes", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Error al cargar clientes");
        const data = await response.json();
        commit("SET_CLIENTES", data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        commit("SET_CLIENTES", []);
      }
    },

    // Agregar cliente (POST API)
    async agregarCliente({ commit }, cliente) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://mmedical.cl/api/clientes", {
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

    // Actualizar cliente (PUT API)
    async actualizarCliente({ commit }, cliente) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://mmedical.cl/api/clientes/${cliente.id}`,
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

    // Eliminar cliente (DELETE API)
    async eliminarCliente({ commit }, id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://mmedical.cl/api/clientes/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Error al eliminar cliente");
        commit("DELETE_CLIENTE", id);
      } catch (error) {
        console.error(error);
        commit("DELETE_CLIENTE", id);
      }
    },

    // Acción para cargar usuarios
    async cargarUsuarios({ commit }) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://mmedical.cl/api/usuarios/", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Error al cargar usuarios");
        const data = await response.json();
        commit("SET_USUARIOS", data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        commit("SET_USUARIOS", []);
      }
    },

    // Agregar Usuario (POST API)
    async agregarUsuario({ commit }, usuario) {
      try {
        const response = await fetch(
          "https://mmedical.cl/api/usuarios/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
          }
        );
        if (!response.ok) throw new Error("Error al registrar el usuario");
        const nuevoUsuario = await response.json();
        commit("ADD_USUARIO", nuevoUsuario);
      } catch (error) {
        console.error("Error al registrar usuario:", error);
      }
    },

    // Actualizar usuario (PUT API)
    async actualizarUsuario({ commit }, usuario) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://mmedical.cl/api/usuarios/${usuario.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(usuario),
          }
        );
        if (!response.ok) throw new Error("Error al actualizar usuario");
        const usuarioActualizado = await response.json();
        commit("UPDATE_USUARIO", usuarioActualizado);
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
      }
    },

    // Eliminar usuario (DELETE API)
    async eliminarUsuario({ commit }, id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://mmedical.cl/api/usuarios/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Error al eliminar usuario");
        commit("DELETE_USUARIO", id);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
      }
    },

    // Acción para cambiar la contraseña de un usuario
    async changePassword({ rootState }, { id, currentPassword, newPassword }) {
      const token = localStorage.getItem("token");
      const userId = rootState.user?.id;

      if (!token || !userId) {
        throw new Error("Usuario no autenticado.");
      }

      try {
        const response = await fetch(
          `https://mmedical.cl/api/usuarios/change-password/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Error al cambiar la contraseña."
          );
        }

        console.log("Contraseña cambiada con éxito!");
      } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        throw error;
      }
    },
  },
});
