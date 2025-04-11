function guardarPlantillas(){
    localStorage.setItem(
        "templates",
        JSON.stringify(window.templatesStore.getState())
      );
}

function resetearPlantillas(){
    //Eliminar las plantillas del estado
    window.templatesStore.setState([]);
    //Limpia todo del localStorage
    localStorage.clear();
}