import type { Kobo } from "$lib/kobo";
import { writable, type Writable } from "svelte/store";

export const koboState: Writable<Kobo | null> = writable(null)