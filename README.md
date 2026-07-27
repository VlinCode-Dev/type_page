# vlincode typer

Aplicacion web para practicar velocidad de escritura en espanol. Tema oscuro minimalista con teclado virtual interactivo.

## Caracteristicas

- **3 modos de prueba:** Tiempo (15s, 60s, 120s), Palabras y Cita aleatoria
- **Estadisticas en tiempo real:** PPM (palabras por minuto) y precision
- **Teclado virtual QWERTY latino** con Ñ, shift y mayusculas
- **Retroalazco visual:** tecla verde si es correcta, roja si es incorrecta
- **Scroll inteligente:** el texto se desplaza manteniendo la linea actual centrada
- **Modal de resultados** al finalizar el test con PPM y precision
- **Modal informativo** con categorias de velocidad (Principiante a Profesional)
- **Diseno responsive** para movil y escritorio

## Paleta de colores

| Color                 | Hex       | Uso                                     |
| --------------------- | --------- | --------------------------------------- |
| Background            | `#131313` | Fondo principal                         |
| Primary               | `#f2be8c` | Titulo, tiempo, botones, link footer    |
| Secondary             | `#ffb781` | Precision                               |
| Tertiary              | `#c1ce91` | PPM                                     |
| On Background         | `#e5e2e1` | Texto principal                         |
| On Surface Variant    | `#d4c4b7` | Texto secundario, etiquetas             |
| Surface Container Low | `#1c1b1b` | Barra de configuracion, footer, teclado |
| Surface Container     | `#20201f` | Botones info/reiniciar, modal           |
| Surface Variant       | `#353535` | Bordes                                  |
| Outline Variant       | `#50453b` | Bordes sutiles, teclas                  |
| Primary Fixed         | `#ffdcbd` | Hover de botones                        |
| Key Correct           | `#97C459` | Tecla presionada correctamente          |
| Key Wrong             | `#E24B4A` | Tecla presionada incorrectamente        |

## Fuentes

- **JetBrains Mono** — teclado, estadisticas, codigo
- **Inter** — cuerpo de texto, botones, modales

## Estructura

```
prototipo/
  index.html        # Markup principal
  css/style.css     # Estilos custom (teclado, modales, scroll)
  js/app.js         # Logica de typing, teclado virtual, modos
```

## Ejecutar

```bash
python3 -m http.server 8080 --bind 0.0.0.0 -d prototipo
```

Abrir `http://localhost:8080`

## Desarrollado por

[vlincode](https://vlincode.com/)
