class FilterManager {
    constructor(templates) {
      this.templates = templates; // Array original de plantillas
      this.searchArray = [...templates]; // Array que se filtra y actualiza dinámicamente
      this.favorite = false; // Estado del botón "Solo favoritos"
      this.state=false; // Para identificar si al menos un filtro esta aplicado
    }
  
    // Método para alternar el estado de "Solo favoritos"
    toggleFavorite() {
      this.favorite = !this.favorite;
      this.applyFilters();
    }
  
    getState(){
      //Si esta seleccionado el boton de favorito entocnes ahi un filtro aplicado
      if(this.favorite){
         this.state=true; 
      }
      else{
        this.state=false;
      }
    }


    // Método para aplicar todos los filtros y favoritos
    applyFilters() {
      this.getState();
      let filtered = [...this.templates];
  
      console.log("Array:", filtered);

      // Filtro por favoritos (si está activado)
      if (this.favorite) {
        filtered = filtered.filter(template => template.favorite);
      }
      

      // Actualizar el array filtrado
      this.searchArray = filtered;
      console.log("Filtros aplicados:", this.searchArray);
      renderTemplates();
    }
  }