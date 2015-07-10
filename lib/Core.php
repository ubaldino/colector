<?php

namespace lib;

use lib\Config;
use PDO;

class Core {
    public $dbh; // handle of the db connexion
    private static $instance;

    private function __construct() {
        // building data source name from config
        /*
        MYSQL
        $dsn = 'mysql:host=' . Config::read('db.host') .
               ';dbname='    . Config::read('db.basename') .
               ';port='      . Config::read('db.port') .
               ';connect_timeout=15';
        // getting DB user from config                
        $user = Config::read('db.user');
        // getting DB password from config                
        $password = Config::read('db.password');

        $this->dbh = new PDO($dsn, $user, $password);

        define( 'DS', DIRECTORY_SEPARATOR );
        */

        $dir = 'sqlite:..' . DS . 'db.sqlite3';
        $this->dbh  = new PDO( $dir ) or die("cannot open the database");
        /*
        $query =  "SELECT * FROM combo_calcs WHERE options='easy'";
        foreach ($dbh->query($query) as $row)
        {
            echo $row[0];
        }
        */
    }

    public static function getInstance() {
        if (!isset(self::$instance))
        {
            $object = __CLASS__;
            self::$instance = new $object;
        }
        return self::$instance;
    }
    
    // others global functions
}