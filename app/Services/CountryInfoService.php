<?php

namespace App\Services;

use SoapClient;
use Exception;

class CountryInfoService
{
    private string $wsdl = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';
    private SoapClient $client;

    public function __construct()
    {
        try {
            $this->client = new SoapClient($this->wsdl, [
                'trace' => true,
                'exceptions' => true,
            ]);
        } catch (Exception $e) {
            throw new Exception('Error al conectar con el servicio SOAP: ' . $e->getMessage());
        }
    }

    /**
     * Obtiene la lista de paises ordenados por nombre
     * Retorna un array con ['iso' => 'AR', 'name' => 'Argentina']
     */
    public function getCountries(): array
    {
        try {
            $response = $this->client->ListOfCountryNamesByName();
            $countries = $response->ListOfCountryNamesByNameResult->tCountryCodeAndName ?? [];

            $result = [];
            foreach ($countries as $country) {
                $result[] = [
                    'iso' => $country->sISOCode,
                    'name' => $country->sName,
                ];
            }

            return $result;
        } catch (Exception $e) {
            throw new Exception('Error al obtener la lista de países: ' . $e->getMessage());
        }
    }
}
