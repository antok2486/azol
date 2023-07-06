<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UtController extends Controller
{
    function get(Request $request)
    {
        $path = explode('/', $request->path());
        $method_name = 'get_' . $path[1];

        try {
            return $this->$method_name($request);
        } catch (\Exception $e) {
            return response()->json(array('status' => 501, 'message' => $e->getMessage() . ' at ' . $e->getFile() . ' line: ' . $e->getLine()));
        } catch (\Throwable $e) {
            return response()->json(array('status' => 502, 'message' => $e->getMessage() . ' at ' . $e->getFile() . ' line: ' . $e->getLine()));
        }
    }

    function get_utdailysales(Request $request)
    {
        $res = DB::table('v_dailysales')
            ->select('*')
            ->get();

        $labels = array();
        $data = array();

        for ($i = 0; $i < count($res); $i++) {
            $labels[$i] =  $res[$i]->label;
            $data[$i] =  $res[$i]->val;
        }

        if(count($res) == 0){
            $labels[0] = 0;
            $data[0] = 0;
        }

        return response()->json(array('status' => 200, 'dailysales' => array('labels' => $labels, 'data' => $data)));
    }

    function get_utresm(Request $request)
    {
        $res = DB::table('v_resume')
            ->select('*')
            ->get();
        // return response()->json(array('status' => 200, 'resume' => array('totJual' => $res[0]->tot_jual, 'totBeli' => $res[0]->tot_beli, 'totInv' => $res[0]->tot_inv, 'totProfit' => $res[0]->tot_profit)));
        return response()->json(array('status' => 200, 'resume' => $res[0]));
    }

    function get_uttopproduct(Request $request)
    {
        $res = DB::table('v_topproduct')
            ->select('*')
            ->get();

        return response()->json(array('status' => 200, 'topProduct' => $res));
    }
}
