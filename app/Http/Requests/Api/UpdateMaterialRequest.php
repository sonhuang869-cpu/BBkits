<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateMaterialRequest extends FormRequest
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
        $materialId = $this->route('material')?->id ?? $this->route('material');

        return [
            'external_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('materials')->ignore($materialId)
            ],
            'name' => 'required|string|max:255',
            'reference' => [
                'required',
                'string',
                'max:100',
                Rule::unique('materials')->ignore($materialId)
            ],
            'description' => 'nullable|string|max:1000',
            'unit' => 'required|string|max:50',
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
            'external_id.unique' => 'Já existe um material com este ID externo.',
            'reference.unique' => 'Já existe um material com esta referência.',
            'supplier_id.exists' => 'O fornecedor selecionado não existe.',
            'minimum_stock.min' => 'O estoque mínimo não pode ser negativo.',
            'purchase_price.min' => 'O preço de compra não pode ser negativo.',
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
                'message' => 'Falha na validação',
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
                'message' => 'Você não tem permissão para atualizar materiais.',
                'error' => 'insufficient_permissions'
            ], 403)
        );
    }
}