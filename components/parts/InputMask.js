import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

export default function InputMask(props) {
    const [showChild, setShowChild] = useState(false);

    // Wait until after client-side hydration to show
    useEffect(() => {
        setShowChild(true);
    }, []);

    if (!showChild) {
        // You can show some kind of placeholder UI here
        return <input {...props} />;
    }

    return (
        <Controller
            name={props.name}
            rules={props.rules}
            control={props.control}
            render={({ field }) => (
                <ReactInputMask
                    {...field}
                    mask={props.mask}
                    maskPlaceholder={""}
                    className={props.className}
                    placeholder={props.placeholder}
                />
            )}
        />
    )
}