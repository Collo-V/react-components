import React from 'react';
import {Popover} from "antd";

function ImageInputResponseObjectComponent() {
    return (
        <Popover
            content={
                <div className={'crc-grid crc-gap-2'}>
                    <span>
                        file:File,

                    </span>
                    <span>
                        preview:string,

                    </span>
                </div>
            }
            trigger={'hover'}
        >
            <span className={'text-primary crc-underline'}>
                ImageResponseObject
            </span>
        </Popover>
    );
}

export default ImageInputResponseObjectComponent;