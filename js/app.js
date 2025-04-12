const templatesContainer = document.querySelector("#templates-container");
const btnNewTemplate = document.querySelector("#new-template");
const formAddTemplate = document.getElementById("form-addTemplate");

function renderTemplates() {
  templatesContainer.innerHTML = "";

  // traer la lista de templates desde el store
  const templates = window.templatesStore.getState();

  templates.forEach(function (template) {
    const li = document.createElement("li"); // li
    li.classList.add("bg-white", "p-3", "rounded");
    const headerli=document.createElement("div");
    headerli.classList.add("flex", "justify-between", "items-center");
    
    const h4 = document.createElement("h4");
    h4.classList.add("text-xl", "font-semibold");
    h4.textContent = template.title;


    const buttonDelete =document.createElement("button");
    buttonDelete.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FF4500" class="size-6">
   <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
    `;

    buttonDelete.addEventListener("click", function () {
      deleteTemplate(template.id);
    });

    headerli.appendChild(h4);
    headerli.appendChild(buttonDelete);

    const hr = document.createElement("hr");
    hr.classList.add("block", "my-3");
    const message = document.createElement("p");
    message.classList.add("text-md", "text-gray-500");
    message.textContent = template.message;

    //const hashTag = document.createElement("p");
    const arrayhashTag = template.hashTag.split(","); // Dividir por la coma
         
    const containerHashTags=document.createElement("div");
    containerHashTags.classList.add("flex","flex-wrap","gap-2","text-sm", "text-white","text-bold","m-1");

    
    arrayhashTag.forEach(hashTag => {
        const divHashTag = document.createElement("div");
        divHashTag.classList.add("bg-[#4F7942]", "px-2", "py-1", "rounded-xl"); // Agregar las clases
        
        divHashTag.textContent = "#"+hashTag.trim(); // Eliminar espacios adicionales y agregar el texto
        containerHashTags.appendChild(divHashTag); // Agregar el div al contenedor
      });
      
    
    li.appendChild(headerli);
    li.appendChild(hr);
    li.appendChild(message);
    li.appendChild(containerHashTags);
    templatesContainer.appendChild(li);
  });
}

window.templatesStore.suscribe(renderTemplates);
window.templatesStore.suscribe(saveTemplate);

document.addEventListener("DOMContentLoaded", function () {
  window.templatesStore.initializeStore();
});


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
}


function clearAll() {
  if(window.templatesStore.getState().length==0){
    showNotification("error","Error","No hay plantillas guardadas");
  }else{
    mostrarModalConfirmacion({
      titulo: "¿Eliminar TODAS las plantillas?",
      mensaje: "Se eliminarán todas las plantillas guardadas. Esta acción no se puede deshacer.",
      onConfirm: () => {
        resetearPlantillas();
        showNotification("success","Exito","Se eliminaron todas las plantillas");
      }
    });

  }

}

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
}

// Función para eliminar una plantilla por ID
function deleteTemplate(id) {
  mostrarModalConfirmacion({
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


// Escuchar el evento submit
formAddTemplate.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita el comportamiento predeterminado
  window.templatesStore.addTemplate(captureNewTemplate());
  showNotification("success","Exito","Se guardo la plantilla");
  clearForm();
});


