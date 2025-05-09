import React, {JSX, useRef, useState} from 'react';
// @ts-expect-error Ignore
import isEqual from 'lodash/isEqual';

import Quill, {
    QuillOptions as QuillOptionsStatic,
// @ts-expect-error Ignore
    DeltaStatic,
// @ts-expect-error Ignore
    RangeStatic,
// @ts-expect-error Ignore
    BoundsStatic,
// @ts-expect-error Ignore
    StringMap,
// @ts-expect-error Ignore
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
// Merged namespace hack to export types along with default object
interface ReactQuillState {
    generation: number,
}
function ComponentReactQuill(
    {}:ReactQuillProps
) {
    const editorRef = useRef<HTMLDivElement>(null);
    const dirtyProps: (keyof ReactQuillProps)[] = [
        'modules',
        'formats',
        'bounds',
        'theme',
        'children',
    ]

    /*
    Changing one of these props should cause a regular update. These are mostly
    props that act on the container, rather than the quillized editing area.
    */
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
    const editor = Quill
    const editingArea?: React.ReactInstance | null
    const [generation, setGeneration] = useState<number>(0)

    return (
        <div></div>
    );
}

export default ComponentReactQuill;