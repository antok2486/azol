<?php

namespace App\Http\Controllers\sy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\sy\Syuser;
Use Illuminate\Support\Facades\Auth;
Use Illuminate\Support\Facades\DB;

class SyuserController extends Controller
{
    function login(Request $request){
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ],
        [
            'email.required' => 'Email / No. HP tidak boleh kosong',
            'password.required' => 'Password tidak boleh kosong',
        ]
        );

        //cek jika sudah login
        if(Auth::check()){
            return response()->json(array(
                'status' => 401,
                'message' => 'User sudah login'
            ));    
        }

        $email = $request['email'];
        $password = $request['password'];

        if (!Auth::attempt(['email' => $email, 'password' => $password, 'is_aktif' => 1])) {
            return response()->json(array(
                'status' => 401, 
                'errors' => array(
                    'email' => array('Login gagal'), 
                    'password' => array('Cek email dan password anda')
            )));
        }

        $user = Auth::user();
        $token = $user->createToken('token_name')->plainTextToken;

        return response()->json(array(
            'status' => 200,
            'token' => $token,
            'user' => $user
        ));

    }
}
