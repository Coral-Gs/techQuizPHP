<?php

//EXAMEN DESARROLLO ENTORNO CLIENTE - CORAL GUTIÉRREZ SÁNCHEZ

//Programa PHP para acceder a la base de datos techquiz y verificar si existe o no un email dado

header("Content-Type: application/json; charset=UTF-8");

//Dato recibido por POST
$email = $_POST["email"];

//Datos de conexión
$servidor = '127.0.0.1';
$db = 'techquiz';
$usuario = 'root';
$pass = '';

try {
    //Creo un nuevo objeto de conexión PDO y los datos de conexión necesario para acceder a mi base de datos
    $conexion = new PDO('mysql:host=' . $servidor . ';dbname=' . $db, $usuario, $pass);
    //Le indico con el atributo ATTR_ERRMODE que si hay algún error en la conexión
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Creo sentencia SQL que solicita mostrar un registro con un determinado email
    $sql = 'SELECT * FROM user WHERE email=:email';

    //Preparo la consulta, uno parámetros y ejecuto
    $consulta = $conexion->prepare($sql);
    $consulta->bindParam(':email', $email);
    $consulta->execute();
    //Retorna el resultado de la consulta
    $resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);

    //Si existen resultados, devuelve TRUE
    if (count($resultados) > 0) {
        echo json_encode(true);
    } else {
        //De lo contrario devuelve FALSE
        echo json_encode(false);
    }

    //Capturo la excepción en caso de error y muestro el mensaje que me lanza
} catch (PDOException $error) {
    echo 'Error: ' . $error->getMessage();
} finally {
    //Cierro la conexión
    $conexion = null;
}
