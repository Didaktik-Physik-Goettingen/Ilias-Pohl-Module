import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShuffleOrder {
    private orders = new Map<string, number[]>();

    /** Returns a stable shuffled index array for the given questionId and length.
     *  The same order is returned on every call within one page load. */
    getOrCreate(questionId: string, length: number): number[] {
        if (this.orders.has(questionId)) {
            return this.orders.get(questionId)!;
        }
        const indices = Array.from({ length }, (_, i) => i);
        for (let i = length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        this.orders.set(questionId, indices);
        return indices;
    }
}
