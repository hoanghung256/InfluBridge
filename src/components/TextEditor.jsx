import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function TextEditor({ value, onChange, defaultRows = 5 }) {
    const quillRef = useRef(null);

    useEffect(() => {
        const el = quillRef.current?.editor?.root;
        if (el) {
            const lineHeight = 1.5; // em
            el.style.minHeight = `${defaultRows * lineHeight}em`;
            el.style.overflowY = "hidden";

            const resize = () => {
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
            };

            el.addEventListener("input", resize);
            resize();

            return () => el.removeEventListener("input", resize);
        }
    }, [value, defaultRows]);

    return <ReactQuill ref={quillRef} theme="snow" value={value} onChange={onChange} />;
}

export default TextEditor;
