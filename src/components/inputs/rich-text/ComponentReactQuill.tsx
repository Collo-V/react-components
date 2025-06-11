import React, {useCallback, useEffect, useRef, useState} from 'react';
//@ts-expect-error Ignore
import Quill, {DeltaStatic, RangeStatic, Sources} from 'quill';
import {
    QuillOptions, QuillRange, QuillValue,
    ReactQuillProps, UnprivilegedEditor,
} from '@/types';
//@ts-expect-error Ignore
import isEqual from "lodash/isEqual";

function postpone(fn: () => void) {
    Promise.resolve().then(fn);
}
function ComponentReactQuill(
    props:ReactQuillProps
) {
    const editorRef = useRef<HTMLDivElement>(null);


    /*
    Changing one of these props should cause a regular update. These are mostly
    props that act on the container, rather than the quillized editing area.
    */

    //eslint-disable-next-line
    const cleanProps: (keyof ReactQuillProps)[] = [
        'id',
        'className',
        'style',
        'placeholder',
        'tabIndex',
        'onChange',
        'onChangeSelection',
        'onFocus',
        'onBlur',
        'onKeyPress',
        'onKeyDown',
        'onKeyUp',
    ]
    const defaultProps = {
        theme: 'snow',
        modules: {},
        readOnly: false,
    }
    const [value, setValue] = useState<QuillValue|string>(props.value ?? props.defaultValue ?? '');
    const [selection, setSelection] = useState<QuillRange>(null);
    const unprivilegedEditor = useRef<UnprivilegedEditor | null>(null);
    const lastDeltaChangeSet = useRef<DeltaStatic | undefined>(undefined);
    const regenerationSnapshot = useRef<{delta:DeltaStatic,selection:QuillRange} | null>(null);
    const editingArea = useRef<React.ReactInstance | null>(null)
    const editorInstance = useRef<Quill | null>(null)
    const [generation, setGeneration] = useState<number>(0)
    const getEditorConfig = useCallback((): QuillOptions => ({
        bounds: props.bounds,
        formats: props.formats,
        modules: props.modules ?? defaultProps.modules,
        placeholder: props.placeholder,
        readOnly: props.readOnly ?? false,
        scrollingContainer: props.scrollingContainer,
        tabIndex: props.tabIndex,
        theme: props.theme ?? defaultProps.theme,
    }), [props]);
    const getEditingArea = useCallback((): HTMLElement => {
        if (!editorRef.current) {
            throw new Error('Cannot find element for editing area');
        }
        if (editorRef.current.nodeType === 3) {
            throw new Error('Editing area cannot be a text node');
        }
        return editorRef.current;
    }, []);
    const setEditorSelection = useCallback((editor: Quill, range: QuillRange) => {
        setSelection(range);
        if (range) {
            const length = editor.getLength();
            const tempRange = {...range};
            tempRange.index = Math.max(0, Math.min(range.index, length-1));
            tempRange.length = Math.max(0, Math.min(range.length, (length-1) - range.index));
            editor.setSelection(tempRange);
        }
    }, []);
    const setEditorContents = useCallback((editor: Quill, val: QuillValue) => {
        setValue(val);
        const sel = selection;
        let delta:DeltaStatic
        if (typeof val === 'string') {
            delta = editor.clipboard.convert({html:val})
        } else {
            delta = val
        }
        editor.setContents(delta)
        postpone(() => setEditorSelection(editor, sel));
    }, [selection,setEditorSelection]);

    const setEditorTabIndex = useCallback((editor: Quill, tabIndex: number) => {
        if (editor?.scroll?.domNode) {
            (editor.scroll.domNode as HTMLElement).tabIndex = tabIndex;
        }
    }, []);

    const setEditorReadOnly = useCallback((editor: Quill, val: boolean) => {
        if (val) {
            editor.disable();
        } else {
            editor.enable();
        }
    }, []);

    const isControlled = useCallback(() => 'value' in props, [props]);

    const isDelta = useCallback((val: unknown): boolean => {
        return !!(val && (val as DeltaStatic)).ops
    }, []);

    const isEqualValue = useCallback((val: unknown, nextVal: unknown): boolean => {
        if (isDelta(val) && isDelta(nextVal)) {
            return isEqual((val as DeltaStatic).ops, (nextVal as DeltaStatic).ops);
        }
        return isEqual(val, nextVal);
    }, [isDelta]);

    const validateProps = useCallback((props: ReactQuillProps) => {
        if (React.Children.count(props.children) > 1) {
            throw new Error('The Quill editing area can only be composed of a single React element.');
        }

        if (React.Children.count(props.children)) {
            const child = React.Children.only(props.children);
            if (child?.type === 'textarea') {
                throw new Error('Quill does not support editing on a <textarea>. Use a <div> instead.');
            }
        }

        if (lastDeltaChangeSet.current && props.value === lastDeltaChangeSet.current) {
            throw new Error(
                'You are passing the `delta` object from the `onChange` event back ' +
                'as `value`. You most probably want `editor.getContents()` instead.'
            );
        }
    }, []);

    const onEditorChangeText = useCallback((
        val: string,
        delta: DeltaStatic,
        source: Sources,
        editor: UnprivilegedEditor,
    ) => {
        if (!editorInstance.current) return;

        const nextContents = isDelta(value)
            ? editor.getContents()
            : editor.getHTML();

        if (nextContents !== value) {
            lastDeltaChangeSet.current = delta;
            setValue(nextContents);
            props.onChange?.(val, delta, source, editor);
        }
    }, [isDelta, props.onChange, value]);

    const onEditorChangeSelection = useCallback((
        nextSelection: RangeStatic,
        source: Sources,
        editor: UnprivilegedEditor,
    ) => {
        if (!editorInstance.current) return;
        const currentSelection = selection;
        const hasGainedFocus = !currentSelection && nextSelection;
        const hasLostFocus = currentSelection && !nextSelection;

        if (isEqual(nextSelection, currentSelection)) return;

        setSelection(nextSelection);
        props.onChangeSelection?.(nextSelection, source, editor);

        if (hasGainedFocus) {
            props.onFocus?.(nextSelection, source, editor);
        } else if (hasLostFocus) {
            props.onBlur?.(currentSelection, source, editor);
        }
    }, [props.onBlur, props.onChangeSelection, props.onFocus, selection]);

    const onEditorChange = useCallback((
        eventName: 'text-change' | 'selection-change',
        rangeOrDelta: Range | DeltaStatic,
        oldRangeOrDelta: Range | DeltaStatic,
        source: Sources,
    ) => {
        if (eventName === 'text-change') {
            //TODO: Check what trims the contents
            onEditorChangeText(
                editorInstance.current!.root.innerHTML,
                rangeOrDelta as DeltaStatic,
                source,
                unprivilegedEditor.current!
            );
        } else if (eventName === 'selection-change') {
            onEditorChangeSelection(
                rangeOrDelta as RangeStatic,
                source,
                unprivilegedEditor.current!
            );
        }
    }, [onEditorChangeText, onEditorChangeSelection]);

    const makeUnprivilegedEditor = useCallback((editor: Quill): UnprivilegedEditor => ({
        getHTML: () => editor.root.innerHTML,
        getLength: editor.getLength.bind(editor),
        getText: editor.getText.bind(editor),
        getContents: editor.getContents.bind(editor),
        getSelection: editor.getSelection.bind(editor),
        getBounds: editor.getBounds.bind(editor),
    }), []);
    const hookEditor = useCallback((editor: Quill) => {
        unprivilegedEditor.current = makeUnprivilegedEditor(editor);
        editor.on('editor-change', onEditorChange);
    }, [makeUnprivilegedEditor]);

    const unhookEditor = useCallback((editor: Quill) => {
        editor.off('editor-change', onEditorChange);
    }, []);
    const createEditor = useCallback((element: HTMLElement, config: QuillOptions) => {
        const editor = new Quill(element, config);
        if (config.tabIndex != null) {
            setEditorTabIndex(editor, config.tabIndex);
        }
        hookEditor(editor);
        return editor;
    }, [hookEditor]);


    const instantiateEditor = useCallback(() => {
        if (editorInstance.current) {
            hookEditor(editorInstance.current);
        } else {
            editorInstance.current = createEditor(
                getEditingArea(),
                getEditorConfig()
            );
        }
    }, [createEditor, getEditingArea, getEditorConfig, hookEditor]);

    const renderEditingArea = useCallback(()=> {
        const {children, preserveWhitespace} = props;

        const properties = {
            key: generation,
            ref: (instance: React.ReactInstance | null) => {
                editingArea.current = instance
            },
        };

        if (React.Children.count(children)) {
            return React.cloneElement(
                React.Children.only(children)!,
                properties
            );
        }

        return preserveWhitespace ?
            <pre key={properties.key} {...properties.ref}/> :
            <div key={properties.key} {...properties.ref}/>;
    },[generation,props])

    const shouldRegenerate = useCallback((prevProps: ReactQuillProps) => {
        const dirtyProps: (keyof ReactQuillProps)[] = [
            'modules',
            'formats',
            'bounds',
            'theme',
            'children',
        ]
        return dirtyProps.some(prop => !isEqual(props[prop], prevProps[prop]));
    }, [props]);

    const destroyEditor = useCallback(() => {
        if (editorInstance.current) {
            unhookEditor(editorInstance.current);
            // editorInstance.current = null;
        }
    }, [unhookEditor]);

    //Step 1. Instantiate editor
    useEffect(() => {
        instantiateEditor();
        setEditorContents(editorInstance.current!, props.value);
        return () => {
            destroyEditor();
        };
    }, [instantiateEditor,setEditorContents,destroyEditor,props.value]);

    useEffect(() => {
        validateProps(props);
    }, [props, validateProps]);


    useEffect(() => {
        if (editorInstance.current && isControlled() && props.value !== undefined) {
            const prevContents = value;
            const nextContents = props.value ?? '';

            if (!isEqualValue(nextContents, prevContents)) {
                setEditorContents(editorInstance.current, nextContents);
            }
        }
    }, [isControlled, isEqualValue, props.value, setEditorContents, value]);

    useEffect(() => {
        if (editorInstance.current && props.readOnly !== undefined) {
            setEditorReadOnly(editorInstance.current, props.readOnly);
        }
    }, [props.readOnly, setEditorReadOnly]);

    useEffect(() => {
        if (editorInstance.current && shouldRegenerate(props)) {
            const delta = editorInstance.current.getContents();
            const sel = editorInstance.current.getSelection();
            regenerationSnapshot.current = { delta, selection:sel };
            setGeneration(prev => prev + 1);
            destroyEditor();
        }
    }, [destroyEditor, props, shouldRegenerate]);

    return (
        <div
            id={props.id}
            style={props.style}
            key={generation}
            className={` ${props.className ?? ''}`}
            onKeyPress={props.onKeyPress}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            ref={editorRef}
        >
            {renderEditingArea()}
        </div>
    );
}

export default ComponentReactQuill;