<?php

require '../vendor/autoload.php';
require '../config.php';

// Setup custom Twig view
$twigView = new \Slim\Views\Twig();

$app = new \Slim\Slim(array(
    'debug' => true,
    'view' => $twigView,
    'templates.path' => '../templates/',
));


// GET route
$app->get('/', function () use ($app)
{
    $app->render('home.php');
});


// Automatically load router files
$routers = glob('../routers/*.router.php');

foreach ($routers as $router) {
    require $router;
}

$app->run();
