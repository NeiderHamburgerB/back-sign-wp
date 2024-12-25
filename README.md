# Backend API WP

## Arquitectura y Organización del Proyecto

Este backend sigue **principios de arquitectura hexagonal**, pero adaptado a las necesidades del proyecto. No está todo completamente desacoplado, pero respeta los conceptos clave de esta arquitectura

El proyecto está organizado así:

- **`src`**: Carpeta principal con:
  - **`common`**: Componentes reutilizables como utilidades y configuraciones globales
  - **`config`**: Configuración del sistema (conexión a la base de datos, variables de entorno, etc.)
  - **`modules`**: Módulos por dominio (`customer`, `order`, `payment`, `product`) que incluyen:
    - **`controllers`**: Puertos de entrada para manejar las solicitudes HTTP
    - **`services`**: Donde está la lógica principal del negocio
    - **`repositories`**: Adaptadores que manejan las operaciones con la base de datos
    - **`entities`**: Modelos de datos
    - **`schema`**: Validaciones y esquemas para las solicitudes
  - **`tests`**: Pruebas unitarias para las capas principales

## Base de Datos y Despliegue

- **Base de datos**: Se usó **PostgreSQL** desplegada en **Amazon RDS**
- **Backend**: Desplegado en una instancia **EC2** de AWS usando **PM2**

## Pruebas Unitarias

Se hicieron pruebas unitarias para las capas principales:
- **`repositories`**: Validación de cómo se conecta y maneja la base de datos
- **`services`**: Verificación de la lógica de negocio
- **`controllers`**: Pruebas para asegurar que las solicitudes HTTP funcionan correctamente

## Enfoque de Desarrollo

Se trabajó con estos principios clave:
- **Lógica central desacoplada**: La lógica está en los **servicios**, sin depender de detalles técnicos como la base de datos
- **Repositorios como adaptadores**: Los **repositorios** encapsulan todo lo relacionado con la base de datos
- **Pragmatismo**: Aunque se usaron principios hexagonales, se adaptó para que el desarrollo fuera más ágil y funcional

## Modelo

El diseño del modelo está en el archivo adjunto, que explica la estructura y relaciones de las entidades principales:  
[Modelo del Proyecto](Model.pdf)

## Limitaciones y Decisiones

- Solo se implementaron los endpoints necesarios para el proyecto, así que no todos los CRUDs están completos
- El enfoque fue cubrir lo necesario, dando prioridad a la modularidad y mantenibilidad

## Documentación y Acceso

La documentación del backend está disponible aquí:  
[Documentación Swagger](https://34.234.71.55/api/main/docs)

---

Este proyecto aplica principios de arquitectura hexagonal con un enfoque práctico, diseñado para cumplir los objetivos del proyecto de forma eficiente y clara
