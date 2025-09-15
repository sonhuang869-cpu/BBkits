<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaterialResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'external_id' => $this->external_id,
            'name' => $this->name,
            'reference' => $this->reference,
            'description' => $this->description,
            'unit' => $this->unit,
            'current_stock' => (float) $this->current_stock,
            'minimum_stock' => (float) $this->minimum_stock,
            'purchase_price' => (float) $this->purchase_price,
            'is_low_stock' => $this->is_low_stock,
            'stock_status' => $this->getStockStatus(),
            'stock_value' => (float) ($this->current_stock * $this->purchase_price),
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'recent_transactions' => InventoryTransactionResource::collection($this->whenLoaded('inventoryTransactions')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'api_version' => config('api.version'),
                'timestamp' => now()->toISOString(),
            ],
        ];
    }

    /**
     * Get stock status text
     */
    private function getStockStatus(): string
    {
        if ($this->current_stock <= 0) {
            return 'out_of_stock';
        } elseif ($this->current_stock <= $this->minimum_stock) {
            return 'low_stock';
        }
        return 'in_stock';
    }
}
