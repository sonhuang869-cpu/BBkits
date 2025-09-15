<?php

namespace App\Mail;

use App\Models\Material;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StockChangeAlert extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Material $material,
        public float $oldStock,
        public float $newStock,
        public string $reason = ''
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $change = $this->newStock - $this->oldStock;
        $changeType = $change > 0 ? 'Aumento' : 'Diminuição';

        return new Envelope(
            subject: "📊 {$changeType} de Estoque: {$this->material->name} - " . config('app.name'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $change = $this->newStock - $this->oldStock;
        $changePercentage = $this->oldStock > 0 ? ($change / $this->oldStock) * 100 : 100;

        return new Content(
            view: 'emails.stock-change-alert',
            with: [
                'material' => $this->material,
                'oldStock' => $this->oldStock,
                'newStock' => $this->newStock,
                'change' => $change,
                'changePercentage' => $changePercentage,
                'reason' => $this->reason,
                'isIncrease' => $change > 0,
                'isSignificant' => abs($changePercentage) > 25,
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