function mostrarModalEliminacion({ titulo, mensaje, onConfirm }) {
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

/*-------------------------------------------------------------------*/
let editandoId; // Saber si estamos creando o editando

// Abre el modal y lo configura
function abrirModalPlantilla(modo, plantilla = null) {
  const modal = document.getElementById("modal-plantilla");
  const titulo = document.getElementById("modal-titulo");
  const form = document.getElementById("form-plantilla");

  modal.classList.remove("hidden");
  titulo.textContent = modo === "editar" ? "Editar Plantilla" : "Nueva Plantilla";

  // Limpiar el formulario por defecto
  form.reset();

  document.getElementById("hashtag-container").innerHTML = `
    <div class="flex space-x-2">
      <input type="text" class="hashtag-input flex-1 p-2 border rounded" placeholder="Hashtag (sin #)" required>
    </div>
  `;
  editandoId = null;

  // Si estamos editando, rellenar con la data existente
  if (modo === "editar" && plantilla) {
    document.getElementById("title-input").value = plantilla.title;
    document.getElementById("message-input").value = plantilla.message;
    document.getElementById("link-input").value = plantilla.link;


    // Mostrar hashtags
    const hashtagsHTML = plantilla.hashTag.split(",").map(tag => `
      <div class="flex space-x-2">
        <input type="text" class="hashtag-input flex-1 p-2 border rounded" placeholder="Hashtag" value="${tag}" required>
      </div>
    `).join("");
    document.getElementById("hashtag-container").innerHTML = hashtagsHTML;

    editandoId = plantilla.id; // Guardamos el ID para editar
  }
}

// Cerrar el modal
function cerrarModalPlantilla() {
  document.getElementById("modal-plantilla").classList.add("hidden");
}

// Agregar hashtag dinámicamente
function addHashtag() {
  const container = document.getElementById("hashtag-container");
  const div = document.createElement("div");
  div.className = "flex space-x-2";
  div.innerHTML = `<input type="text" class="hashtag-input flex-1 p-2 border rounded" placeholder="Hashtag" required>`;
  container.appendChild(div);
}

// Eliminar último hashtag
function removeHashtag() {
  const container = document.getElementById("hashtag-container");
  if (container.children.length > 1) {
    container.removeChild(container.lastChild);
  }
}

// Guardar plantilla nueva o editada
document.getElementById("form-plantilla").addEventListener("submit", function (e) {
  e.preventDefault();
  const titulo = document.getElementById("title-input").value;
  const mensaje = document.getElementById("message-input").value;
  const link = document.getElementById("link-input").value;
  const hashtags = Array.from(document.querySelectorAll('.hashtag-input')).map(input => input.value.trim())
  .filter(value => value !== '')
  .join(',');

  console.log(hashtags);

  const plantilla=new Template(titulo,mensaje,hashtags,link,new Date().toISOString());
  //Si es edicion
  if(editandoId){
    const template_edit=window.templatesStore.getState().filter(template=>template.id==editandoId);
    console.log("resultdo",template_edit);
    plantilla.id=template_edit.id;
    plantilla.date=template_edit.date;
    plantilla.favorite=template_edit.favorite;
    const newTemplates = window.templatesStore.getState().map(template => {
      if (template.id === editandoId) {
        console.log("Se encontro la plantilla");
        template=plantilla;
      }
      return template;
    });
    window.templatesStore.setState(newTemplates);
  }else{
    window.templatesStore.addTemplate(plantilla);
  }
  
  window.filterManager.applyFilters();

  let mensajeSuccess;
  editandoId? mensajeSuccess="Se edito la plantilla":mensajeSuccess="Se guardo la plantilla";
  
  showNotification("success","Exito",mensajeSuccess);

  //console.log(editandoId ? "Plantilla editada" : "Plantilla guardada", plantilla);

  cerrarModalPlantilla();
});

