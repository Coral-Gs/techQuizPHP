<?php
header("Content-Type: application/json; charset=UTF-8");

$nombre = $_POST["nombre"];
$email = $_POST["email"];
$score = $_POST["score"];
$phone = $_POST["phone"];
$date = $_POST["date"];

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

    //Creo sentencia SQL que solicita todos los registros ordenados por score de mayor a menor
    $sql = 'INSERT INTO user(name, email, date, score, phone) VALUES(:name,:email,:date,:score,:phone)';

    //Preparo la consulta, uno parámetros y ejecuto
    $consulta = $conexion->prepare($sql);
    //Uno parámetros
    $consulta->bindParam(':name', $nombre);
    $consulta->bindParam(':email', $email);
    $consulta->bindParam(':date', $date);
    $consulta->bindParam(':score', $score);
    $consulta->bindParam(':phone', $phone);


    //Ejecuto la consulta
    $consulta->execute();

    //Capturo la excepción en caso de error y muestro el mensaje que me lanza
} catch (PDOException $error) {
    echo 'Error: ' . $error->getMessage();
} finally {
    //Cierro la conexión
    $conexion = null;
}
