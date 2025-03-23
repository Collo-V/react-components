export type ImageInputResponseObject = {
    file:File,
    preview:string,
}

export type ImageValidationObject = {
    file:File,
    preview:string,
    error?:string,
    warning?:string
}

export type ImageInputComponentProps = {
    imagesHaveErrors:boolean,
    imagesHaveWarnings:boolean,
    replaceImage:(index:number,replacement:File|ImageValidationObject)=>void,
    handleInputs:(files:File[])=>void,
    removeImage:(index:number)=>void,
    onDone:()=>void,
    onCancel:()=>void,
    loading:boolean,
    title:string,
    acceptedImageFormats:string[],
    guidelines:string[],
    tempFiles:ImageValidationObject[],
    max:number,
    aspectRatio:number,
    minSizes:number[]
}