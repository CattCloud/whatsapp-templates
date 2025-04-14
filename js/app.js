const templatesContainer = document.querySelector("#templates-container");
const btnNewTemplate = document.querySelector("#new-template");
//const formAddTemplate = document.getElementById("form-addTemplate");

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar el store y FilterManager
  window.templatesStore.initializeStore();
  window.filterManager = new FilterManager(window.templatesStore.getState());
   // Renderizar contenido inicial-solo contenido inicial
  renderTemplates();
  // Suscribir renderTemplates al cambio de estado
  window.templatesStore.suscribe(renderTemplates);
});

function renderTemplates() {
  templatesContainer.innerHTML = "";


  const templates = window.filterManager.state
    ? window.filterManager.searchArray
    : window.templatesStore.getState();


  // Verificar si hay plantillas que renderizar
  if (templates.length === 0) {
      if (templatesContainer.classList.contains("grid-cols-1") || templatesContainer.classList.contains("md:grid-cols-2")|| templatesContainer.classList.contains("lg:grid-cols-3")  ) {
        templatesContainer.classList.remove("grid-cols-1");
        templatesContainer.classList.remove("md:grid-cols-2");
        templatesContainer.classList.remove("lg:grid-cols-3");
        templatesContainer.classList.add("w-full");
        templatesContainer.classList.add("h-full");
      }
      const emptyMessage = document.createElement("div");
      emptyMessage.classList.add(
        "text-gray-500",  // Color del texto
        "w-full",         // Ocupar todo el ancho
        "h-full",         // Ocupar todo el alto
        "flex",           // Usar flexbox
        "md:flex-col",
        "gap-2",           
        "items-center",   // Centrar verticalmente
        "justify-center"  // Centrar horizontalmente
      );
      //emptyMessage.textContent = "";
      //const iconNotResult=document.createElement("div");
      emptyMessage.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
      <span>No se encontraron plantillas</span>
      `;
      templatesContainer.appendChild(emptyMessage);
      return;
  }else{    
    // Agregar una clase al elemento
    templatesContainer.classList.add("grid-cols-1");
    templatesContainer.classList.add("md:grid-cols-2");
    templatesContainer.classList.add("lg:grid-cols-3");
    templatesContainer.classList.remove("w-full");
    templatesContainer.classList.remove("h-full");
  }
   


  templates.forEach(function (template) {
    const li = document.createElement("li");
    li.classList.add(
      "m-1",
      "md:m-0",
      "bg-white", 
      "p-3", 
      "rounded", 
      "shadow-md", 
      "relative", 
      "border", 
      "border-gray-200",
      "flex",
      "flex-col",
      "md:h-auto" // Altura fija para todas las tarjetas
    );
    li.dataset.id = template.id;
    
    // Crear el encabezado con título y botón eliminar
    const headerli = document.createElement("div");
    headerli.classList.add("flex", "justify-between", "items-center", "mb-2");
    
    const h4 = document.createElement("h4");
    h4.classList.add("text-xl", "font-semibold", "truncate");
    h4.title = template.title; // Mostrar título completo en tooltip
    h4.textContent = template.title;

    const buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#FF4500" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>`;
    buttonDelete.title = "Eliminar plantilla";
    buttonDelete.addEventListener("click", function () {
      deleteTemplate(template.id);
    });

    headerli.appendChild(h4);
    headerli.appendChild(buttonDelete);

    // Contenedor para el mensaje y los hashtags con altura fija y scroll si es necesario
    const messageContainer = document.createElement("div");
    messageContainer.classList.add(
      "flex-grow", 
      "overflow-y-auto", 
      "mb-2"
    );

    
    // Hashtags
  
    let cadenaHashTag = "";
    const arrayhashTag = template.hashTag.split(",");
    arrayhashTag.forEach(hashTag => {
      if (hashTag) {
        hashTag = "#" + hashTag.trim() + " ";
        cadenaHashTag = cadenaHashTag + hashTag;
      }
    });

    // Mensaje
    const message = document.createElement("p");
    message.classList.add("text-md", "text-gray-700");
    message.innerHTML = `
      ${template.message} <span class="text-[#9ACD32] text-sm font-bold"> ${cadenaHashTag}
      </span>
    `;
    
    messageContainer.appendChild(message);

    // Fecha de creación - Se mantiene en la parte inferior
    const dateContainer = document.createElement("div");
    dateContainer.classList.add("text-sm", "text-gray-400", "mb-2");
    dateContainer.textContent = template.date
      ? formatDate(template.date)
      : formatDate();

    // Parte inferior fija con botones de acción
    const footerContainer = document.createElement("div");
    footerContainer.classList.add("mt-auto"); // Empuja al fondo con flexbox
    
    // Contenedor de botones de acción
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("flex", "justify-around", "items-center");

    // Botón de link
    const linkButton = document.createElement("button");
    linkButton.classList.add("hover:bg-gray-200", "rounded-full", "p-2", "transition-colors");
    linkButton.title = "Ir al enlace";
    //#B0C4DE
    linkButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="#6c6c6c" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    `;
    linkButton.addEventListener("click", function() {
      if (template.link) {
        window.open(template.link, "_blank");
      }
    });

    // Botón copiar 
    const copyButton = document.createElement("button");
    copyButton.classList.add("hover:bg-gray-200", "rounded-full", "p-2", "transition-colors");
    copyButton.title = "Copiar mensaje";
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#6c6c6c" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    `;
    copyButton.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        const fullMessage = `${template.message}\n\n${arrayhashTag.map(tag => '#' + tag.trim()).join(' ')}`;
        navigator.clipboard.writeText(fullMessage)
          .then(() => {
            showNotification("info", "Info", "Mensaje copiado al portapapeles");
          })
          .catch(() => {
            showNotification("error", "Error", "Error al copiar el mensaje");
          });
      } else {
        showNotification("error", "Error", "La API del portapapeles no está disponible.");
      }
    });

    //Boton editar
    const editButton=document.createElement("button");
    editButton.classList.add("hover:bg-gray-200", "rounded-full", "p-2", "transition-colors");
    editButton.title = "Editar plantilla";
    editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#243A5E" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>`;
    editButton.addEventListener("click", function () {
      console.log("Se ejecuta esto",template);
      abrirModalPlantilla("editar", template);
    }
  
  );


    // Botón favorito
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("hover:bg-gray-200", "rounded-full", "p-2", "transition-colors");
    favoriteButton.title = template.favorite ? "Quitar de favoritos" : "Marcar como favorito";
    // Actualizar el botón según el estado de template.favorite
    favoriteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="${template.favorite ? '#FFD700' : 'none'}" viewBox="0 0 24 24" stroke-width="2" stroke="${template.favorite ? '#FFD700' : ' #6c6c6c'}" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    `;
    favoriteButton.addEventListener("click", function() {
      toggleFavorite(template.id);
    });

    // Añadir botones al contenedor de acciones
    actionButtons.appendChild(linkButton);
    actionButtons.appendChild(copyButton);
    actionButtons.appendChild(editButton);
    actionButtons.appendChild(favoriteButton);
    
    footerContainer.appendChild(dateContainer);
    footerContainer.appendChild(actionButtons);

    // Añadir todos los elementos al li
    li.appendChild(headerli);
    li.appendChild(messageContainer);
    li.appendChild(footerContainer);
    
    templatesContainer.appendChild(li);
  });
}


//window.templatesStore.suscribe(renderTemplates);
window.templatesStore.suscribe(saveTemplate);


/*
function addHashtag() {
  const container = document.getElementById('hashtag-container');
  const div = document.createElement('div');
  div.className = "flex space-x-2";
  div.innerHTML = `
      <input type="text" class="hashtag-input flex-1 p-2 border rounded" placeholder="Hashtag">
  `;
  container.appendChild(div);
}

function removeHashtag() {
  const container = document.getElementById('hashtag-container');
  if (container.children.length > 1) {
    container.removeChild(container.lastChild);
  }
}
*/

/*
function captureNewTemplate(){
  const title = document.getElementById('title-input').value;
  const message = document.getElementById('message-input').value;
  const link = document.getElementById('link-input').value;
  const date = new Date().toISOString();
  
  //Forma una cadena de hashtags separados por comas
  const hashtags = Array.from(document.querySelectorAll('.hashtag-input'))
  .map(input => input.value.trim())
  .filter(value => value !== '')
  .join(',');

  return new Template(title,message,hashtags,link,date);
}*/
    

function clearAll() {
  if(window.templatesStore.getState().length==0){
    showNotification("error","Error","No hay plantillas guardadas");
  }else{
    mostrarModalEliminacion({
      titulo: "¿Eliminar TODAS las plantillas?",
      mensaje: "Se eliminarán todas las plantillas guardadas. Esta acción no se puede deshacer.",
      onConfirm: () => {
        resetearPlantillas();
        showNotification("success","Exito","Se eliminaron todas las plantillas");
      }
    });

  }

}

/*
function clearForm() {
  document.getElementById('title-input').value = '';
  document.getElementById('message-input').value = '';
  document.getElementById('link-input').value = '';
  
  const hashtagContainer = document.getElementById('hashtag-container');
  hashtagContainer.innerHTML = `
      <div class="flex space-x-2">
            <input type="text" class="hashtag-input flex-1 p-2 border rounded" placeholder="Ingrese el hashtag" required>
      </div>
  `;
}*/


// Función para eliminar una plantilla por ID
function deleteTemplate(id) {
  mostrarModalEliminacion({
    titulo: "¿Eliminar esta plantilla?",
    mensaje: "Esta acción eliminará la plantilla permanentemente.",
    onConfirm: () => {
      const updatedTemplates = window.templatesStore.getState().filter(template => template.id !== id);
      // Obtener el estado actual y filtrar la plantilla eliminada
      // Actualizar el estado global
      window.templatesStore.setState(updatedTemplates);
      showNotification("success","Exito","Se elimino la plantilla ");
    }
  });

}


// Función para alternar favorito
function toggleFavorite(id) {
  const templates = window.templatesStore.getState();
  const newTemplates = templates.map(template => {
    if (template.id === id) {
      console.log("Se encontro la plantilla");
      template.favorite=!template.favorite;
    }
    return template;
  });
  window.filterManager.applyFilters();
  window.templatesStore.setState(newTemplates);
}


// Escuchar el evento submit
/*
formAddTemplate.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita el comportamiento predeterminado
  window.templatesStore.addTemplate(captureNewTemplate());
  showNotification("success","Exito","Se guardo la plantilla");
  clearForm();
});*/



function formatDate(inputDate){
    const date = inputDate ? new Date(inputDate) : new Date();
    const options = {
      month: 'short', // Mes abreviado, como "Apr"
      day: '2-digit', // Día con dos dígitos
      year: 'numeric', // Año completo
    };
    // Formatear la parte de fecha
    const formattedDate = date.toLocaleDateString('en-US', options);
    // Formatear la parte de hora en formato 12 horas (AM/PM)
    const hours = date.getHours() % 12 || 12; // Ajuste para formato 12 horas
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutos con dos dígitos
    const amPm = date.getHours() >= 12 ? 'PM' : 'AM'; // Indicador AM/PM
    return `${hours}:${minutes} ${amPm} - ${formattedDate}`;
}

/*
function templateFavorites(){
  // Acceder al elemento SVG por su id
    const svgIcon = document.getElementById("icon-solo-favorite");
    window.filterManager.favorite=! window.filterManager.favorite;

    if( window.filterManager.favorite){
      console.log("Si aplica");
      svgIcon.setAttribute("stroke", "#FFD700"); // Cambiar color de stroke a amarillo
      svgIcon.setAttribute("fill", "#FFD700");   // Cambiar color de fill a amarillo (o "none" si quieres vacío)
    }else{
      svgIcon.setAttribute("stroke", "#8f8f8f"); // Cambiar color de stroke a gris
      svgIcon.setAttribute("fill", "none");   // Cambiar color de fill a"none" 
    }

    window.filterManager.applyFilters();
}
*/


function modalCreateTemplate(){
   abrirModalPlantilla("create");
}
