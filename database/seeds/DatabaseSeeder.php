<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);

        User::create([
            'name' => 'Usuario Root',
            'username' => 'root',
            'password' => Hash::make('root'),
            'email' => 'root@localhost',
            'is_superuser' => 1,
            'avatar' => '/assets/avatars/50-king.svg'
        ]);

        User::create([
            'name' => 'miguel angel aguilar espinosa',
            'username' => 'mike',
            'password' => Hash::make('12345'),
            'email' => 'mike@salud.com',
            'is_superuser' => 0,
            'avatar' => '/assets/avatars/50-king.svg'
        ]);

        User::create([
            'name' => 'Alejandro Gosain',
            'username' => 'alx',
            'password' => Hash::make('12345'),
            'email' => 'alejandro_gosain@hotmail.com',
            'is_superuser' => 1,
            'avatar' => '/assets/avatars/50-king.svg'
        ]);
        // $this->call(CatalogoJurisdiccionesSeeder::class);
        // $this->call(CatalogoCluesSeeder::class);
        
        //Carga de archivos CSV
        $lista_csv = [
            'jurisdicciones',
            'municipios',
            'localidades',
            'clues',
            'clue_user',
            'diagnosticos',
            'metodos_anticonceptivos',
            'estados_actuales',
            'metodos_gestacionales',
            'servicios',
            'afiliaciones',
            'permissions',
            'roles',
            'role_user',
            'permission_user',
            'permission_role',
            'condiciones_egresos',
            'motivos_egresos'
        ];

        //DB::beginTransaction();

        //DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        foreach($lista_csv as $csv){
            $archivo_csv = storage_path().'/app/seeds/'.$csv.'.csv';

            $query = sprintf("
                LOAD DATA local INFILE '%s' 
                INTO TABLE $csv 
                FIELDS TERMINATED BY ',' 
                OPTIONALLY ENCLOSED BY '\"' 
                ESCAPED BY '\"' 
                LINES TERMINATED BY '\\n' 
                IGNORE 1 LINES", addslashes($archivo_csv));
            echo $query;
            DB::connection()->getpdo()->exec($query);
        }
            
            //DB::statement('SET FOREIGN_KEY_CHECKS=1');

            //DB::commit();
    }
}
