<?php

namespace App\Http\Controllers;

use App\Services\CountryInfoService;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $service = new CountryInfoService();
            $countries = $service->getCountries();
            return response()->json($countries);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudo obtener la lista de países', 'message' => $e->getMessage()], 500);
        }
    }
}
