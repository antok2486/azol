<?php

namespace App\Models\tr;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Trpurh extends Model
{
    protected $table='trpurh';
    use HasFactory;

    static function get_id(){
        $next_id = DB::select("select (ifnull(max(id), 0) +1) as nextval from trpurh");
        return intval($next_id['0']->nextval);

    }

}
