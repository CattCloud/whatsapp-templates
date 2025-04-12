function mostrarModalConfirmacion({ titulo, mensaje, onConfirm }) {
    const modal = document.getElementById("modal-confirmacion");
    const tituloEl = document.getElementById("modal-titulo");
    const mensajeEl = document.getElementById("modal-mensaje");
    const btnCancelar = document.getElementById("btn-cancelar");
    const btnConfirmar = document.getElementById("btn-confirmar");
  
    // Set contenido
    tituloEl.textContent = titulo;
    mensajeEl.textContent = mensaje;
  
    // Mostrar modal
    modal.classList.remove("hidden");
  
    // Limpiar eventos anteriores
    btnConfirmar.onclick = null;
    btnCancelar.onclick = null;
  
    // Cerrar y cancelar
    btnCancelar.onclick = () => {
      modal.classList.add("hidden");
    };
  
    // Confirmar acción
    btnConfirmar.onclick = () => {
      onConfirm();
      modal.classList.add("hidden");
    };
  }