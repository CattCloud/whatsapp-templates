function createStore(initialState = []) {
    // Estado interno de la funcion
    // variable privda
    let state = initialState; // por defecto es un []
  
    // arreglo de funciones que se ejecutan cuando el estado cambia
    const listeners = [];
  
    function getState() {
      return state;
    }
  
    function setState(newState) {
      state = newState;
  
      // se ejecuta cuando el estado cambia, por ende yo debo llamar a las funciones
      // que existen dentro de listeners
  
      // forEach
      listeners.forEach(function (listener) {
        listener(state);
      });
    }
  
    function addTemplate(newTemplate) {
      // ... => spread operator
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
  
    

    //Se ejecuta la inicio
    function initializeStore() {
        // localStorage.getItem("templates") cuando no existe es un null
        const templates = localStorage.getItem("templates");
        const newTemplates = templates === null ? [] : JSON.parse(templates);
        // re-instanciacion
        const mappedTemplates = newTemplates.map(function (newTemplate) {
          return new Template(
            newTemplate.title,
            newTemplate.message,
            newTemplate.hashTag,
            newTemplate.link,
            newTemplate.date,
            newTemplate.favorite
          );
        });
        setState(mappedTemplates);
    }



    return {
      getState,
      setState,
      addTemplate,
      suscribe,
      initializeStore,
    };
  }
  
  const templatesStore = createStore([]);
  
  window.templatesStore = templatesStore;