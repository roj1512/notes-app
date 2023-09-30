import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
} from "lexical";
import { useEffect } from "react";

export function ShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey, shiftKey } = event;
        if (code == "KeyX" && (ctrlKey || metaKey) && shiftKey) {
          event.preventDefault();
          //   editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return false;
            }
            if (selection.hasFormat("strikethrough")) {
                // selection
            }
            selection.formatText("strikethrough");
          });
          return true;
        } else if (code == "KeyM" && (ctrlKey || metaKey) && shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);

  return null;
}
