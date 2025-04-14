# Proyecto Plantilla WhatsApp

## Implementación del Patrón Store en la Gestión de Plantillas de WhatsApp
Este proyecto utiliza el **Patrón Store** para gestionar el estado de las plantillas de WhatsApp. El Store actúa como una capa de gestión de estado centralizada que facilita la actualización y suscripción a los cambios de estado, sin depender de un framework específico.

## Estructura del Store
El Store se implementa mediante una función llamada `createStore`, que maneja el estado de forma reactiva.

```javascript
function createStore(initialState = []) {
    let state = initialState; // Estado privado de la función
    const listeners = []; // Lista de funciones suscritas a cambios de estado

    function getState() {
        return state;
    }

    function setState(newState) {
        state = newState;
        listeners.forEach(listener => listener(state)); // Notifica a los suscriptores
    }

    function addTemplate(newTemplate) {
        const newState = [...state, newTemplate];
        setState(newState);
    }

    function suscribe(listener) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }

    function initializeStore() {
        const newTemplates = [
            new Template("Bienvenida", "Hola, bienvenido al curso", "#hash1,#hash2", "link1", "date1"),
            new Template("Oferta especial", "Aprovecha esta oferta única", "#hash1,#hash2", "link1", "date1")
        ];
        setState(newTemplates);
    }

    return { getState, setState, addTemplate, suscribe, initializeStore };
}
```

## Explicación de las Funciones

### `getState()`
Retorna el estado actual del Store. Se utiliza para acceder a la lista de plantillas almacenadas.

### `setState(newState)`
Actualiza el estado interno del Store con un nuevo estado y notifica a todos los suscriptores sobre el cambio.

### `addTemplate(newTemplate)`
Agrega una nueva plantilla al estado sin modificar el original. Usa el **spread operator (`...`)** para crear una nueva referencia del estado y luego lo actualiza con `setState()`.

### `suscribe(listener)`
Permite que una función externa (listener) se suscriba a los cambios de estado.
Devuelve una función para desuscribirse cuando sea necesario.

### `initializeStore()`
Inicializa el Store con una lista de plantillas predefinidas. Llama a `setState()` para actualizar el estado.

## Uso del Store en el Proyecto

### Creación del Store Global
```javascript
const templatesStore = createStore([]);
window.templatesStore = templatesStore; // Hacer accesible el Store globalmente
```

### Renderizado de Plantillas en la Interfaz
Cada vez que se agrega o elimina una plantilla, se vuelve a renderizar la lista sin necesidad de recargar la página.
```javascript
function renderTemplates() {
    templatesContainer.innerHTML = "";
    const templates = window.templatesStore.getState();
    templates.forEach(template => {
        // Código para renderizar las plantillas en el DOM
    });
}

// Suscribirse para actualizar la UI en cada cambio de estado
window.templatesStore.suscribe(renderTemplates);
```
--

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

## HU Adicionadas

### HU: Marcar plantilla como favorita y filtrar solo favoritas
**Como** usuario, **quiero** poder marcar una plantilla como favorita **para** identificar y acceder rápidamente a las plantillas más importantes o utilizadas.

#### Criterios de Aceptación:
- El usuario puede marcar/desmarcar una plantilla como favorita mediante un ícono visual (estrella).
-  El estado de favorito debe persistir en LocalStorage y reflejarse al recargar la página.
-  El sistema debe permitir filtrar y mostrar **solo** las plantillas marcadas como favoritas.
- El diseño del filtro y del ícono debe ser claro, accesible y coherente con la interfaz existente.

> Rama de desarrollo: `feature-template-favorite`

### HU: Filtros por título, hashtags y mensaje de plantilla

**Como** usuario, **quiero** poder buscar y filtrar plantillas por título, hashtags o mensaje **para** encontrar rápidamente la plantilla que necesito sin revisar una por una.

#### Criterios de Aceptación:
- El sistema debe permitir ingresar un texto de búsqueda.
-  La búsqueda se realizara luego de presionar el boton **Aplicar Filtros** y mostrar coincidencias  basadas en:
	  - Título de la plantilla
	  - Texto del mensaje
	  - Cualquier hashtag asociado
-  La búsqueda debe ignorar mayúsculas/minúsculas y espacios innecesarios.
- Si no hay resultados, se debe mostrar un mensaje amigable al usuario.

> Rama de desarrollo: `feature-add-filter`
> **strong text**
## 🔧 Decisiones Técnicas Clave

### 1. Modal reutilizable para "Nueva Plantilla" y "Editar Plantilla"
Se implementó un único modal dinámico para las funcionalidades de **crear** y **editar** plantillas.  
Esto se decidió porque ambos casos comparten la misma estructura de datos y campos de entrada:

- Título
- Mensaje
- Hashtags (dinámicos)
- Link

✅ Esta decisión permite **reducir duplicación de código**, mantener una sola fuente de verdad para validaciones, estilos y estructura del formulario, además de facilitar el mantenimiento y escalabilidad futura.

---

### 2. Uso de la clase `FilterManager` para manejar filtros
Se encapsuló toda la lógica relacionada con los filtros de búsqueda (por título, mensaje y hashtags) dentro de una clase `FilterManager`.

✅ Esta decisión permite:
- Separar la lógica de filtrado del DOM.
- Facilitar la reutilización de filtros y su combinación.
- Mantener el código limpio y modular.
- Escalar fácilmente la funcionalidad si se agregan nuevos criterios de búsqueda.

Además, esto respeta el principio de **responsabilidad única**, mejorando la mantenibilidad del código a largo plazo.

[Enlace a pagina web](https://cattcloud.github.io/whatsapp-templates/)
