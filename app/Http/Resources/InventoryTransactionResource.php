<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryTransactionResource extends JsonResource
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
            'material_id' => $this->material_id,
            'type' => $this->type,
            'type_display' => $this->getTypeDisplay(),
            'quantity' => (float) $this->quantity,
            'notes' => $this->notes,
            'reference' => $this->reference,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'material' => new MaterialResource($this->whenLoaded('material')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get type display name
     */
    private function getTypeDisplay(): string
    {
        return match($this->type) {
            'purchase' => 'Compra',
            'consumption' => 'Consumo',
            'adjustment' => 'Ajuste',
            'return' => 'Devolução',
            default => ucfirst($this->type),
        };
    }
}
