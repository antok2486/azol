<?php

namespace App\Models\sy;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Syuser extends Authenticatable
{
    protected $table = 'syuser';

    use HasApiTokens, HasFactory, Notifiable;
}
