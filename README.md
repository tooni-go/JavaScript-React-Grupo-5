# JavaScript-React-Grupo-5
Integrantes: Antonio Gómez, Facundo Naveira, Leandro Caraballo.

                                                                                              Pagina del Poli: "Mapa Interactivo"

##Descripción Fachera

Idea principal: Queremos hacer un mapa interactivo para nuestro poli que al tocar cada aula te diga información sobre clases, profesores, horarios. También está la opción de iniciar sesión y que el mapa ofrezca información de las clases de quien inicia sesión. Queremos dividir el mapa en opciones, las cuales te permiten ver cada piso y su correspondiente plano (2D), que cada aula tenga un Boton que te permita ver una imagen del aula real y su informacion de cursado.

Ejemplo de posible “Diagrama de flujo principal” (utilizando inicio de sesión):

Evento (Frontend): El usuario hace clic en el aula con id="aula-101".
Petición (Request): React envía una señal al servidor diciendo: "Hola, soy el usuario X, dame la info del aula-101".
Procesamiento (Backend): El servidor recibe la petición, verifica que el usuario tenga permiso y traduce el pedido para la base de datos.
Consulta (Query): El servidor le pregunta a la base de datos: SELECT * FROM clases WHERE aula_id = '101'.
Respuesta de Datos: La base de datos devuelve los nombres de la materia, el profesor y la hora.
Entrega (Response): El servidor le envía esos datos a React en un paquete (JSON).
Renderizado: React recibe los datos, actualiza su "estado" y dibuja el cartelito (Pop-up) en la pantalla.

¿Cómo hacemos los planos?

Utilizamos una foto de los planos que están por la escuela. Usamos Figma para dibujar rectángulos sobre la foto del plano de evacuación. Mientras dibujamos cada aula, le ponemos un nombre claro a la capa. Cuando exportemos el SVG, ese nombre se va a convertir en un id en el código. Así, en React vamos a poder decir: "Cuando hagan clic en el elemento con id 'aula-101'..." y que ahí muestre la información.
Habría que hacer un plano por cada piso y agregar un botón para ir de un piso a otro

¿Quienes serían nuestros usuarios?, ¿Como lo vamos a promocionar?, ¿Cuantas horas estimamos?, ¿Como lo vamos a monetizar?

-R: Nuestros herramienta puede ser útil para todos las personas relacionadas al poli, pero hace foco en alumnos o profesores nuevos del poli, que todavía no tienen muy claro la estructura del colegio y a donde ir.

-R: Si nos dan permiso, podemos pegar folletos con un QR a la página por el poli y si es posible llegar a integrarla con el portal de poli.

-R: Tal vez entre 15 y 20 horas?

-R: La pagina no tendría monetización.
