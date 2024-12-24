"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const MultipleCheckbox = React.forwardRef(({ placeholder, options, field }, ref) => {
    // Can be universal just make all data look same, control name variable only and if image is neccesserry then add it with if statement.

    // {
    //     name: "checkbox 1",
    // }

    // {
    //     name: "checkbox 1",
    //     image: "/image.png",
    // }

    const handleChange = (checked, value) => {
        const newValues = checked
            ? [...field.value, value]
            : field.value.filter((item) => item !== value);
        field.onChange(newValues);
    };

    return (
        <Select>
            <SelectTrigger className="w-full" ref={ref}>
                <span className={cn("block truncate", field.value.length === 0 && "text-muted-foreground")}>
                    {field.value && field.value.length > 0 ? field.value.join(", ") : placeholder}
                </span>
            </SelectTrigger>
            <SelectContent className="w-full">
                <SelectGroup>
                    {options.map((option) => (
                        <div
                            key={option.name}
                            className="flex items-center justify-between p-2 text-sm hover:bg-muted cursor-pointer"
                            onClick={() => handleChange(!field.value.includes(option.name), option.name)}
                        >
                            <div className="flex items-center">
                                <img className="w-[20px] h-[20px] mr-2 rounded object-cover" src={option.image} alt="business_network" />
                                <span>{option.name}</span>
                            </div>
                            <Checkbox checked={field.value.includes(option.name)} />
                        </div>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
});

MultipleCheckbox.displayName = "MultipleCheckbox";

export default MultipleCheckbox;
