import React from 'react';
import {Popover} from "antd";

function InputStatusTypeComponent() {
    return (
        <Popover
            content={
            <div>
                {`'error' | 'warning' | ''`}
            </div>
            }
            trigger={'hover'}
        >
            <span className={'text-primary crc-underline'}>
                Input Status
            </span>
        </Popover>
    );
}

export default InputStatusTypeComponent;