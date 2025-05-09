import React, { useState, useEffect, useRef, useCallback, JSX } from 'react';
// @ts-expect-error Ignore
import isEqual from 'lodash/isEqual';
import Quill, {
    QuillOptions as QuillOptionsStatic,
    DeltaStatic,
    RangeStatic,
    BoundsStatic,
    StringMap,
    Sources,
} from 'quill';

export interface QuillOptions extends QuillOptionsStatic {
    tabIndex?: number,
}

export type Value = string | DeltaStatic;
export type Range = RangeStatic | null;

export interface ReactQuillProps {
    bounds?: string | HTMLElement,
    children?: React.ReactElement<unknown>,
    className?: string,
    defaultValue?: Value,
    formats?: string[],
    id?: string,
    modules?: StringMap,
    onChange?(
        value: string,
        delta: DeltaStatic,
        source: Sources,
        editor: UnprivilegedEditor,
    ): void,
    onChangeSelection?(
        selection: Range,
        source: Sources,
        editor: UnprivilegedEditor,
    ): void,
    onFocus?(
        selection: Range,
        source: Sources,
        editor: UnprivilegedEditor,
    ): void,
    onBlur?(
        previousSelection: Range,
        source: Sources,
        editor: UnprivilegedEditor,
    ): void,
    // @ts-expect-error Ignore
    onKeyDown?: React.EventHandler<unknown>,
    // @ts-expect-error Ignore
    onKeyPress?: React.EventHandler<unknown>,
    // @ts-expect-error Ignore
    onKeyUp?: React.EventHandler<unknown>,
    placeholder?: string,
    preserveWhitespace?: boolean,
    readOnly?: boolean,
    scrollingContainer?: string | HTMLElement,
    style?: React.CSSProperties,
    tabIndex?: number,
    theme?: string,
    value?: Value,
}

export interface UnprivilegedEditor {
    getLength(): number;
    getText(index?: number, length?: number): string;
    getHTML(): string;
    getBounds(index: number, length?: number): BoundsStatic;
    getSelection(focus?: boolean): RangeStatic;
    getContents(index?: number, length?: number): DeltaStatic;
}

/*
Small helper to execute a function in the next micro-tick.
*/
function postpone(fn: (value: void) => void) {
    Promise.resolve().then(fn);
}

