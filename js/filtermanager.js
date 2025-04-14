class FilterManager {
  constructor(templates) {
    // Array original de plantillas
    this.templates = templates;
    
    // Array que se filtra y actualiza dinámicamente
    this.searchArray = [...templates];
    
    // Estado del botón "Solo favoritos"
    this.favorite = false;
    
    // Estado para identificar si al menos un filtro está aplicado
    this.state = false;
    
    // Configuración de los filtros disponibles
    this.filters = {
      title: '',      // Título para buscar (texto parcial)
      hashtags: [],   // Hashtags a buscar (array de strings)
      message: '',    // Mensaje a buscar (texto parcial)
    };
    
    /*
        this.filters = {
      date: null,     // Fecha seleccionada (a partir de esta fecha)
      title: '',      // Título para buscar (texto parcial)
      hashtags: [],   // Hashtags a buscar (array de strings)
      message: '',    // Mensaje a buscar (texto parcial)
    };
    
    */
    // Inicializar eventos si se proporcionan los IDs de los elementos
    this.initEvents();
  }

  
  //nicializa los eventos para los elementos de filtro en el DOM
  initEvents() {
    // Botón "Solo favoritos"
    const favButton = document.getElementById('btn-favorites');
    if (favButton) {
      favButton.addEventListener('click', () => this.toggleFavorite());
    }
    
    // Botón "Aplicar filtro"
    const applyFilterBtn = document.getElementById('apply-filter');
    if (applyFilterBtn) {
      applyFilterBtn.addEventListener('click', () => this.handleApplyFilter());
    }
    
    // Botón "Remover filtros"
    const resetFilterBtn = document.getElementById('reset-filter');
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => this.resetFilters());
    }
  }

  editIconFavorite(){
    const svgIcon = document.getElementById("icon-solo-favorite");
    if( this.favorite){
      svgIcon.setAttribute("stroke", "#FFD700"); // Cambiar color de stroke a amarillo
      svgIcon.setAttribute("fill", "#FFD700");   // Cambiar color de fill a amarillo (o "none" si quieres vacío)
    }else{
      svgIcon.setAttribute("stroke", "#8f8f8f"); // Cambiar color de stroke a gris
      svgIcon.setAttribute("fill", "none");   // Cambiar color de fill a"none" 
    }
  }

  //Alterna el estado del filtro "Solo favoritos"
  toggleFavorite() {
    this.favorite = !this.favorite;
    this.editIconFavorite();
    this.updateState();
    this.applyFilters();
    
    // Actualizar clase visual del botón (si existe)
    const favButton = document.getElementById('btn-favorites');
    if (favButton) {
      favButton.classList.toggle('active', this.favorite);
    }
  }


  /**
   * Establece el filtro de fecha (desde esa fecha en adelante)
   * @param {string|Date} date - Fecha a partir de la cual filtrar
   *   setDateFilter(date) {
    if (date) {
      // Convertir string a objeto Date si es necesario
      this.filters.date = date instanceof Date ? date : new Date(date);
    } else {
      this.filters.date = null;
    }
    this.updateState();
  }
   */


  /**
   * Establece el filtro de título
   * @param {string} title - Texto a buscar en los títulos
   */
  setTitleFilter(title) {
    this.filters.title = title ? title.trim() : '';
    this.updateState();
  }

  /**
   * Establece el filtro de hashtags
   * @param {string} hashtagsText - Texto con hashtags separados por comas
   */
  setHashtagsFilter(hashtagsText) {
    if (hashtagsText && hashtagsText.trim()) {
      // Dividir por comas y eliminar espacios extra
      this.filters.hashtags = hashtagsText
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
    } else {
      this.filters.hashtags = [];
    }
    this.updateState();
  }

  /**
   * Establece el filtro de mensaje
   * @param {string} message - Texto a buscar en los mensajes
   */
  setMessageFilter(message) {
    this.filters.message = message ? message.trim() : '';
    this.updateState();
  }

  
  //Actualiza el estado de los filtros (verifica si hay algún filtro activo)
  updateState() {
    this.state = this.favorite || 
                 this.filters.title !== '' || 
                 this.filters.hashtags.length > 0 || 
                 this.filters.message !== '';
                 
    // Actualizar visualmente el botón de resetear filtros (si existe)
    const resetButton = document.getElementById('reset-filter');
    if (resetButton) {
      resetButton.style.display = this.state ? 'block' : 'none';
    }
  }

  /**
   * Maneja el evento del botón "Aplicar filtro"
   */
  handleApplyFilter() {
    // Leer valores de los campos de filtro
    //const dateInput = document.getElementById('filter-date');
    const titleInput = document.getElementById('filter-title');
    const hashtagsInput = document.getElementById('filter-hashtags');
    const messageInput = document.getElementById('filter-message');
    
    // Actualizar filtros con los valores de los campos
    //if (dateInput) this.setDateFilter(dateInput.value);
    if (titleInput) this.setTitleFilter(titleInput.value);
    if (hashtagsInput) this.setHashtagsFilter(hashtagsInput.value);
    if (messageInput) this.setMessageFilter(messageInput.value);
    
    // Verificar si se aplicó algún filtro
    if (!this.state) {
      showNotification("error", "Error", "No se identificaron filtros");
      return;
    }
    
    // Aplicar los filtros
    this.applyFilters();
  }

  /**
   * Muestra un mensaje de error
   * @param {string} message - Mensaje de error a mostrar
   */
  showError(message) {
    alert(message); // Versión simple, podría ser reemplazada por un toast o notificación
  }

  
  //Resetea todos los filtros a sus valores predeterminados
  resetFilters() {
    this.favorite = false;
    this.filters = {
      title: '',
      hashtags: [],
      message: '',
    };
    
    // Limpiar los campos de entrada
    //const dateInput = document.getElementById('filter-date');
    const titleInput = document.getElementById('filter-title');
    const hashtagsInput = document.getElementById('filter-hashtags');
    const messageInput = document.getElementById('filter-message');
    
    //if (dateInput) dateInput.value = '';
    if (titleInput) titleInput.value = '';
    if (hashtagsInput) hashtagsInput.value = '';
    if (messageInput) messageInput.value = '';
    
    // Actualizar estado y aplicar filtros
    this.editIconFavorite();
    this.updateState();
    this.applyFilters();
    
    // Actualizar visualización del botón de favoritos
    const favButton = document.getElementById('btn-favorites');
    if (favButton) {
      favButton.classList.remove('active');
    }
  }

  
  //Método para aplicar todos los filtros y favoritos
  applyFilters() {
    // Comenzar con todas las plantillas
    let filtered = [...window.templatesStore.getState()];
    
    // Filtro por favoritos (si está activado)
    if (this.favorite) {
      filtered = filtered.filter(template => template.favorite);
    }
    
    // Filtro por fecha (desde la fecha seleccionada en adelante)
    /*if (this.filters.date) {
      const filterDate = new Date(this.filters.date);
      filterDate.setHours(0, 0, 0, 0); // Normalizar a inicio del día
      
      filtered = filtered.filter(template => {
        const templateDate = new Date(template.date);
        return templateDate >= filterDate;
      });
    }*/
    
    // Filtro por título
    if (this.filters.title) {
      const titleLower = this.filters.title.toLowerCase();
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(titleLower)
      );
    }
    
    // Filtro por hashtags (cualquiera de los hashtags especificados)
    if (this.filters.hashtags.length > 0) {
      filtered = filtered.filter(template => {
        // Si la plantilla no tiene hashtags, no coincide
        if (!template.hashTag) return false;
        
        const templateHashtags = template.hashTag
          .split(',')
          .map(tag => tag.trim().toLowerCase());
        
        // Verificar si alguno de los hashtags de filtro está en la plantilla
        return this.filters.hashtags.some(filterTag => 
          templateHashtags.includes(filterTag.toLowerCase())
        );
      });
    }
    
    // Filtro por mensaje
    if (this.filters.message) {
      const messageLower = this.filters.message.toLowerCase();
      filtered = filtered.filter(template => 
        template.message.toLowerCase().includes(messageLower)
      );
    }
    
    // Actualizar el array filtrado
    this.searchArray = filtered;
    console.log("Filtros aplicados:", this.searchArray);
    
    // Renderizar las plantillas (asumiendo que esta función está definida globalmente)
    if (typeof renderTemplates === 'function') {
      renderTemplates();
    }
  }
}