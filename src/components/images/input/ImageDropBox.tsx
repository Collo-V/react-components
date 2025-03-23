import React from 'react';
type Props = {
    onInput:(files:File[])=>void ,
    acceptedImageFormats:string[]
}
function ImageDropBox({onInput,acceptedImageFormats}:Props) {
    const handleDrop = (event:React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        // if(tempFiles.length>max)return
        if (event.dataTransfer.items) {
            const  files = []
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                // If dropped items aren't files and image , reject them

                if (event.dataTransfer.items[i].kind === 'file') {
                    const file = event.dataTransfer.items[i].getAsFile()
                    files.push(file!)
                }
            }
            onInput(files)
            // dispatch(addTempImages(...files))
        }

    }
    const selectImage = () => {
        // if(tempFiles.length>max)return
        const input=document.createElement("input");
        input.type="file";
        input.setAttribute('multiple',true.toString())
        input.accept=acceptedImageFormats.map(a=>a.replace('image/','.')).join(',')
        let files:File[]=[]
        input.onchange = e=>{
            if(!e)return
            const target = e.target as HTMLInputElement
            if(!target)return
            const tempFiles = target.files||[]
            files = [...tempFiles]
            onInput(files)
        }
        input.click()

    }

    return (
        <div
            id='images-drop-box'
            className="mt-4 lg:h-32 py-2 border-dotted border-1 rounded-md flex items-center justify-center cursor-pointer"
            onDragOver={(event) => {
                event.preventDefault()
            }}
            onDrop={handleDrop}
            onClick={selectImage}
        >
            <div className="h-fit text-center">
                {/*<FontAwesomeIcon icon={solid("cloud-arrow-up")}/>*/}
                <p className='my-2'>Select or drag your images here</p>
                {
                    acceptedImageFormats.length > 0 &&
                    <p className="italic text-gray-400">
                        (Accepts {acceptedImageFormats.map(a =>
                        a.replace('image/', '.')).join(', ')})
                    </p>
                }

                <p className="italic text-gray-400">
                    *(Images must be below 10mb)
                </p>
            </div>

        </div>
    );
}

export default ImageDropBox;