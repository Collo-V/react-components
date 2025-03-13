import {OpenGraph} from "next/dist/lib/metadata/types/opengraph-types";

export type Param = { [key: string]: string |string[]|undefined }
export interface PageProps {
    params: Promise<Param>
    searchParams: Promise<Param>
}
export interface PageMetadata {
    title?: string,
    description?: string,
    keywords?:string
    openGraph?:OpenGraph
}