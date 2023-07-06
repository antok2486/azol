<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\mp\Mpprod;
use App\Models\mp\Mpprog;

class MpController extends Controller
{
    function delete(Request $request)
    {
        $path = explode('/', $request->path());
        $model = app('App\Models\mp\\' . ucfirst($path[1]));

        DB::beginTransaction();

        try {
            $model::where('id', '=', $request['id'])
                ->update([
                    'is_aktif' => 0,
                    'user_update' => $request->user()->email
                ]);
            DB::commit();

            return response()->json(array('status' => 200));
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json(array('status' => 501, 'message' => $e->getMessage() . ' at ' . $e->getFile() . ' line: ' . $e->getLine()));
        } catch (\Throwable $e) {
            DB::rollback();

            return response()->json(array('status' => 502, 'message' => $e->getMessage() . ' at ' . $e->getFile() . ' line: ' . $e->getLine()));
        }
    }

    function get(Request $request)
    {
        $path = explode('/', $request->path());
        $method_name = 'get_' . $path[1];

        return $this->$method_name($request);
    }

    function put(Request $request)
    {
        $path = explode('/', $request->path());
        $method_name = 'put_' . $path[1];

        DB::beginTransaction();

        try {
            $this->$method_name($request);

            DB::commit();

            return response()->json(array('status' => 200));
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json(array('status' => 501, 'message' => $e->getMessage() . ' at ' . $e->getFile() . ' line: ' . $e->getLine()));
        } catch (\Throwable $e) {
            DB::rollback();

            return response()->json(array('status' => 502, 'message' => $e->getMessage() . ' at ' . $e->getFile() . ' line: ' . $e->getLine()));
        }
    }

    function get_mpprod(Request $request)
    {
        $id = '%';
        if (isset($request['id'])) {
            $id = $request['id'];
        }

        $page = 0;
        $limit = 1000;
        if (isset($request['page'])) {
            $page = $request['page'] * 20;
            $limit = 20;
        }

        $filter = '%';
        if (isset($request['filter']) && $request['filter'] != '') {
            $filter = $request['filter'];
        }

        $res = DB::table('mpprod')
            ->select('*')
            ->whereRaw("cast(id as char) like '" . $id . "' and nama like '%".$filter."%' ")
            ->orderBy('id', 'desc')
            ->offset($page)
            ->limit($limit)
            ->get();
        
        $res_mpprog = DB::table('mpprog')
            ->select('*')
            ->where('id_produk', '=', $request['id'])
            // ->whereRaw("cast(id as char) like '" . $id . "'")
            ->orderBy('qty_min', 'asc')
            ->get();

        return response()->json(array('status' => 200, 'mpprod' => $res, 'mpprog' => $res_mpprog));
    }

    function put_mpprod(Request $request)
    {
        $req_mpprod = $request['mpprod'];
        $req_mpprog = $request['mpprog'];

        # update or insert mpprod
        if (!isset($req_mpprod['id']) || $req_mpprod['id'] == '' || !isset($req_mpprod['id'])) {    #=> insert
            $req_mpprod['id'] = Mpprod::get_id();

            Mpprod::insert($req_mpprod);
        } else {  #=> update
            Mpprod::where('id', '=', $req_mpprod['id'])
                ->update($req_mpprod);
        }

        # update or insert mpprog
        for ($i = 0; $i < count($req_mpprog); $i++) {
            Mpprog::upsert(
                [
                    'id_produk' => $req_mpprod['id'],
                    'qty_min' => $req_mpprog[$i]['qty_min'],
                    'hrg_jual1' => $req_mpprog[$i]['hrg_jual1'],
                    'hrg_jual2' => $req_mpprog[$i]['hrg_jual2'],
                ],
                [
                    'hrg_jual1' => $req_mpprog[$i]['hrg_jual1'],
                    'hrg_jual2' => $req_mpprog[$i]['hrg_jual2'],
                ]
            );
        }
    }
}
