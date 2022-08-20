import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";

const Editor = ({contents, onEditor}) => {

  const config = {
    useSearch: false,
    spellcheck: false,
    enter: "P",
    defaultMode: "1",
    toolbarAdaptive: false,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    minHeight: 300,
    maxHeight: 500,
    // minWidth: 10,
    maxWidth: 700,
    buttons:
      "paragraph,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,|,font,fontsize,brush,align,|,link,|, enter, undo,redo",
    editorCssClass: "alic",
    placeHolder: "",
    controls: {
      fontsize: {
        list: [
          "8",
          "9",
          "10",
          "11",
          "12",
          "14",
          "16",
          "18",
          "24",
          "30",
          "36",
          "48",
          "60",
          "72",
          "96",
          "100"
        ]
      },
      font: {
        command: "fontname",
        list: {
          "": "Default",
          "'Open Sans',sans-serif": "Open Sans",
          "Helvetica,sans-serif": "Helvetica",
          "Arial,Helvetica,sans-serif": "Arial",
          "Georgia,serif": "Georgia",
          "Impact,Charcoal,sans-serif": "Impact",
          "Tahoma,Geneva,sans-serif": "Tahoma",
          "'Times New Roman',Times,serif": "Times New Roman",
          "Verdana,Geneva,sans-serif": "Verdana"
        }
      }
    }
  }

  const editor = useRef(null);

  const contentChange = (content) => {
    if (typeof onEditor === "function") {
      onEditor(content);
    }
  };

  return (
    <JoditEditor
      ref={editor}
      value={contents}
      config={config}
      tabIndex={3} // tabIndex of textarea
      onBlur={contentChange} // preferred to use only this option to update the content for performance reasons
      //  onChange={contentChange}
    />
  );
};

export default Editor