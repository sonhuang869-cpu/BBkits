<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidMaterialUnit implements ValidationRule
{
    /**
     * Valid units organized by type
     */
    public static function getValidUnits(): array
    {
        return [
            'weight' => ['g', 'kg', 't'],
            'volume' => ['ml', 'l', 'm³'],
            'length' => ['mm', 'cm', 'm', 'km'],
            'area' => ['cm²', 'm²'],
            'count' => ['un', 'pç', 'par', 'dz', 'cx'],
            'time' => ['h', 'dia', 'sem', 'mês'],
        ];
    }

    /**
     * Get all valid units as flat array
     */
    public static function getAllValidUnits(): array
    {
        return collect(self::getValidUnits())->flatten()->toArray();
    }

    /**
     * Get unit type
     */
    public static function getUnitType(string $unit): ?string
    {
        foreach (self::getValidUnits() as $type => $units) {
            if (in_array($unit, $units)) {
                return $type;
            }
        }
        return null;
    }

    /**
     * Check if unit conversion is possible between two units
     */
    public static function canConvert(string $fromUnit, string $toUnit): bool
    {
        $fromType = self::getUnitType($fromUnit);
        $toType = self::getUnitType($toUnit);

        return $fromType && $toType && $fromType === $toType;
    }

    /**
     * Get conversion factor between units (simplified)
     */
    public static function getConversionFactor(string $fromUnit, string $toUnit): ?float
    {
        if (!self::canConvert($fromUnit, $toUnit)) {
            return null;
        }

        $conversions = [
            // Weight conversions to grams
            'g' => 1,
            'kg' => 1000,
            't' => 1000000,

            // Volume conversions to ml
            'ml' => 1,
            'l' => 1000,
            'm³' => 1000000,

            // Length conversions to mm
            'mm' => 1,
            'cm' => 10,
            'm' => 1000,
            'km' => 1000000,

            // Area conversions to cm²
            'cm²' => 1,
            'm²' => 10000,

            // Count (no conversion)
            'un' => 1,
            'pç' => 1,
            'par' => 2,
            'dz' => 12,
            'cx' => 1,

            // Time conversions to hours
            'h' => 1,
            'dia' => 24,
            'sem' => 168,
            'mês' => 720,
        ];

        if (!isset($conversions[$fromUnit]) || !isset($conversions[$toUnit])) {
            return null;
        }

        return $conversions[$toUnit] / $conversions[$fromUnit];
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!in_array($value, self::getAllValidUnits())) {
            $validUnits = implode(', ', self::getAllValidUnits());
            $fail("O campo {$attribute} deve ser uma unidade válida. Unidades válidas: {$validUnits}");
        }
    }
}