const ReactQuill: React.FC<ReactQuillProps> = (props) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [generation, setGeneration] = useState(0);
    const [internalValue, setInternalValue] = useState<Value>(() => {
        return props.value !== undefined ? props.value : props.defaultValue ?? '';
    });
    const [selection, setSelection] = useState<Range>(null);
    const editorInstance = useRef<Quill | null>(null);
    const editingAreaRef = useRef<React.ReactInstance | null>(null);
    const [value, setValue] = useState(internalValue);

    const {
        bounds,
        children,
        className,
        formats,
        id,
        modules,
        placeholder,
        preserveWhitespace,
        readOnly,
        scrollingContainer,
        style,
        tabIndex,
        theme,
        onChange,
        onChangeSelection,
        onFocus,
        onBlur,
        onKeyDown,
        onKeyPress,
        onKeyUp
    } = props;

    // Use a stable variable to hold  unprivileged editor.
    const unprivilegedEditor = useRef<UnprivilegedEditor | null>(null);
    // lastDeltaChangeSet
    const lastDeltaChangeSet = useRef<DeltaStatic | undefined>(undefined);

    // regenerationSnapshot
    const regenerationSnapshot = useRef<{ delta: DeltaStatic; selection: Range } | undefined>(undefined);

    const dirtyProps: (keyof ReactQuillProps)[] = [
        'modules',
        'formats',
        'bounds',
        'theme',
        'children',
    ];

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
    ];

    const validateProps = (currentProps: ReactQuillProps) => {
        if (React.Children.count(currentProps.children) > 1) {
            throw new Error(
                'The Quill editing area can only be composed of a single React element.'
            );
        }

        if (React.Children.count(currentProps.children)) {
            const child = React.Children.only(currentProps.children);
            if (child?.type === 'textarea') {
                throw new Error(
                    'Quill does not support editing on a <textarea>. Use a <div> instead.'
                );
            }
        }

        if (
            lastDeltaChangeSet.current &&
            currentProps.value === lastDeltaChangeSet.current
        ) {
            throw new Error(
                'You are passing the `delta` object from the `onChange` event back ' +
                'as `value`. You most probably want `editor.getContents()` instead. ' +
                'See: https://github.com/zenoamaro/react-quill#using-deltas'
            );
        }
    };

    const isControlled = () => {
        return 'value' in props;
    };
    const makeUnprivilegedEditor = useCallback((editor: Quill): UnprivilegedEditor => {
        const e = editor;
        return {
            getHTML: () => e.root.innerHTML,
            getLength: e.getLength.bind(e),
            getText: e.getText.bind(e),
            getContents: e.getContents.bind(e),
            getSelection: e.getSelection.bind(e),
            getBounds: e.getBounds.bind(e),
        };
    }, []);
    const getEditorSelection = (): Range => {
        return selection;
    };

    const isDelta = (val: unknown): boolean => {
        // @ts-expect-error Ignore
        return val && val.ops;
    };

    const isEqualValue = (val: unknown, nextVal: unknown): boolean => {
        if (isDelta(val) && isDelta(nextVal)) {
            // @ts-expect-error Ignore
            return isEqual(val.ops, nextVal.ops);
        } else {
            return isEqual(val, nextVal);
        }
    };

    const setEditorContents = (editor: Quill, val: Value) => {
        setInternalValue(val);
        setValue(val)
        const sel = getEditorSelection();
        if (typeof val === 'string') {
            // @ts-expect-error Ignore
            editor.setContents(editor.clipboard.convert(val));
        } else {
            editor.setContents(val);
        }
        postpone(() => setEditorSelection(editor, sel));
    };

    const setEditorSelection = (editor: Quill, range: Range) => {
        setSelection(range);
        if (range) {
            const length = editor.getLength();
            const tempRange = { ...range };
            tempRange.index = Math.max(0, Math.min(range.index, length - 1));
            tempRange.length = Math.max(0, Math.min(range.length, (length - 1) - range.index));
            editor.setSelection(tempRange);
        }
    };

    const getEditorConfig = (): QuillOptions => {
        return {
            bounds,
            formats,
            modules,
            placeholder,
            readOnly,
            // @ts-expect-error Ignore
            scrollingContainer,
            tabIndex,
            theme,
        };
    };
    const getEditorContents = (): Value => {
        return value
    };
    const onEditorChangeText = useCallback(
        (
            newValue: string,
            delta: DeltaStatic,
            source: Sources,
            editor: UnprivilegedEditor,
        ): void => {
            console.log('there is a change.......')
            if (!editorInstance.current) return;

            const nextContents = isDelta(value)
                ? editor.getContents()
                : editor.getHTML();

            if (!isEqualValue(nextContents, getEditorContents())) {
                lastDeltaChangeSet.current = delta;
                setInternalValue(nextContents);
                setValue(nextContents)
                if(onChange){
                    onChange(newValue, delta, source, editor);
                }

            }
        },
        [getEditorContents, isDelta, onChange]
    );
    const onEditorChangeSelection = useCallback(
        (
            nextSelection: RangeStatic,
            source: Sources,
            editor: UnprivilegedEditor,
        ): void => {
            if (!editorInstance.current) return;
            const currentSelection = getEditorSelection();
            const hasGainedFocus = !currentSelection && nextSelection;
            const hasLostFocus = currentSelection && !nextSelection;

            if (isEqual(nextSelection, currentSelection)) return;

            setSelection(nextSelection);

            if (onChangeSelection) {
                onChangeSelection(nextSelection, source, editor);
            }


            if (hasGainedFocus && onFocus) {
                onFocus(nextSelection, source, editor);
            } else if (hasLostFocus && onBlur) {
                onBlur(currentSelection, source, editor);
            }
        },
        [getEditorSelection, onBlur, onFocus, onChangeSelection]
    );
    const onEditorChange = useCallback(
        (
            eventName: 'text-change' | 'selection-change',
            rangeOrDelta: Range | DeltaStatic,
            oldRangeOrDelta: Range | DeltaStatic,
            source: Sources,
        ) => {
            if (eventName === 'text-change') {
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
        },
        [onEditorChangeText, onEditorChangeSelection]
    );

    const getEditor = (): Quill => {
        if (!editorInstance.current) {
            throw new Error('Accessing non-instantiated editor');
        }
        return editorInstance.current;
    };
    const getEditingArea = (): Element => {
        const element = editorRef.current;
        if (!element) {
            throw new Error('Cannot find element for editing area');
        }
        if (element.nodeType === 3) {
            throw new Error('Editing area cannot be a text node');
        }
        return element as Element;
    };
    const hookEditor = useCallback((editor: Quill) => {
        // Expose the editor on change events via a weaker, unprivileged proxy
        // object that does not allow accidentally modifying editor state.
        unprivilegedEditor.current = makeUnprivilegedEditor(editor);
        // Using `editor-change` allows picking up silent updates, like selection
        // changes on typing.
        editor.on('editor-change', onEditorChange);
    }, [makeUnprivilegedEditor, onEditorChange]);

    const instantiateEditor = useCallback(() => {
        if (editorInstance.current) {
            hookEditor(editorInstance.current);
        } else {
            const element = getEditingArea();
            editorInstance.current = createEditor(
                element,
                getEditorConfig()
            );
        }
    }, [getEditorConfig, getEditingArea, hookEditor]);
    const unhookEditor = useCallback((editor: Quill) => {
        editor.off('editor-change', onEditorChange);
    }, [onEditorChange]);

    const destroyEditor = useCallback(() => {
        if (!editorInstance.current) return;
        unhookEditor(editorInstance.current);
    }, [unhookEditor]);

    const createEditor = (element: Element, config: QuillOptions) => {
        // @ts-expect-error Ignore
        const editor = new Quill(element, config);
        if (config.tabIndex != null) {
            setEditorTabIndex(editor, config.tabIndex);
        }
        hookEditor(editor);
        return editor;
    };

    const setEditorTabIndex = (editor: Quill, tabIndexValue: number) => {
        if (editor?.scroll?.domNode) {
            (editor.scroll.domNode as HTMLElement).tabIndex = tabIndexValue;
        }
    };

    const setEditorReadOnly = (editor: Quill, readOnlyValue: boolean) => {
        if (readOnlyValue) {
            editor.disable();
        } else {
            editor.enable();
        }
    };





    const renderEditingArea = (): JSX.Element => {
        const properties = {
            key: generation,
            ref: (instance: React.ReactInstance | null) => {
                editingAreaRef.current = instance
            },
        };

        if (React.Children.count(children)) {
            return React.cloneElement(
                React.Children.only(children)!,
                properties
            );
        }

        return preserveWhitespace ?
            <pre key={properties.key} {...properties.ref} /> :
            <div key={properties.key} {...properties.ref} />;
    };







    const focus = () => {
        if (!editorInstance.current) return;
        editorInstance.current.focus();
    };

    const blur = () => {
        if (!editorInstance.current) return;
        setSelection(null);
        editorInstance.current.blur();
    };

    useEffect(() => {
        validateProps(props);

        if (!editorInstance.current) {
            instantiateEditor();
        }

        return () => {
            destroyEditor();
        };
    }, [destroyEditor, instantiateEditor, props, validateProps]);

    useEffect(() => {
        if (editorInstance.current) {
            if ('value' in props) {
                const prevContents = getEditorContents();
                const nextContents = props.value ?? '';
                if (!isEqualValue(nextContents, prevContents)) {
                    setEditorContents(editorInstance.current, nextContents);
                }
            }
        }
    }, [props.value, isEqualValue, setEditorContents, getEditorContents,props]);

    useEffect(() => {
        if (editorInstance.current) {
            setEditorReadOnly(editorInstance.current, props.readOnly!);
        }
    }, [props.readOnly]);

    useEffect(() => {
        if (editorInstance.current && generation === 0) {
            setEditorContents(editorInstance.current, getEditorContents());
        }
    }, [generation, setEditorContents, getEditorContents]);

    useEffect(() => {
        if (editorInstance.current && generation !== 0) {
            if (regenerationSnapshot.current) {
                const { delta, selection: savedSelection } = regenerationSnapshot.current;
                regenerationSnapshot.current = undefined;
                instantiateEditor();
                const editor = editorInstance.current!;
                editor.setContents(delta);
                postpone(() => setEditorSelection(editor, savedSelection));
            }
        }
    }, [generation, instantiateEditor, setEditorContents, setEditorSelection]);

    useEffect(() => {
        if (editorInstance.current) {
            if (dirtyProps.some((prop) => !isEqual(props[prop], props[prop]))) {
                const delta = editorInstance.current.getContents();
                const selection = editorInstance.current.getSelection();
                regenerationSnapshot.current = { delta, selection };
                setGeneration(generation + 1);
                destroyEditor();
            }
        }
    }, [destroyEditor, generation, instantiateEditor, props, dirtyProps]);
    const defaultProps = {
        theme: 'snow',
        modules: {},
        readOnly: false,
    };

    return (
        <div
            id={id}
            style={style}
            key={generation}
            className={`quill ${className ?? ''}`}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            ref={editorRef}
        >
            {renderEditingArea()}
        </div>
    );
};



export default ReactQuill;
