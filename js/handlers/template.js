const template1 = new Template(
    "Bienvenida",
    "Hola que tal, mi nombre es Erick",
    "#hash1,#hash2",
    "link1",
    "date1"
  );
  
  template1.saveTemplate();
  template1.render();

  const template2 = new Template(
    "Welcome",
    "I am Xiomara, My brother is Erick",
    "#hash1,#english",
    "link2",
    "date2"
  );
  
  template2.saveTemplate();
  template2.render();
  