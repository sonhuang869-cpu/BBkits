<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class LowStockAlert extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Collection $materials,
        public bool $isOutOfStock = false
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->isOutOfStock
            ? '🚨 URGENTE: Materiais Sem Estoque - ' . config('app.name')
            : '⚠️ Alerta: Materiais com Estoque Baixo - ' . config('app.name');

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.low-stock-alert',
            with: [
                'materials' => $this->materials,
                'isOutOfStock' => $this->isOutOfStock,
                'totalCount' => $this->materials->count(),
                'criticalCount' => $this->materials->filter(fn($m) => $m->current_stock <= 0)->count(),
                'lowCount' => $this->materials->filter(fn($m) => $m->current_stock > 0 && $m->current_stock <= $m->minimum_stock)->count(),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}