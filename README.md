# Proyecto Plantilla WhatsApp

## Descripción Técnica de la Clase `Template`

### Propiedades
1. **`title`** (string):  
   Representa el título de la plantilla.  
   Ejemplo: `"Notificación de evento"`.

2. **`message`** (string):  
   Contenido del mensaje principal en la plantilla.  
   Ejemplo: `"Recuerda asistir al evento del viernes."`.

3. **`hashTag`** (string):  
   Lista de etiquetas hash separadas por comas.  
   Ejemplo: `"#evento,#notificación,#viernes"`.

4. **`link`** (string):  
   URL que puede estar asociada con la plantilla.  
   Ejemplo: `"https://example.com/evento"`.

5. **`date`** (Date):  
   Fecha asociada con la plantilla.  
   Ejemplo: `new Date()`.

### Métodos
1. **`saveTemplate()`**:  
   - **Función**: Guarda la plantilla en el array global `templates`.  
   - **Acción**: Inserta la instancia actual (`this`) en el array `templates`.  
   - **Código**:
     ```javascript
     saveTemplate() {
       templates.push(this);
     }
     ```

2. **`render()`**:  
   - **Función**: Genera un elemento visual (HTML) que representa la plantilla y lo agrega al contenedor global `templatesContainer`.  
   - **Componentes Generados**:
     - Un elemento `<li>` que contiene los siguientes elementos:
       - **Título (`<h4>`)**: Renderiza el título de la plantilla.
       - **Separador (`<hr>`)**: Línea horizontal para separar secciones.
       - **Mensaje (`<p>`)**: Muestra el contenido del mensaje.
       - **Lista de hashtags (`<div>`)**: Renderiza etiquetas estilo WhatsApp en una estructura `div`. Los hashtags se dividen por comas y se estilizan individualmente.
   - **Código**:
     ```javascript
     render() {
       const li = document.createElement("li");
       li.classList.add("bg-white", "p-4", "my-3", "rounded");

       const h4 = document.createElement("h4");
       h4.classList.add("text-xl", "font-semibold");
       h4.textContent = this.title;

       const hr = document.createElement("hr");
       hr.classList.add("block", "my-3");

       const message = document.createElement("p");
       message.classList.add("text-md", "text-gray-500");
       message.textContent = this.message;

       const arrayhashTag = this.hashTag.split(",");
       const containerHashTags = document.createElement("div");
       containerHashTags.classList.add("flex", "gap-2", "text-sm", "text-white", "text-semibold", "m-1");

       arrayhashTag.forEach(hashTag => {
         const divHashTag = document.createElement("div");
         divHashTag.classList.add("bg-[#25d366]", "px-3", "py-1", "rounded-xl");
         divHashTag.textContent = hashTag.trim();
         containerHashTags.appendChild(divHashTag);
       });

       li.appendChild(h4);
       li.appendChild(hr);
       li.appendChild(message);
       li.appendChild(containerHashTags);

       templatesContainer.appendChild(li);
     }
     ```


### Variables Globales
1. **`templates`**: Array global que almacena todas las instancias de la clase `Template`.
   ```javascript
   const templates = [];
