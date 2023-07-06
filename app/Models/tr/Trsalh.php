<?php

namespace App\Models\tr;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Trsalh extends Model
{
    protected $table='trsalh';
    use HasFactory;

    static function get_id(){
        $next_id = DB::select("select (ifnull(max(id), 0) +1) as nextval from trsalh");
        return intval($next_id['0']->nextval);

    }

}
