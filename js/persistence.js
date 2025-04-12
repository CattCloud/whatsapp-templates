function saveTemplate(){
    localStorage.setItem(
        "templates",
        JSON.stringify(window.templatesStore.getState())
      );
    console.log("Se guardaron las plantillas en el LocalStorage");
}

function resetearPlantillas(){
    //Eliminar las plantillas del estado
    window.templatesStore.setState([]);
    //Limpia todo del localStorage
    localStorage.clear();
}