# Plataforma Smart Campus UIS - CORE

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Repositorio con las versiones de prueba para el core de la plataforma Smart Campus UIS, el sistema actual despliega los siguientes contenedores: 

### Bases de datos

- **MONGODB**: Base de datos documental para almacenamiento de los datos o mensajes enviados por los dispositivos, solo es accesible por el servicio de datos.

- **POSTGRESQL**: Base de datos relacional para almacenar los datos de administración de la arquitectura tales cómo modelos y dispositivos con sus respectivas propiedades, aplicaciones, usuarios etc.


### Servicios

- **ADMIN MICROSERVICES**: Microservicio programado en JAVA-17/SpringBoot-3 que se encarga de la gestión de datos que representan la infraestructura IoT desplegada, permite administrar modelos, dispositivos y sus propiedades así cómo aplicación, realizar las asociaciones permitidas, crear y acceder mediante usuarios.

- **DATA MICROSERVICES**: Microservicio programado en JAVA-17/SpringBoot-3 que se suscribe al tópico **device_messages** los mensajes que se reciben por este tópico son almacenados en base de datos, también expone una API-EndPoint que permite consultar los mensajes enviados por un dispositivo dado su ID, la URL de este EndPoint debería ser algo cómo: *HOST_BASE_URL/data//deviceMessage/{ID_DEVICE}*


### Comunicación

- **ECLIPSE MOSQUITTO**: Broker MQTT que permite él envío de mensajes hacía el servicio de datos, expone el puerto 1883, el tópico para envío de datos desde los dispositivos es **device_messages**.

- **GoGateway**: Un Gateway de pruebas liviano programado en Go que permite la comunicación hacía los microservicios, se expone en el puerto 8080 del HOST.

### Frontend 
- **REACT ADMIN FRONTEND**: Un sencillo pero funcional frontend creado para gestionar la infraestructura, permite visualizar algunas estadísticas de sistema, se expone en el puerto 4000 del HOST. 


## Formato de los mensajes

Los mensajes deben ser enviados al broker usando el tópico **device_messages**, estos mensajes deben estar en formato JSON y contener los siguientes atributos "respetar el nombre de los atributos para el correcto funcionamiento":

- **userUUID**: Es el identificador único universal de cada usuario, asignado por la plataforma al momento de registrarse, por el momento puede enviarse un String con el valor que se requiera, a futuro se validará con el microservicio de administración. 

- **deviceId**: Es el identificador asignado al dispositivo cuando es registrado en la plataforma. 

- **topic**: Es el tópico del mensaje, por ejemplo, humedad, temperatura, nivelCO2.

- **timeStamp**: Es la fecha y hora de generación del dato, acepta formato de envío  DD-MM--YY HH:MM:SS, ejemplo, "14-03-2023 12:42:57".

- **values**: El valor o los valores enviados por los sensores en formato de objeto JSON, ejemplo, un mensaje puede ser {"temperatura":25}, otro ejemplo puede ser {"Oxigeno":95, "CO2":22,"Lugar":"RUTA P8"}. 



## Despliegue

El despliegue se debe realizar mediante Docker-Compose una vez descargado el repositorio se puede desplegar con el comando "docker-compose up -d" en la carpeta raíz del proyecto, aspectos de comunicación a tener en cuenta se describen a continuación: 

### Métodos de envío de mensajes

Actualmente están configurados los siguientes métodos para el envío de mensajes:
- **MQTT**: se pueden publicar mensajes desde dispositivos en la plataforma mediante el tópico *device_messages* siguiendo el formato de los mensajes especificado anteriormente.



## Authors

- [@HenryJimenez](https://github.com/Han253)
- [@GabrielPedraza](https://github.com/chaphe)
- [@Jathinson](https://github.com/jathinson)
- [@Carlos](https://github.com/Pholluxion)
