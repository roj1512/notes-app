import { create } from "zustand";
import { headers } from "./misc";
import { Note } from "./types";

export type View = { _: "notes" } | {
  _: "note";
  id: string;
  initialState: string;
};

export const notesStore = create<
  { notes: Note[] | null }
>(() => ({
  notes: null,
}));

export async function loadNotes() {
  const res = await fetch("/notes", { headers });
  if (res.status == 200) {
    notesStore.setState({ notes: await res.json() });
  }
}

export const viewStore = create<
  { view: View; setView: (view: View) => void }
>((set) => ({
  view: { _: "notes" },
  setView: (view: View) => set({ view }),
}));

export const editorStore = create<
  {
    empty: boolean;
    editable: boolean;
    shouldFocus: boolean;
    linkDialogOpen: boolean;
    link: boolean;
    helpDialogOpen: boolean;
  }
>(
  () => ({
    empty: false,
    editable: false,
    shouldFocus: false,
    link: false,
    linkDialogOpen: false,
    helpDialogOpen: false,
  }),
);

viewStore.subscribe(({ view: { _ } }) => {
  if (_ != "note") {
    editorStore.setState({ linkDialogOpen: false });
  }
});

let isLoadingNote = false;
export async function loadNote(id: string, editable = false) {
  if (isLoadingNote) {
    return;
  }
  editorStore.setState({ editable });
  isLoadingNote = true;
  try {
    const res = await fetch(`/notes/${id}`, { headers });
    if (res.status == 200) {
      const initialState = await res.text();
      viewStore.setState({
        view: {
          _: "note",
          id,
          initialState,
        },
      });
    }
  } finally {
    isLoadingNote = false;
  }
}
