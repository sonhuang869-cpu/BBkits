<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMaterialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->canEditMaterials();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'external_id' => 'nullable|string|max:50|unique:materials',
            'name' => 'required|string|max:255',
            'reference' => 'required|string|max:100|unique:materials',
            'description' => 'nullable|string|max:1000',
            'unit' => 'required|string|max:50',
            'current_stock' => 'required|numeric|min:0',
            'minimum_stock' => 'required|numeric|min:0',
            'purchase_price' => 'required|numeric|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'external_id.unique' => 'A material with this external ID already exists.',
            'reference.unique' => 'A material with this reference already exists.',
            'supplier_id.exists' => 'The selected supplier does not exist.',
            'current_stock.min' => 'Current stock cannot be negative.',
            'minimum_stock.min' => 'Minimum stock cannot be negative.',
            'purchase_price.min' => 'Purchase price cannot be negative.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'You do not have permission to create materials.',
                'error' => 'insufficient_permissions'
            ], 403)
        );
    }
}