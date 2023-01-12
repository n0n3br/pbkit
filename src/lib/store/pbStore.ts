import type Pocketbase from 'pocketbase';
import { writable } from 'svelte/store';

interface pbStore {
	pb?: Pocketbase;
}

export const pbStore = writable<pbStore>({});
