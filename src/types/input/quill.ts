import {
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
import React from "react";
import {InputStatus} from "@/types";

export interface QuillOptions extends QuillOptionsStatic {
    tabIndex?: number,
    scrollingContainer?: string | HTMLElement,
}
export type QuillValue = string | DeltaStatic;
export type QuillRange = RangeStatic | null;
export interface ReactQuillProps {
    bounds?: string | HTMLElement,
    children?: React.ReactElement<unknown>,
    className?: string,
    defaultValue?: QuillValue,
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
    value?: QuillValue,
    status?:InputStatus,
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
export interface ReactQuillState {
    generation: number,
}