<?php

namespace App\Models\mp;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Mpprod extends Model
{
    protected $table='mpprod';
    use HasFactory;

    static function get_id(){
        $next_id = DB::select("select (ifnull(max(id), 0) +1) as nextval from mpprod");
        return intval($next_id['0']->nextval);

    }
}
