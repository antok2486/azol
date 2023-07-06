<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\tr\Trpurd;
use App\Models\tr\Trpurh;
use App\Models\tr\Trsald;
use App\Models\tr\Trsalh;

class TrController extends Controller
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

    function get_trpurc(Request $request)
    {
        $page = 0;
        $limit = 1000;
        if (isset($request['page'])) {
            $page = $request['page'] * 20;
            $limit = 20;
        }

        $res = DB::table('v_trpurc')
            ->select('*')
            ->orderBy('id','desc')
            ->offset($page)
            ->limit($limit)
            ->get();

        // get details
        for($i=0; $i < count($res); $i++){
            $id = $res[$i]->id;

            $res_detail = DB::table('trpurd')
                ->leftJoin('mpprod', 'trpurd.id_produk', '=', 'mpprod.id')
                ->select('trpurd.*', 'mpprod.nama as nama_produk')
                ->where('trpurd.id_purchase', '=', $id)
                ->get();

            // $res[$i]->put('detail', $res_detail);   
            $res[$i]->detail = $res_detail;

        }

        return response()->json(array('status' => 200, 'trpurc' => $res));
    }

    function get_trsale(Request $request)
    {
        $page = 0;
        $limit = 1000;
        if (isset($request['page'])) {
            $page = $request['page'] * 20;
            $limit = 20;
        }

        $res = DB::table('v_trsalh')
            ->select('*')
            // ->whereRaw("cast(id as char) like '" . $id . "' and nama like '%" . $filter . "%' ")
            // ->orderBy('id', 'desc')
            ->offset($page)
            ->limit($limit)
            ->get();

        // get details
        for($i=0; $i < count($res); $i++){
            $id = $res[$i]->id;

            $res_detail = DB::table('trsald')
                ->leftJoin('mpprod', 'trsald.id_produk', '=', 'mpprod.id')
                ->select('trsald.*', 'mpprod.nama as nama_produk')
                ->where('trsald.id_sale', '=', $id)
                ->get();

            // $res[$i]->put('detail', $res_detail);   
            $res[$i]->detail = $res_detail;

        }

        return response()->json(array('status' => 200, 'trsale' => $res));
    }

    //isi saldo mitra shopee
    function put_trpurd(Request $request){
        $nominal = $request['trpurd']['nominal'];
        $hrg_beli = $request['trpurd']['hrg_beli'];

        $id = Trpurh::get_id();

        Trpurh::insert([
            'id' => $id,
            'no_nota' => '-',
            'keterangan' => 'SALDO MITRA SHOPEE',
        ]);

        Trpurd::insert([
            'id_purchase' => $id,
            'id_produk' => 0,
            'qty' => $nominal,
            'hrg' => ($hrg_beli / $nominal),
            'hrg_beli' => ($hrg_beli / $nominal)
        ]);
    }

    //isi saldo iklan
    function put_trpuri(Request $request){
        $nominal = $request['trpurd']['nominal'];
        $keterangan = $request['trpurd']['keterangan'];

        $id = Trpurh::get_id();

        Trpurh::insert([
            'id' => $id,
            'no_nota' => $keterangan,
            'keterangan' => 'SALDO IKLAN',
        ]);

        Trpurd::insert([
            'id_purchase' => $id,
            'id_produk' => -1,
            'qty' => 1,
            'hrg' => $nominal,
            'hrg_beli' => $nominal
        ]);
    }

    function put_trpurc(Request $request){
        $req_trpurh = $request['trpurh'];
        $req_trpurd = $request['trpurd'];

        $id = Trpurh::get_id();

        Trpurh::insert([
            'id' => $id,
            'no_nota' => $req_trpurh['no_nota'],
            'keterangan' => $req_trpurh['keterangan'],
        ]);

        for ($i = 0; $i < count($req_trpurd); $i++) {
            Trpurd::insert([
                'id_purchase' => $id,
                'id_produk' => $req_trpurd[$i]['id_produk'],
                'qty' => $req_trpurd[$i]['qty'],
                'hrg' => $req_trpurd[$i]['hrg'],
                'disc' => $req_trpurd[$i]['disc'],
                'hrg_beli' => $req_trpurd[$i]['hrg_beli'],
            ]);
        }
    }

    function put_trsale(Request $request)
    {
        $req_trsalh = $request['trsalh'];
        $req_trsald = $request['trsald'];

        $id = Trsalh::get_id();

        Trsalh::insert([
            'id' => $id,
            'flag_harga' => ($req_trsalh['flag_harga'] +1),
            'keterangan' => $req_trsalh['keterangan'],
        ]);

        for ($i = 0; $i < count($req_trsald); $i++) {
            Trsald::insert([
                'id_sale' => $id,
                'id_produk' => $req_trsald[$i]['id_produk'],
                'qty' => $req_trsald[$i]['qty'],
                'hrg_beli' => $req_trsald[$i]['hrg_beli'],
                'hrg_jual' => $req_trsald[$i]['hrg_jual'],
                'disc' => $req_trsald[$i]['disc'],
            ]);
        }
    }

    function put_trsalp(Request $request){
        $keterangan = $request['trsalp']['keterangan'];
        $nominal = $request['trsalp']['nominal'];
        $hrg_beli = $request['trsalp']['hrg_beli'];
        $hrg_jual = $request['trsalp']['hrg_jual'];

        $id = Trsalh::get_id();

        Trsalh::insert([
            'id' => $id,
            'keterangan' => $keterangan .' Nominal: ' .number_format($nominal,0,'.',','),
        ]);


        Trsald::insert([
            'id_sale' => $id,
            'id_produk' => 0,
            'qty' => $hrg_beli,
            'hrg_beli' => 1,
            'hrg_jual' => ($hrg_jual / $hrg_beli)
        ]);
    }
}
