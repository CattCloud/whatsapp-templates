class Template {
    constructor(title, message, hashTag, link, date,favorite=false) {
      this.title = title;
      this.message = message;
      this.hashTag = hashTag;
      this.link = link;
      this.date = date;
      this.favorite=favorite;
      this.id=this.generateId();
      console.log(this.id);
    }
  
    

    // Método para generar un id único
    generateId() {
      return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }


    /*saveTemplate() {
      templates.push(this);
    }*/
  
    /*
    render() {
      const li = document.createElement("li"); // li
      li.classList.add("bg-white", "p-4", "my-3", "rounded"); // li class
  
      const h4 = document.createElement("h4");
      h4.classList.add("text-xl", "font-semibold");
      h4.textContent = this.title;
  
      const hr = document.createElement("hr");
      hr.classList.add("block", "my-3");
  
      const message = document.createElement("p");
      message.classList.add("text-md", "text-gray-500");
      message.textContent = this.message;
  
      //const hashTag = document.createElement("p");
      const arrayhashTag = this.hashTag.split(","); // Dividir por la coma
         
      const containerHashTags=document.createElement("div");
      containerHashTags.classList.add("flex","gap-2","text-sm", "text-white","text-semibold","m-1");

    
      arrayhashTag.forEach(hashTag => {
        const divHashTag = document.createElement("div");
        divHashTag.classList.add("bg-[#25d366]", "px-3", "py-1", "rounded-xl"); // Agregar las clases
        
        divHashTag.textContent = hashTag.trim(); // Eliminar espacios adicionales y agregar el texto
        containerHashTags.appendChild(divHashTag); // Agregar el div al contenedor
      });
      
        
      li.appendChild(h4);
      li.appendChild(hr);
      li.appendChild(message);
      li.appendChild(containerHashTags);
  
      templatesContainer.appendChild(li);
    }
    */
  }